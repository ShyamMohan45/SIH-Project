import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Network } from '@capacitor/network';
import { App as CapApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';

export const nativeService = {
  isNative: Capacitor.isNativePlatform(),
  platform: Capacitor.getPlatform(),

  // ----------------------------------------------------
  // SPLASH SCREEN
  // ----------------------------------------------------
  hideSplashScreen: async () => {
    try {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        await SplashScreen.hide();
      }
    } catch (e) {
      console.warn('SplashScreen hide warning:', e);
    }
  },

  // ----------------------------------------------------
  // NETWORK MONITORING
  // ----------------------------------------------------
  getNetworkStatus: async () => {
    try {
      if (Capacitor.isPluginAvailable('Network')) {
        const status = await Network.getStatus();
        return {
          connected: status.connected,
          connectionType: status.connectionType
        };
      }
    } catch (e) {
      console.warn('Network plugin warning:', e);
    }
    return {
      connected: typeof navigator !== 'undefined' ? navigator.onLine : true,
      connectionType: 'unknown'
    };
  },

  onNetworkChange: (callback) => {
    try {
      if (Capacitor.isPluginAvailable('Network')) {
        const listener = Network.addListener('networkStatusChange', (status) => {
          callback(status.connected, status.connectionType);
        });
        return () => listener.then(l => l.remove());
      }
    } catch (e) {
      console.warn('Network listener warning:', e);
    }

    const handleOnline = () => callback(true, 'wifi');
    const handleOffline = () => callback(false, 'none');
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  },

  // ----------------------------------------------------
  // NATIVE GPS GEOLOCATION
  // ----------------------------------------------------
  getGpsLocation: async () => {
    try {
      if (Capacitor.isPluginAvailable('Geolocation')) {
        // Check and request permission if native
        if (Capacitor.isNativePlatform()) {
          const perm = await Geolocation.checkPermissions();
          if (perm.location !== 'granted') {
            const req = await Geolocation.requestPermissions();
            if (req.location !== 'granted') {
              throw new Error('PERMISSION_DENIED');
            }
          }
        }

        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });

        return {
          success: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy || 8),
          altitude: position.coords.altitude,
          isReal: true,
          timestamp: new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn('Native GPS attempt failed:', err);
      if (err.message === 'PERMISSION_DENIED') {
        throw new Error('Location permission was denied by officer. Please enable Location in Android Settings.');
      }
    }

    // Web Fallback
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              success: true,
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: Math.round(pos.coords.accuracy || 10),
              isReal: true,
              timestamp: new Date().toISOString()
            });
          },
          (err) => {
            reject(new Error(err.message || 'Browser GPS unavailable'));
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      } else {
        reject(new Error('Geolocation not supported on this device'));
      }
    });
  },

  // ----------------------------------------------------
  // NATIVE CAMERA
  // ----------------------------------------------------
  capturePhoto: async (options = {}) => {
    try {
      if (Capacitor.isPluginAvailable('Camera')) {
        if (Capacitor.isNativePlatform()) {
          const perm = await Camera.checkPermissions();
          if (perm.camera !== 'granted') {
            const req = await Camera.requestPermissions();
            if (req.camera !== 'granted') {
              throw new Error('Camera permission denied');
            }
          }
        }

        const image = await Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera,
          saveToGallery: true,
          width: 1280,
          correctOrientation: true
        });

        return {
          success: true,
          dataUrl: image.dataUrl,
          format: image.format || 'jpeg'
        };
      }
    } catch (e) {
      console.warn('Native camera capture failed or cancelled:', e);
      throw e;
    }

    throw new Error('Camera plugin not available');
  },

  // ----------------------------------------------------
  // ANDROID HARDWARE BACK BUTTON
  // ----------------------------------------------------
  registerBackButton: (callback) => {
    try {
      if (Capacitor.isPluginAvailable('App')) {
        const listener = CapApp.addListener('backButton', (data) => {
          callback(data);
        });
        return () => listener.then(l => l.remove());
      }
    } catch (e) {
      console.warn('Back button registration warning:', e);
    }
    return () => {};
  },

  exitApp: () => {
    try {
      if (Capacitor.isPluginAvailable('App')) {
        CapApp.exitApp();
      }
    } catch (e) {
      console.warn('Exit app warning:', e);
    }
  }
};

export default nativeService;
