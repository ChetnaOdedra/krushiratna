export interface BuyerSignUpRequest {
    name: string,
    mobile_number: string,
    aadhar_number: string,
    aadhar_photo:any,
    owner_name: string,
    address: string,
    state_id: string,
    city_id: string,
    taluka_id: string,
    subcategory_id: [],
    code_for:"sign_up",
    zipcode:"3",
    village:"x"
  }
  
  export interface farmerOrderRequest {
    name: string,
    subcategory_id: string,
    weight_id: string,
    approx_weight:string,
    seed: string,
    address: string,
    mobile_no: string,
    product_name: string,
    production_time: string,
    media_id: [],
    media_video_id:string,
  }