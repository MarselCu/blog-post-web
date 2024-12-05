import { Layout } from "@/components/layout/layout";
import { ReactElement, use, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button, Form, FormProps, Input, notification } from "antd";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { Post } from "@/services/type";
import { useMutation } from "@tanstack/react-query";
import { EditPostById } from "@/pages/api/postApi";

const { TextArea } = Input;

type FieldType = {
  title?: string;
  body?: string;
};

export default function EditPostPage({ post }: { post: Post }) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [goRestToken, setGoRestToken] = useState<string>("");

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      router.push("/login");
      return;
    }
    setGoRestToken(JSON.parse(`${authToken}`).token);
    setBody(post.body);
    setTitle(post.title);
  }, [router]);

  useEffect(() => {
    form.setFieldsValue({
      title: title,
      body: body,
    });
  }, [form, title, body]);

  const editPostMutation = useMutation({
    mutationFn: ({ title, body }: { title: string; body: string }) =>
      EditPostById(post.id, title, body, goRestToken),
    onSuccess: (data: Post) => {
      notification.success({
        message: "Post Updated",
        description: "Post updated successfully",
        placement: "topRight",
        duration: 2,
      });
      router.push({
        pathname: `/post/${data.id}`,
        query: { data: JSON.stringify(data) },
      });
    },
    onError: (error) => {
      notification.error({
        message: "Failed to update post",
        description: error.message,
        placement: "topRight",
        duration: 2,
      });
    },
  });

  const onSubmit: FormProps<FieldType>["onFinish"] = (values) => {
    if (typeof values.title === "string" && typeof values.body === "string") {
      editPostMutation.mutate({ title: values.title, body: values.body });
    }
  };

  const onSubmitFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    errorInfo.errorFields.forEach((field) => {
      notification.error({
        message: "Submission Failed",
        description: `${field.name} is required`,
        placement: "topRight",
        duration: 2,
      });
    });
  };
  return (
    <>
      <div className="flex flex-col items-center px-8 sm:px-20 lg:px-40 py-10 bg-gray-50 dark:bg-gray-800 min-h-screen relative">
        <button
          className="absolute top-4 left-4 flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-200"
          onClick={() => router.back()}
        >
          <span>&larr;</span>
        </button>

        {/* Form Container */}
        <div className="w-full max-w-3xl bg-white dark:bg-gray-900 p-8 shadow-lg rounded-lg">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
            Edit Post
          </h1>

          <Form
            form={form}
            name="postForm"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            initialValues={{}}
            onFinish={onSubmit}
            onFinishFailed={onSubmitFailed}
            autoComplete="off"
          >
            {/* Title Field */}
            <Form.Item<FieldType>
              label={
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Title
                </span>
              }
              name="title"
              rules={[{ required: true, message: "Post title is required" }]}
            >
              <Input
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </Form.Item>

            {/* Body Field */}
            <Form.Item<FieldType>
              label={
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Body
                </span>
              }
              name="body"
              rules={[{ required: true, message: "Post body is required" }]}
            >
              <TextArea
                placeholder="Write your post content here..."
                rows={7}
                value={body}
                maxLength={500}
                onChange={(e) => setBody(e.target.value)}
                count={{
                  show: true,
                  max: 500,
                }}
                className="rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </Form.Item>

            <div className="flex justify-end mt-8">
              <Form.Item>
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  className="w-full py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:ring-4 focus:ring-blue-200 transition duration-200"
                >
                  Edit
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </>
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

EditPostPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
