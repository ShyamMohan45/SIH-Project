import sqlalchemy
from sqlalchemy.types import UserDefinedType

class PostGISGeometry(UserDefinedType):
    """
    SQLAlchemy spatial type mapped directly to PostgreSQL PostGIS geometry column.
    Supports EPSG:4326 (WGS84).
    Automatically wraps inputs in ST_GeomFromGeoJSON and outputs in ST_AsGeoJSON.
    """
    def get_col_spec(self, **kw):
        return "geometry"

    def bind_expression(self, bindvalue):
        return sqlalchemy.func.ST_GeomFromGeoJSON(bindvalue)

    def column_expression(self, col):
        return sqlalchemy.func.ST_AsGeoJSON(col)
