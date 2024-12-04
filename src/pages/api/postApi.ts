import createAxiosInstance from "@/pages/services/axios";

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

    if (search !=='' && search !== undefined) {
        params.append('title', search);
    }

    const response = await axiosInstance.get(`/posts?${params.toString()}`);
    return response.data;
};

