import { Layout } from "@/components/layout/layout";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, FormProps, Input, notification } from "antd";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { ReactElement, useEffect, useState } from "react";
import { addPost } from "../api/postApi";
import { Post } from "../services/type";

const { TextArea } = Input;


type FieldType = {
  title?: string;
  body?: string;
};

export default function CreatePostPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [goRestToken, setGoRestToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      router.push("/login");
      return;
    }
    setGoRestToken(JSON.parse(`${authToken}`).token);
    setUserId(JSON.parse(`${authToken}`).data.id);

  }, [router]);
  
  const createPostMutation = useMutation({
      mutationFn: ({
        userId,
        title,
        body,
        goRestToken,
      }: {
        userId: string;
        title: string;
        body: string;
        goRestToken: string;
    }) => addPost(userId, title, body, goRestToken),
    onSuccess: (data: Post) => {
        notification.success({
          message: data.title,
          description: "Post created successfully",
          placement: "topRight",
          duration: 2,
        });

        setTitle("");
        setBody("");
        form.resetFields();
      },
      onError: (error) => {
        notification.error({
          message: "Failed to create post",
          description: error.message,
          placement: "topRight",
          duration: 2,
        });
      },
  });

  const onSubmit: FormProps<FieldType>["onFinish"] = (values) => {
    
    if (typeof values.title === "string" && typeof values.body === "string") {
      createPostMutation.mutate({ userId: userId , title: values.title, body: values.body, goRestToken: goRestToken });
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
      <div className="flex flex-col items-center px-8 sm:px-20 lg:px-40 py-10 bg-gray-50 min-h-screen relative">
        <button
          className="absolute top-4 left-4 flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg shadow-md transition duration-200"
          onClick={() => router.back()}
        >
          <span>&larr;</span>
        </button>

        {/* Form Container */}
        <div className="w-full max-w-3xl bg-white p-8 shadow-lg rounded-lg">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Create a New Post
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
              label={<span className="font-medium text-gray-700">Title</span>}
              name="title"
              rules={[{ required: true, message: "Post title is required" }]}
            >
              <Input
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </Form.Item>

            {/* Body Field */}
            <Form.Item<FieldType>
              label={<span className="font-medium text-gray-700">Body</span>}
              name="body"
              rules={[{ required: true, message: "Post body is required" }]}
            >
              <TextArea
                placeholder="Write your post content here..."
                rows={7}
                value={body}
                maxLength={500}
                onChange={(e) => setBody(e.target.value)}
                className="rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </Form.Item>

            <div className="flex justify-end mt-8">
              <Form.Item>
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition duration-200"
                >
                  Submit
                </Button>
              </Form.Item>  
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

CreatePostPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
