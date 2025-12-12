// ImagePickerManager.js
import { launchImageLibrary } from "react-native-image-picker";
import PermissionManager from "./PermissionManager";

class ImagePickerManager {
  
  static async openGallery(onSuccess, onError) {
    // STEP 1: Ask permissions (only if needed)
    const permission = await PermissionManager.requestImagePermissions();
    if (!permission) {
      onError?.("Permission denied");
      return;
    }

    // STEP 2: Open Gallery
    const options = {
      mediaType: "photo",
      quality: 1,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        onError?.("User canceled picker");
        return;
      }
      if (response.errorCode) {
        onError?.(response.errorMessage);
        return;
      }

      const asset = response.assets?.[0];
      if (asset) onSuccess?.(asset);
    });
  }
}

export default ImagePickerManager;
