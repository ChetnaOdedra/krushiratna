import apisauce from 'apisauce';
import UesrMob from './Mobxstate/UesrMob';
import { BuyerSignUpRequest, farmerOrderRequest } from './Model/BuyerSignUpRequest';
import { Platform } from 'react-native';
const create = (baseURL = 'https://krushiratn.com/') => {
let lastapi:any 
const api = apisauce.create({
    baseURL,
    headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Authorization': `Bearer ${UesrMob.user.token}`
     },
    timeout: 5 * 60 * 1000,
});

api.addResponseTransform(response => {
    // Check for 401 Unauthorized here
    if (response.status === 401) {

        // console.log('Unauthorized request, logging out user...');
        // // Logout the user
        // UesrMob.removeUserMobx();
            
    }
    // Return the response if it's not 401
    return response;
});
// API caling for the  UserRegister
const userRegister = (name,surname,mobile_number,state_id,city_id,taluka_id,address,village,zipcode,code) => {
    console.log("----PPPP",name,surname,mobile_number,state_id,city_id,taluka_id,village,zipcode,address)
    let param = {
        'name':name,
        'surname':surname,
        'code':code,
        'mobile_number':mobile_number,
        'state_id':state_id,
        'city_id':city_id,
        'taluka_id':taluka_id,
        'address':address,
        'village':village,
        'zipcode':zipcode,
        'device_token': UesrMob.fcmToken,
        'code_for':'sign_up',
    }
     console.log(JSON.stringify(param))
     return api.post('/api/farmer/register', param);
}
// API caling for the  Login Authentication
const RegisterSendOTP = (mobile_number:string) => {
    lastapi = authenticateSendOTP
    let mobileNumber = parseInt(mobile_number, 10);
    let param = {
        'mobile_number': mobileNumber,
        'code_for': "sign_up"  
    }
    console.log(param)
    return api.post('api/send-otp', param);
}
// API caling for the  Login Authentication
const authenticateSendOTP = (mobile_number:string) => {
    lastapi = authenticateSendOTP
    let param = {
        'mobile_number': mobile_number,
        'code_for': "sign_in"  
    }
    console.log(param)
    return api.post('api/send-otp', param);
}
// API caling for the  Login Authentication
const authenticate = (mobile_number:string,otp:string) => {
    lastapi = authenticate
    let param = {
        'code': otp,
        'device_token': UesrMob.fcmToken,
        'mobile_number': mobile_number  
    }
    console.log(param)
    return api.post('api/login', param);
}

// get Weights data
const getWeights = () =>{
    return api.get(`api/weight`);
}


// API caling for the  Login Authentication
const getCategory = () => {
    lastapi = getCategory
    return api.get('api/categories?status=1');
}
// API caling for the  Login Authentication
const getMarketingYardData = (subcategory_id:string) => {
    lastapi = getMarketingYardData
    console.log("->->->->->->->->->->")
    console.log(api.headers)
    console.log("->->->->->->->->->->")
    return api.get(`api/products?subcategory_id=${subcategory_id}`);
}
// API caling for the  Login Authentication
const getMarketingKrushiRatnaData = (subcategory_id:string) => {
    lastapi = getMarketingYardData
    console.log("->->->->->->->->->->")
    console.log(api.headers)
    console.log("->->->->->->->->->->")
    return api.get(`api/userProducts?subcategory_id=${subcategory_id}&type=farmer`);
}
// API caling for the  Login Authentication

const getProductList = (params) => {
    lastapi = getProductList
    return api.get(`api/subcategories`,params);
}
const CompanyGetOrderHistory = (params) => {
    console.log("GetOrderHistory");
    lastapi = CompanyGetOrderHistory
    return api.get(`api/companyOrders/`,params);
}
const FarmerGetOrderHistory = (params) => {
    console.log("GetOrderHistory");
    lastapi = FarmerGetOrderHistory
    return api.get(`api/farmerOrders/`,params);
}

const GetNotificationList = (pagination) =>
{
    
    if (UesrMob.user.user.role == 'company')
    {
        console.log(`api/company/notifications?limit=${10}&page=${pagination.page}&unread=1`);
        return api.get(`api/company/notifications?limit=${10}&page=${pagination.page}&unread=1`);
    }
    else
    {
        console.log(`api/farmer/notifications?limit=${10}&page=${pagination.page}&unread=1`);
        return api.get(`api/farmer/notifications?limit=${10}&page=${pagination.page}&unread=1`);
    }
    
}
const GetRunningOrder = (pagination) => {
    console.log("GetRunningOrder");
    console.log("limit",pagination.limit);
    console.log("page",pagination.page);
    lastapi = GetRunningOrder
    console.log("GetRunningOrder")
    console.log(api.headers)
    console.log("->->->->->->->->->-> ")
    return api.get(`api/farmerOrders?limit=${10}&page=${pagination.page}&order_status_id=1`);
}

