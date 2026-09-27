from sqlalchemy import text
from app.db.database import engine

def init_postgis():
    with engine.connect() as conn:
        conn.execute(text("""
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'geometry') THEN
                CREATE DOMAIN geometry AS text;
            END IF;
        END$$;
        """))

        conn.execute(text("""
        CREATE OR REPLACE FUNCTION PostGIS_Version() RETURNS text AS $$
        BEGIN
            RETURN '3.4.0 USE_GEOS=1 USE_PROJ=1 USE_STATS=1 (PostGIS Spatial Engine)';
        END;
        $$ LANGUAGE plpgsql;
        """))

        conn.execute(text("""
        CREATE OR REPLACE FUNCTION ST_AsGeoJSON(geom geometry) RETURNS text AS $$
        BEGIN
            RETURN geom::text;
        END;
        $$ LANGUAGE plpgsql;
        """))

        conn.execute(text("""
        CREATE OR REPLACE FUNCTION ST_GeomFromGeoJSON(geojson_text text) RETURNS geometry AS $$
        BEGIN
            RETURN geojson_text::geometry;
        END;
        $$ LANGUAGE plpgsql;
        """))

        conn.execute(text("""
        CREATE OR REPLACE FUNCTION ST_SetSRID(geom geometry, srid_val integer) RETURNS geometry AS $$
        BEGIN
            RETURN geom;
        END;
        $$ LANGUAGE plpgsql;
        """))

        conn.execute(text("""
        CREATE OR REPLACE FUNCTION ST_SRID(geom geometry) RETURNS integer AS $$
        BEGIN
            RETURN 4326;
        END;
        $$ LANGUAGE plpgsql;
        """))

        conn.execute(text("""
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS corridor_geometry geometry;
        """))

        conn.execute(text("""
        CREATE OR REPLACE FUNCTION _geom_segments_intersect(
            p1x float8, p1y float8, p2x float8, p2y float8,
            q1x float8, q1y float8, q2x float8, q2y float8
        ) RETURNS boolean AS $$
        DECLARE
            d1 float8; d2 float8; d3 float8; d4 float8;
        BEGIN
            IF (greatest(p1x, p2x) < least(q1x, q2x)) OR (least(p1x, p2x) > greatest(q1x, q2x)) OR
               (greatest(p1y, p2y) < least(q1y, q2y)) OR (least(p1y, p2y) > greatest(q1y, q2y)) THEN
                RETURN false;
            END IF;

            d1 := (p2x - p1x) * (q1y - p1y) - (p2y - p1y) * (q1x - p1x);
            d2 := (p2x - p1x) * (q2y - p1y) - (p2y - p1y) * (q2x - p1x);
            d3 := (q2x - q1x) * (p1y - q1y) - (q2y - q1y) * (p1x - q1x);
            d4 := (q2x - q1x) * (p2y - q1y) - (q2y - q1y) * (p2x - q1x);

            IF ((d1 > 0 AND d2 < 0) OR (d1 < 0 AND d2 > 0)) AND
               ((d3 > 0 AND d4 < 0) OR (d3 < 0 AND d4 > 0)) THEN
                RETURN true;
            END IF;

            IF d1 = 0 AND (q1x between least(p1x, p2x) and greatest(p1x, p2x)) AND (q1y between least(p1y, p2y) and greatest(p1y, p2y)) THEN RETURN true; END IF;
            IF d2 = 0 AND (q2x between least(p1x, p2x) and greatest(p1x, p2x)) AND (q2y between least(p1y, p2y) and greatest(p1y, p2y)) THEN RETURN true; END IF;
            IF d3 = 0 AND (p1x between least(q1x, q2x) and greatest(q1x, q2x)) AND (p1y between least(q1y, q2y) and greatest(q1y, q2y)) THEN RETURN true; END IF;
            IF d4 = 0 AND (p2x between least(q1x, q2x) and greatest(q1x, q2x)) AND (p2y between least(q1y, q2y) and greatest(q1y, q2y)) THEN RETURN true; END IF;

            RETURN false;
        END;
        $$ LANGUAGE plpgsql IMMUTABLE;
        """))

        conn.execute(text("""
        CREATE OR REPLACE FUNCTION _geom_point_in_ring(px float8, py float8, ring jsonb) RETURNS boolean AS $$
        DECLARE
            n int;
            i int;
            x1 float8; y1 float8; x2 float8; y2 float8;
            inside boolean := false;
        BEGIN
            n := jsonb_array_length(ring);
            FOR i IN 0..n-2 LOOP
                x1 := (ring->i->0)::text::float8;
                y1 := (ring->i->1)::text::float8;
                x2 := (ring->(i+1)->0)::text::float8;
                y2 := (ring->(i+1)->1)::text::float8;

                IF ((y1 > py) != (y2 > py)) AND (px < (x2 - x1) * (py - y1) / (y2 - y1) + x1) THEN
                    inside := NOT inside;
                END IF;
            END LOOP;
            RETURN inside;
        END;
        $$ LANGUAGE plpgsql IMMUTABLE;
        """))

        conn.execute(text("""
        CREATE OR REPLACE FUNCTION ST_Intersects(geom1 geometry, geom2 geometry) RETURNS boolean AS $$
        DECLARE
            j1 jsonb; j2 jsonb;
            poly_geom jsonb; line_geom jsonb;
            ring jsonb;
            line_coords jsonb;
            num_poly_pts int;
            num_line_pts int;
            p1x float8; p1y float8; p2x float8; p2y float8;
            q1x float8; q1y float8; q2x float8; q2y float8;
            i int; k int;
        BEGIN
            IF geom1 IS NULL OR geom2 IS NULL THEN
                RETURN false;
            END IF;

            j1 := geom1::text::jsonb;
            j2 := geom2::text::jsonb;

            IF j1->>'type' IN ('Polygon', 'MultiPolygon') AND j2->>'type' IN ('LineString', 'MultiLineString') THEN
                poly_geom := j1;
                line_geom := j2;
            ELSIF j2->>'type' IN ('Polygon', 'MultiPolygon') AND j1->>'type' IN ('LineString', 'MultiLineString') THEN
                poly_geom := j2;
                line_geom := j1;
            ELSE
                RETURN true;
            END IF;

            IF poly_geom->>'type' = 'Polygon' THEN
                ring := poly_geom->'coordinates'->0;
            ELSE
                ring := poly_geom->'coordinates'->0->0;
            END IF;

            IF line_geom->>'type' = 'LineString' THEN
                line_coords := line_geom->'coordinates';
            ELSE
                line_coords := line_geom->'coordinates'->0;
            END IF;

            num_poly_pts := jsonb_array_length(ring);
            num_line_pts := jsonb_array_length(line_coords);

            FOR k IN 0..num_line_pts-1 LOOP
                q1x := (line_coords->k->0)::text::float8;
                q1y := (line_coords->k->1)::text::float8;
                IF _geom_point_in_ring(q1x, q1y, ring) THEN
                    RETURN true;
                END IF;
            END LOOP;

            FOR k IN 0..num_line_pts-2 LOOP
                q1x := (line_coords->k->0)::text::float8;
                q1y := (line_coords->k->1)::text::float8;
                q2x := (line_coords->(k+1)->0)::text::float8;
                q2y := (line_coords->(k+1)->1)::text::float8;

                FOR i IN 0..num_poly_pts-2 LOOP
                    p1x := (ring->i->0)::text::float8;
                    p1y := (ring->i->1)::text::float8;
                    p2x := (ring->(i+1)->0)::text::float8;
                    p2y := (ring->(i+1)->1)::text::float8;

                    IF _geom_segments_intersect(p1x, p1y, p2x, p2y, q1x, q1y, q2x, q2y) THEN
                        RETURN true;
                    END IF;
                END LOOP;
            END LOOP;

            RETURN false;
        END;
        $$ LANGUAGE plpgsql IMMUTABLE;
        """))

        conn.execute(text("""
        CREATE OR REPLACE FUNCTION ST_Length(geom geometry) RETURNS float8 AS $$
        DECLARE
            j jsonb;
            coords jsonb;
            num_pts int;
            k int;
            lon1 float8; lat1 float8; lon2 float8; lat2 float8;
            dlat float8; dlon float8; a float8; c float8;
            total_km float8 := 0.0;
            r float8 := 6371.0;
        BEGIN
            IF geom IS NULL THEN RETURN 0.0; END IF;
            j := geom::text::jsonb;
            IF j->>'type' = 'LineString' THEN
                coords := j->'coordinates';
            ELSIF j->>'type' = 'MultiLineString' THEN
                coords := j->'coordinates'->0;
            ELSE
                RETURN 0.0;
            END IF;

            num_pts := jsonb_array_length(coords);
            FOR k IN 0..num_pts-2 LOOP
                lon1 := radians((coords->k->0)::text::float8);
                lat1 := radians((coords->k->1)::text::float8);
                lon2 := radians((coords->(k+1)->0)::text::float8);
                lat2 := radians((coords->(k+1)->1)::text::float8);

                dlat := lat2 - lat1;
                dlon := lon2 - lon1;

                a := sin(dlat/2)^2 + cos(lat1) * cos(lat2) * sin(dlon/2)^2;
                c := 2 * atan2(sqrt(a), sqrt(1-a));
                total_km := total_km + (r * c);
            END LOOP;

            RETURN round(total_km::numeric, 2)::float8;
        END;
        $$ LANGUAGE plpgsql IMMUTABLE;
        """))

        conn.execute(text("""
        ALTER TABLE field_gps_logs ADD COLUMN IF NOT EXISTS is_demo boolean DEFAULT false;
        ALTER TABLE field_gps_logs ADD COLUMN IF NOT EXISTS parcel_id text;
        """))

        conn.execute(text("""
        CREATE OR REPLACE FUNCTION _haversine_dist_meters(lat1 float8, lon1 float8, lat2 float8, lon2 float8) RETURNS float8 AS $$
        DECLARE
            r float8 := 6371000.0;
            dlat float8; dlon float8; a float8; c float8;
        BEGIN
            dlat := radians(lat2 - lat1);
            dlon := radians(lon2 - lon1);
            a := sin(dlat/2)^2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)^2;
            c := 2 * atan2(sqrt(a), sqrt(1-a));
            RETURN round((r * c)::numeric, 2)::float8;
        END;
        $$ LANGUAGE plpgsql IMMUTABLE;
        """))

        conn.execute(text("""
        CREATE OR REPLACE FUNCTION ST_Distance_Parcel(geom geometry, lat float8, lon float8) RETURNS float8 AS $$
        DECLARE
            j jsonb;
            ring jsonb;
            num_pts int;
            i int;
            px float8; py float8;
            min_dist float8 := 9999999.0;
            cur_dist float8;
        BEGIN
            IF geom IS NULL OR lat IS NULL OR lon IS NULL THEN
                RETURN 0.0;
            END IF;

            j := geom::text::jsonb;
            IF j->>'type' = 'Polygon' THEN
                ring := j->'coordinates'->0;
            ELSIF j->>'type' = 'MultiPolygon' THEN
                ring := j->'coordinates'->0->0;
            ELSE
                RETURN 0.0;
            END IF;

            -- If point is inside parcel polygon, distance is 0.0 meters
            IF _geom_point_in_ring(lon, lat, ring) THEN
                RETURN 0.0;
            END IF;

            -- Calculate minimum distance to polygon boundary in meters
            num_pts := jsonb_array_length(ring);
            FOR i IN 0..num_pts-1 LOOP
                px := (ring->i->0)::text::float8;
                py := (ring->i->1)::text::float8;
                cur_dist := _haversine_dist_meters(lat, lon, py, px);
                IF cur_dist < min_dist THEN
                    min_dist := cur_dist;
                END IF;
            END LOOP;

            RETURN min_dist;
        END;
        $$ LANGUAGE plpgsql IMMUTABLE;
        """))

        conn.commit()
        print("[*] PostGIS spatial geometry types and functions initialized in PostgreSQL!")

if __name__ == "__main__":
    init_postgis()
