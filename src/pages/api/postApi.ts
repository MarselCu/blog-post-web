import createAxiosInstance from "@/services/axios";

export const getPost = async (
    goRestToken: string,
    page: number,
    pageSize: number,
    search?: string
) => {
    const axiosInstance = createAxiosInstance(goRestToken);

    const params = new URLSearchParams({
        page: page.toString(),
        per_page: pageSize.toString(),
    });

    if (search !== '' && search !== undefined) {
        params.append('title', search);
    }

    const response = await axiosInstance.get(`/posts?${params.toString()}`);
    return response.data;
};

export const getUserPostOnly = async (
    userId: string,
    goRestToken: string,
    page: number,
    pageSize: number,
    search?: string
) => {
    const axiosInstance = createAxiosInstance(goRestToken);

    const params = new URLSearchParams({
        page: page.toString(),
        per_page: pageSize.toString(),
    });

    if (search !== '' && search !== undefined) {
        params.append('title', search);
    }

    const response = await axiosInstance.get(`/users/${userId}/posts?${params.toString()}`);
    return response.data;
};

export const addPost = async (userId: string, title: string, body: string, goRestToken: string) => {
    const axiosInstance = createAxiosInstance(goRestToken);
    const response = await axiosInstance.post(`/users/${userId}/posts`, { title, body });
    return response.data;
}

export const deletePostById = async (id: string, goRestToken: string) => {
    const axiosInstance = createAxiosInstance(goRestToken);
    const response = await axiosInstance.delete(`/posts/${id}`);
    return response.data;
}

export const EditPostById = async (id: string, title: string, body: string, goRestToken: string) => {
    const axiosInstance = createAxiosInstance(goRestToken);
    const response = await axiosInstance.patch(`/posts/${id}`, { title, body });
    return response.data;
}