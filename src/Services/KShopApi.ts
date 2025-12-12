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

        console.log('Unauthorized request, logging out user...');
        // Logout the user
        UesrMob.removeUserMobx();
            
    }
    // Return the response if it's not 401
    return response;
});

const getKShopCategory = (params) => {
    lastapi = getKShopCategory
    return api.get('api/k-shop-categories',params);
}
const getKShopCompanies = () => {
    lastapi = getKShopCompanies
    return api.get('api/k-shop-companies');
}
const getRendomProducts = () => {
    lastapi = getRendomProducts
    return api.get(`api/k-shop-products?is_random=1&limit=-1`);
}
const getAllProducts = (params) => {
    lastapi = getAllProducts
    return api.get(`api/k-shop-products`,params);
}
const getAllProductswithParams = (params) => {
    const {kshop_category_id,kshop_company_id,limit,page} = params
    lastapi = getAllProductswithParams
    return api.get(`api/k-shop-products`,params);
}
const getRendomProductsDashboard = () => {
    lastapi = getRendomProductsDashboard
    return api.get(`api/k-shop-products?is_random=1&limit=4`);
}
const KshopsubmitOrder = (params) => {
    console.log('KshopsubmitOrder called with params:', params);
    lastapi = KshopsubmitOrder
    return api.post('api/k-shop-orders', { ...params });
}
const searchProducts = (params) => {
    lastapi = searchProducts
    return api.get(`api/k-shop-products`,params);
}
const KshopOrderList =() => {
    lastapi = KshopOrderList
    return api.get('api/k-shop-orders?limit=-1');
}
const KshopFarmersbanners = () => {
    lastapi = KshopFarmersbanners
    return api.get('api/farmer/kshop-banners');
}
return {
    getKShopCategory,
    getKShopCompanies,
    getRendomProducts,
    KshopsubmitOrder,
    searchProducts,
    KshopOrderList,
    KshopFarmersbanners,
    getRendomProductsDashboard,
    getAllProducts,
    getAllProductswithParams
}}

export default {
    create,
};






















