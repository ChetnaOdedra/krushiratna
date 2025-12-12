import AsyncStorage from "@react-native-async-storage/async-storage";
import { action, makeObservable, observable } from "mobx";
import { makePersistable } from "mobx-persist-store";

class CurrentUser {
    user = {}
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
            name:"CurrentUserPersist",
            properties:['user'],
            storage:AsyncStorage
        });
       
    }
    // User data update and store in first login
    updateUserMobx(userdata) {
        this.user = userdata
    }
    // User Token remove 
    removeUserMobx() {
        this.user = {}
        console.log("CurrentUser",this.user)
    }
}

export default CurrentUserObj = new CurrentUser();