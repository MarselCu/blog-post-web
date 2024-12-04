import createAxiosInstance from "@/pages/services/axios";

export const getUser = async (name: string, goRestToken: string) => {
    const axiosInstance = createAxiosInstance(goRestToken);
    const response = await axiosInstance.get(`/users?name=${name}`);
    return response.data;
}

export const getUserById = async (id: string, goRestToken: string) => {
    const axiosInstance = createAxiosInstance(goRestToken);
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
}