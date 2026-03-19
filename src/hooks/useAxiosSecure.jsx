import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
    baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
    const { user, loading } = useAuth();

    useEffect(() => {
        const reqInterceptor = axiosSecure.interceptors.request.use(
            async (config) => {
                if (loading) return config;
                if (user) {
                    const token = await user.getIdToken();
                    config.headers.authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            axiosSecure.interceptors.request.eject(reqInterceptor);
        };
    }, [user, loading]);

    return axiosSecure;
};

export default useAxiosSecure;