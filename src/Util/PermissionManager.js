// PermissionManager.js
import { PermissionsAndroid, Platform } from "react-native";

class PermissionManager {
  static async requestImagePermissions() {
    if (Platform.OS !== "android") return true;

    try {
      // Android 13+ use READ_MEDIA_IMAGES
      const mediaPermission =
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      // STEP 1: Check current permission status
      const cameraGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );

      const mediaGranted = await PermissionsAndroid.check(mediaPermission);

      // If both already granted → SUCCESS
      if (cameraGranted && mediaGranted) {
        return true;
      }

      // STEP 2: Request only missing permissions
      const toRequest = [];
      if (!cameraGranted) toRequest.push(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (!mediaGranted) toRequest.push(mediaPermission);

      const results = await PermissionsAndroid.requestMultiple(toRequest);

      const finalCameraGranted =
        cameraGranted ||
        results[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED;

      const finalMediaGranted =
        mediaGranted ||
        results[mediaPermission] === PermissionsAndroid.RESULTS.GRANTED;

      return finalCameraGranted && finalMediaGranted;
    } catch (err) {
      console.warn("Permission Error:", err);
      return false;
    }
  }
}

export default PermissionManager;
