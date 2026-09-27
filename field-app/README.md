# N-LAMS Field — Android Application & Ground Verification PWA

**National Land Acquisition & Management System (N-LAMS)**  
*Ministry of Rural Development • Department of Land Resources (DoLR)*  
*Smart India Hackathon (SIH) Problem Statement ID: 26016*

---

## Overview

**N-LAMS Field** (`in.nlams.field`) is the native Android and mobile-first progressive web application for government Field Officers, Revenue Surveyors, and Competent Authorities for Land Acquisition (CALA). It provides an end-to-end digital ground verification workflow that synchronizes field observations directly with the N-LAMS National Platform.

---

## Key Features

1. **Native GPS Verification**:
   - High-accuracy native Android GPS detection via `@capacitor/geolocation`.
   - Real-time geodesic distance calculation (Haversine formula) to cadastral parcel centroid.
   - Built-in **DEMO GPS Mode** (`22.386221, 71.064316`, 12.4m offset) for stage presentations where indoor GPS is obstructed.

2. **Native Camera & Geotagged Evidence**:
   - Camera integration via `@capacitor/camera` with instant live preview and `RETAKE` / `USE PHOTO` controls.
   - Automated metadata stamping: timestamp, latitude, longitude, accuracy, officer ID, and evidence category.
   - Supported categories: *Survey/Khasra Marker*, *Boundary*, *Land/Crop*, *Structure*, *Encroachment*, *Compensation Evidence*, *Other*.

3. **Interactive Cadastral GIS Map**:
   - Embedded Leaflet/React-Leaflet vector cadastre showing all 52 project land parcels with acquisition stage color-coding.
   - Real-time officer location pin with pulsing accuracy ring.

4. **Comprehensive 6-Step Verification Workflow**:
   - **Step 1 — Location**: Native GPS lock & distance tolerance check (±150m).
   - **Step 2 — Parcel / Khasra**: Physical survey stone verification against revenue records.
   - **Step 3 — Boundary & Land Use**: Mismatch reporting, actual vs recorded land use, crop status, unauthorized structures, and Right-of-Way (RoW) encroachments.
   - **Step 4 — Occupancy & Compensation**: Titleholder/occupant identification, PFMS award disbursement confirmation, circle rate valuation disputes, and R&R entitlement review.
   - **Step 5 — Automated Smart Issues**: Auto-aggregates discrepancies into high-priority action items.
   - **Step 6 — Officer Oath & Submission**: Digital sign-off, instant backend synchronization, and closed-loop AI risk recalculation.

5. **Robust Offline-First & Sync Engine**:
   - Automatic step draft persistence via `localStorage` / `IndexedDB`.
   - Network status monitoring via `@capacitor/network` with visual `✓ Online` / `⚠ Offline` indicators.
   - Hardware back button interception preventing accidental loss of unfinished inspections with a dedicated `SAVE DRAFT` / `DISCARD` / `CANCEL` modal.
   - One-tap batch synchronization via `POST /api/sync`.

---

## Application Metadata

- **App Name**: `N-LAMS Field`
- **Package ID**: `in.nlams.field`
- **Version**: `1.0.0`
- **Target Platform**: Android (API 24 to 35) & Modern Mobile Browsers
- **Build System**: Vite 6 + React 18 + Capacitor 7/8 + Gradle 8.14.3

---

## Project Structure

```text
field-app/
├── android/                        # Native Android Studio Project
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml # Permissions (GPS, Camera, Internet, Cleartext)
│   │   │   ├── assets/public/      # Synced production web build
│   │   │   ├── java/in/nlams/field/MainActivity.java
│   │   │   └── res/                # App launcher icons & splash screens
│   │   └── build.gradle
│   ├── build.gradle
│   ├── local.properties            # Android SDK location pointer
│   └── variables.gradle            # SDK and dependency version matrix
├── public/
│   ├── manifest.json               # Web PWA Manifest
│   └── sw.js                       # Service Worker for offline caching
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── CameraCaptureModal.jsx  # Native camera capture & preview
│   │   │   └── StatusBadge.jsx
│   │   └── layout/
│   │       └── FieldLayout.jsx     # Government header, network pill & bottom nav
│   ├── pages/
│   │   ├── LoginPage.jsx           # Officer authentication
│   │   ├── HomePage.jsx            # Stats strip & assigned hero inspection
│   │   ├── TasksPage.jsx           # Inspection queue & priority filters
│   │   ├── FieldMapPage.jsx        # Cadastral GIS map
│   │   ├── InspectionWorkflowPage.jsx # 6-Step ground truth verification
│   │   ├── HistoryPage.jsx         # Submitted dossiers & printable records
│   │   └── ProfilePage.jsx         # Officer credentials & sync queue
│   ├── services/
│   │   ├── api.js                  # Axios client with dynamic LAN IP detection
│   │   ├── nativeService.js        # Capacitor GPS, Camera, Network, Back Button
│   │   ├── geoUtils.js             # Geodesic calculations & demo coordinates
│   │   └── offlineStorage.js       # Draft storage & offline queue
│   ├── App.jsx                     # Root application coordinator
│   └── main.jsx
├── capacitor.config.json           # Capacitor configuration
├── package.json
└── vite.config.js
```

