import axios from 'axios';

const createAxiosInstance = (goRestToken: string) => {
    return axios.create({
        baseURL: 'https://gorest.co.in/public/v2',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${goRestToken}`,
        }
    });
}

export default createAxiosInstance;