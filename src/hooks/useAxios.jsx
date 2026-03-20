import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://ewu-find-hub-server.vercel.app",
});

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;