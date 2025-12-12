import AsyncStorage from "@react-native-async-storage/async-storage";
import { action, makeObservable, observable } from "mobx";
import { makePersistable } from "mobx-persist-store";

class UserMob {
    user = {}
    isLogin = false
    fcmToken = "";
    selectedLanguageCode = 'gu';
    constructor() {
        makeObservable(
            this,
            {
                updateUserMobx: action,
                removeUserMobx: action,
                user: observable,
            },
            {
                autoBind: true,
            },
        );
        makePersistable(this,{
            name:"UserMobPersist",
            properties:['user',"isLogin"],
            storage:AsyncStorage
        });
       
    }
    updateSelectedLanguage(code) {
        this.selectedLanguageCode = code;
    }
    updateFCMToken(token) {
        this.fcmToken = token;
    }
    // User data update and store in first login
    updateUserMobx(userdata) {
        this.isLogin = true
        this.user = userdata
    }
    // User Token remove 
    removeUserMobx() {
        this.user = {}
        this.isLogin = false
        console.log("removeUserMobx",this.user)
    }
}

export default UserMob = new UserMob();