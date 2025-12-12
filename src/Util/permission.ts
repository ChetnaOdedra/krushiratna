// permission.js
import { PermissionsAndroid, Platform } from 'react-native';

export const requestCameraAndMediaPermissions = async () => {
  
  if (Platform.OS !== 'android') return true;

  try {
    // ⚠ STEP 1: Check if permissions already granted
    const cameraGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );

    const mediaPermission =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const mediaGranted = await PermissionsAndroid.check(mediaPermission);

    // ⭐ If both are already granted → no need to request again
    if (cameraGranted && mediaGranted) {
      return true;
    }

    // ⚠ STEP 2: Ask only for the missing permissions
    const permissionsToRequest = [];
    if (!cameraGranted) permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.CAMERA);
    if (!mediaGranted) permissionsToRequest.push(mediaPermission);

    const result = await PermissionsAndroid.requestMultiple(permissionsToRequest);

    const finalCameraGranted =
      result[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED ||
      cameraGranted;

    const finalMediaGranted =
      (Platform.Version >= 33
        ? result[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES]
        : result[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE]
      ) === PermissionsAndroid.RESULTS.GRANTED || mediaGranted;

    return finalCameraGranted && finalMediaGranted;

  } catch (err) {
    console.warn(err);
    return false;
  }
};
