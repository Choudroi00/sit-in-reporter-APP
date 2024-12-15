import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const axiosClient = axios.create({
    baseURL: 'https://sitin.ayoub-dev.xyz/api/v1/',
    
})

axiosClient.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})


export default axiosClient;

