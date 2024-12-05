export type User = {
    id: string;
    name: string;
    email: string;
    gender: string;
    status: string;
};

export type Post = {
    id: string;
    user_id: string;
    title: string;
    body: string;
};