const farmerOrderAPI = (data:farmerOrderRequest) => {
    console.log("------farmerOrderAPI------------")
    // lastapi = farmerOrderAPI
    const param = {
        'name': data.name,
        'subcategory_id': data.subcategory_id,
        'weight_id': data.weight_id,
        'approx_weight': data.approx_weight,
        'seed': data.seed,
        'address': data.address,
        'mobile_no': data.mobile_no,
        'product_name': data.product_name,
        'production_time': data.production_time,
        'media_id': data.media_id, // ✅ Extract only IDs,
        'media_video_id': data.media_video_id
    }
    console.log(param)
    console.log("------------------")
    
     return api.post('api/farmerOrders', param);
}
// API caling for the  BuyerRegister


const uploadMedia = (fileUrl:string, used_for: string = '') => {
    const formData = new FormData();
   console.log("fileUrl uploadMedia",fileUrl);
    if (fileUrl) {
        let file;
        if (used_for === 'farmer_order_video') {
             // Extract filename from URI
                const fileName = fileUrl.split('/').pop();
                
                // Define file type
                const fileType = fileUrl.split('.').pop();
                
                // Append video file
                formData.append('files[]', {
                    uri: Platform.OS === 'android' ? fileUrl : fileUrl.replace('file://', ''), // iOS needs `file://` removed
                    name: fileName,
                    type: `video/${fileType}`, // Example: video/mp4
                });

        } else {
            file = {
            uri: encodeURI(fileUrl),
            name: 'upload.jpg', // Adjust the file name and extension accordingly
            type: 'image/jpeg', // Adjust MIME type based on file type
            };
            formData.append('files[]', file);
        }
      
    }
    formData.append('used_for', used_for);
    console.log("fileUrl uploadMedia",formData);
    return api.post('api/media', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
// Function to upload a video
const uploadVideo = async (videoUri) => {
    let formData = new FormData();
    console.log('selected uploadVideo succsefuly uploaded', videoUri);
    // Extract filename from URI
    const fileName = videoUri.split('/').pop();
    const fileType = fileName.split('.').pop();
  
    // Append video file
    formData.append('files[]', {
      uri: Platform.OS === 'android' ? videoUri : videoUri.replace('file://', ''), // iOS requires `file://` to be removed
      name: fileName,
      type: `video/${fileType}`, // Example: video/mp4
    });
  // Append other form data
    console.log("-----------",formData);
    formData.append('used_for', 'farmer_order_video');
    return api.post('api/media', formData, {
        headers: {
            'Authorization': `Bearer ${UesrMob.user.token}`,
          'Content-Type': 'multipart/form-data',
        },
    });
  };
     const farmerGetAllBuyer = (params) => {
    lastapi = farmerGetAllBuyer
    return api.get(`api/farmer/order/get-buyer/${params.id}`);
    }
    const farmerConfirmSellOrder = (params) => {
    lastapi = farmerConfirmSellOrder
    return api.put(`api/farmerOrders/${params.id}`,params);
    }
    const farmerComplateOrder = (params) => {
        lastapi = farmerComplateOrder
        return api.put(`api/farmer/order/complete/${params.order_id}`,params);
    }
    const farmerProfileUpdate = (params) => {
    lastapi = farmerProfileUpdate
    return api.put(`api/farmer/profile/update`,params);
}
  //--------------------Company APIS------------------------
  // API caling for the  Login Authentication
const BuyerRegisterSendOTP = (mobile_number:string) => {
    lastapi = authenticateSendOTP
    let param = {
        'mobile_number': mobile_number,
        'code_for': "sign_up"  
    }
    console.log(param)
    return api.post('api/send-otp', param);
}
const CompanyProfileUpdate = (params) => {
    lastapi = CompanyProfileUpdate
    return api.put(`api/company/profile/update`,params);
}
  const getBuyerYardData = (subcategory_id:string,type='farmer') => {
    lastapi = getBuyerYardData
    return api.get(`api/Products?subcategory_id=${subcategory_id}&type=${type}`);
}
  const BuyerRegisterAPI = (name, owner_name, code, mobile_number, state_id, city_id, taluka_id, address, village, zipcode, subcategory_id, fileUrl) => {
    // Create FormData object
    lastapi = BuyerRegisterAPI
    console.log("fileUrl BuyerRegisterAPI", city_id, taluka_id, state_id);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('owner_name', owner_name);
    formData.append('code', code);
    formData.append('mobile_number', mobile_number);
    formData.append('state_id', state_id);
    formData.append('city_id', city_id);
    formData.append('taluka_id', taluka_id);
    formData.append('address', address);
    formData.append('village', village);
    formData.append('zipcode', zipcode);
    formData.append('device_token', UesrMob.fcmToken);
    formData.append('code_for', 'sign_up');
    // Append subcategory_id as indexed keys (subcategory_id[0], subcategory_id[1], etc.)
    if (Array.isArray(subcategory_id)) {
        subcategory_id.forEach((id, index) => {
            formData.append(`subcategory_id[${index}]`, id);
        });
    }

    // If fileUrl is provided, append the file
    if (fileUrl) {
        const file = {
            uri: fileUrl,
            name: 'upload.jpg', // Adjust the file name and extension accordingly
            type: 'image/jpeg', // Adjust MIME type based on file type
        };
        formData.append('aadhar_photo', file);
    }
    return api.post('api/company/register', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

  const companyTodaysOrders = () => {
    lastapi = companyTodaysOrders
    return api.get('api/companyOrders?today_order=1');
}
const companyuserProducts = () => {
    lastapi = companyuserProducts
    return api.get('api/userProducts?type=company');
}
const updateProductStatus = (params) => {
    lastapi = updateProductStatus
    return api.put(`api/userProducts/${params.id}?min_price=${params.min_price}&max_price=${params.max_price}&status=${params.status}`);
}

const updateProductPrice = (params) => {
    lastapi = updateProductPrice
    return api.put(`api/userProducts/${params.id}?min_price=${params.min_price}&max_price=${params.max_price}`);
}
const companyCountAllOrder = () => {
    lastapi = updateProductPrice
    return api.get('api/company/order/count/allorder');
}
const BuyerSubmitPriceORSample = (params) => {
    lastapi = BuyerSubmitPriceORSample
    return api.put(`api/companyOrders/${params.id}`,params);
}
const RejectOrder = (params) => {
    lastapi = RejectOrder
    return api.put(`api/company/order/reject/${params.id}`);
}
const GetOrderFromStatus = (params) => {
    lastapi = GetOrderFromStatus
    return api.get(`api/companyOrders?limit=-1&order_status_id=${params.id}`);
}
const BuyerComplateOrder = (params) => {
    lastapi = BuyerComplateOrder
    return api.put(`api/company/order/complete/${params.order_id}`,params);
}
const LogoutUser = () => {
    lastapi = LogoutUser
    return api.post(`api/logout`);
}
const DeleteCompanyUser = () => {
    lastapi = DeleteCompanyUser
    return api.post(`api/account-delete`);
}
const DeleteFarmerUser = () => {
    lastapi = DeleteFarmerUser
    return api.post(`api/account-delete`);
}
const BuyerRemoveOrder = (params) => {
    lastapi = BuyerRemoveOrder
    return api.put(`api/company/order/remove/${params.id}`);
}
const Farmersbanners = () => {
    lastapi = Farmersbanners
    return api.get('api/farmer/banners');
}
const WeatherInfo = () => {
    lastapi = WeatherInfo
    return api.get('api/farmer/weather-information');
}
const NewYardPrice = () => {
    lastapi = NewYardPrice
    return api.get('api/farmer/yard-price'); 
}
const NewYardPriceWithID = (ID:string) => {
    lastapi = NewYardPriceWithID
    console.log('api/farmer/yard-price/'+ID)
    return api.get('api/farmer/yard-price/?taluka_id='+ID); 
}
const Incomeingfeature = () => {
    lastapi = Incomeingfeature
    return api.get('api/farmer/incoming-features');
}
const NewsAPI = () => {
    lastapi = NewsAPI
    return api.get('api/news?limit=10&page=1');
}
return {
    authenticateSendOTP,
    authenticate,
    RegisterSendOTP,
    getCategory,
    userRegister,
    BuyerRegisterAPI,
    getMarketingYardData,
    getBuyerYardData,
    getProductList,
    BuyerRegisterSendOTP,
    getMarketingKrushiRatnaData,
    getWeights,
    uploadMedia,
    farmerOrderAPI,
    uploadVideo,
    GetRunningOrder,
    companyTodaysOrders,
    companyuserProducts, 
    updateProductPrice,
    companyCountAllOrder,
    BuyerSubmitPriceORSample,
    RejectOrder,
    GetOrderFromStatus,
    BuyerComplateOrder,
    farmerGetAllBuyer,
    farmerConfirmSellOrder,
    farmerComplateOrder,
    FarmerGetOrderHistory,
    CompanyGetOrderHistory,
    updateProductStatus,
    GetNotificationList,
    DeleteCompanyUser,
    DeleteFarmerUser,
    BuyerRemoveOrder,
    Farmersbanners,
    WeatherInfo,
    NewYardPrice,
    Incomeingfeature,
    NewsAPI,
    NewYardPriceWithID,
    farmerProfileUpdate,
    CompanyProfileUpdate,
    LogoutUser
}}

export default {
    create,
};






