---

## Prerequisites & SDK Requirements

1. **Java Development Kit (JDK)**: Microsoft OpenJDK 21 (or 17)
2. **Android SDK**:
   - Command Line Tools (`cmdline-tools/latest`)
   - Platform Tools (`platform-tools`)
   - Build Tools: `34.0.0` or `35.0.0`
   - Platform: `android-34` or `android-35`
3. **Node.js**: v18+ or v20+

---

## Build Commands

### 1. Build Web Assets
```bash
npm install
npm run build
```

### 2. Sync to Android Native Project
```bash
npx cap sync android
```

### 3. Open in Android Studio
```bash
npx cap open android
```

### 4. Build Debug APK (Command Line)
```bash
cd android
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.12.101-hotspot"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
.\gradlew.bat assembleDebug
```
The output APK is generated at:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## Release Build & App Bundle (AAB) Instructions

### 1. Generate a Release Signing Keystore
```bash
keytool -genkey -v -keystore nlams-release.jks -alias nlams_field -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure `android/app/build.gradle`
```groovy
android {
    signingConfigs {
        release {
            storeFile file(System.getenv("KEYSTORE_PATH") ?: "nlams-release.jks")
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS") ?: "nlams_field"
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3. Generate Android App Bundle (.aab) for Google Play
```bash
cd android
.\gradlew.bat bundleRelease
```
Output: `android/app/build/outputs/bundle/release/app-release.aab`

---

## Testing on Physical Android Phones

### 1. Connect Phone to Laptop's Local Wi-Fi Network
Ensure both the development machine and the Android phone are connected to the same Wi-Fi network.

### 2. Find Your Laptop's LAN IP
Run on Windows PowerShell:
```powershell
ipconfig
# Note the IPv4 Address (e.g. 192.168.0.117 or 192.168.1.100)
```

### 3. Configure Backend Base URL
In `field-app/.env` or runtime:
```bash
VITE_API_BASE_URL=http://<YOUR_LAPTOP_LAN_IP>:8000/api
```
*(The app automatically detects the host IP when accessed through a browser on mobile).*

### 4. Install Debug APK on Phone
- Enable **USB Debugging** on the Android phone (Developer Options).
- Connect via USB and run:
  ```bash
  adb install -r android/app/build/outputs/apk/debug/app-debug.apk
  ```
- Or copy `app-debug.apk` to phone storage and tap to install (allow install from unknown sources for testing).

---

## Dual-Screen SIH Demonstration Workflow

| Step | Device | Screen / Role | Action & Expected Outcome |
| :---: | :---: | :---: | :--- |
| **1** | Laptop | National Platform (`:3008`) | Open `NH-GJ-2026-001` → Khasra 1042 task is assigned to `FO-007`. Current project risk: **78% HIGH**. |
| **2** | Android Phone | N-LAMS Field App (`in.nlams.field`) | Officer logs in (`FO-007` / `Gov#Secure2026`). Dashboard displays 8 assigned tasks. |
| **3** | Android Phone | N-LAMS Field App | Open high-priority task **Khasra 1042** (Limbdi, Surendranagar). Tap **START INSPECTION**. |
| **4** | Android Phone | Step 1 — Location | Tap **Detect Device GPS** (or **Use Demo GPS**). Distance reads `12.4 m` with `✓ LOCATION MATCHED`. |
| **5** | Android Phone | Step 2 — Parcel | Inspect survey marker `1042`. Verified against digital cadastre. |
| **6** | Android Phone | Step 3 — Boundary & Land Use | Flag **Boundary Mismatch** (4.2m variation). Mark agricultural use and pump shed structure. |
| **7** | Android Phone | Evidence & Camera | Tap **Capture Photo**. Take picture of physical marker and boundary edge with geotag stamp. |
| **8** | Android Phone | Step 4 — Occupancy & Compensation | Interview occupant `Rajubhai Patel`. Record circle rate revision objection. |
| **9** | Android Phone | Step 5 — Smart Issues | Review 3 aggregated high-priority issues. |
| **10** | Android Phone | Step 6 — Declaration & Submit | Complete officer declaration and tap **SUBMIT INSPECTION**. Dossier `FO-1042-2026-001` generated. |
| **11** | Laptop | National Platform (`:3008`) | Inspection arrives in real-time. Cadastral parcel status updates to **Disputed**. AI delay risk recalculates to **96% CRITICAL** (+12% dispute, +8% boundary). High-priority field alert is raised. |
