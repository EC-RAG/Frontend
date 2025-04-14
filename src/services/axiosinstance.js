import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://172.16.5.15:8000",
    timeout: 5000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (!config.headers) config.headers = {};
        const token = localStorage.getItem("token");
        // console.log(token);
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);

export default axiosInstance;