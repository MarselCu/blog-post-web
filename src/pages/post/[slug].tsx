import { useRouter } from "next/router";
import { Post, User } from "../services/type";
import { ReactElement, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GetServerSideProps } from "next";
import { useMutation } from "@tanstack/react-query";
import { getUserById } from "../api/userApi";
import { Badge, notification } from "antd";
import { Layout } from "@/components/layout/layout";

export default function PostPage({ post }: { post: Post }) {
  const router = useRouter();
  const [author, setAuthor] = useState<User>({
    id: "",
    name: "Guest",
    email: "-",
    gender: "-",
    status: "-",
  });

  const authorMutation = useMutation({
    mutationFn: ({ id, goRestToken }: { id: string; goRestToken: string }) =>
      getUserById(id, goRestToken),
    onSuccess: (data: User) => {
      setAuthor(data);
    },
    onError: (error) => {
      notification.error({
        message: "Author not found",
        description: "Can't get Author Profile",
        placement: "topRight",
        duration: 1,
      });
    },
  });

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      router.push("/login");
    } else {
      const token = JSON.parse(authToken);
      authorMutation.mutate({ id: post.user_id, goRestToken: token.token });
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center px-8 sm:px-20 lg:px-40 py-10 bg-gray-50 dark:bg-gray-900 min-h-screen relative">
      {/* Back Button */}
      <button
        className="absolute top-4 left-4 flex items-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg shadow-md"
        onClick={() => router.push("/")}
        aria-label="Go back to the previous page"
      >
        <span>&larr;</span>
      </button>

      <article className="w-full max-w-3xl text-center dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-lg">
        {/* Title */}
        <header>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 break-words">
            {post.title}
          </h1>
        </header>

        {/* Author Information */}
        <div className="text-lg text-gray-600 dark:text-gray-300 mb-10">
          <div className="flex justify-center items-center gap-4">
            <div className="font-semibold">
              Author by {author.gender === "male" ? "Mr." : "Ms."} {author.name}
            </div>
            <Badge color={author.status === "active" ? "green" : "red"} />
          </div>
          <div className="text-base">
            Email:{" "}
            <a
              href={`mailto:${author.email}`}
              className="text-blue-500 dark:text-blue-400 underline"
            >
              {author.email}
            </a>
          </div>
        </div>

        {/* Body */}
        <section className="text-base text-gray-700 dark:text-gray-300 leading-relaxed break-words">
          {post.body}
        </section>
      </article>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { data } = context.query;
  const parsedData = typeof data === "string" ? JSON.parse(data) : null;

  return {
    props: {
      post: parsedData || { id: null, user_id: null, title: "", body: "" },
    },
  };
};

PostPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
