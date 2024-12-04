import { useMutation } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  CheckboxProps,
  Form,
  FormProps,
  Input,
  notification,
} from "antd";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { getUser } from "./api/userApi";
import { User } from "./services/type";
import { useRouter } from "next/router";

type FieldType = {
  name?: string;
  token?: string;
  remember?: boolean;
};

const LoginPage = () => {
  const [name, setName] = useState<string>("");
  const [goRestToken, setGoRestToken] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [form] = Form.useForm();
  const router = useRouter();

  useEffect(() => {
    const cookies = Cookies.get("authToken");
    if (cookies) {
      const authToken = JSON.parse(cookies);
      setName(authToken.data.name);
      setGoRestToken(authToken.token);
    }
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      name: name,
      token: goRestToken,
      remember: rememberMe,
    });
  }, [form, name, goRestToken, rememberMe]);

  const mutation = useMutation({
    mutationFn: ({
      name,
      goRestToken,
    }: {
      name: string;
      goRestToken: string;
    }) => getUser(name, goRestToken),
    onSuccess: (data: User[]) => {
      const authToken = {
        data: data[0],
        remember: rememberMe,
        token: goRestToken,
      };
      Cookies.set("authToken", JSON.stringify(authToken), {
        expires: 1,
        path: "/",
        secure: true,
        sameSite: "Lax",
      });

      notification.success({
        message: "Welcome, " + data[0].name,
        description: "Access Granted",
        placement: "topRight",
        duration: 2,
      });

      router.push("/");
    },
    onError: (error) => {
      notification.error({
        message: "Login Failed",
        description: error.message,
        placement: "topRight",
        duration: 2,
      });
    },
  });

  const onCheckboxChange: CheckboxProps["onChange"] = (e) => {
    setRememberMe(e.target.checked);
  };

  const onSubmit: FormProps<FieldType>["onFinish"] = (values) => {
    if (typeof values.name === "string" && typeof values.token === "string") {
      mutation.mutate({ name: values.name, goRestToken: values.token });
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
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to BlogPost
            </h2>
            <p className="text-gray-600 text-lg">
              Please enter your details to continue.
            </p>
          </div>

          <Form
            form={form}
            name="basic"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            style={{ maxWidth: "100%" }}
            initialValues={{ remember: rememberMe }}
            onFinish={onSubmit}
            onFinishFailed={onSubmitFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </Form.Item>

            <Form.Item<FieldType>
              label="Go Rest Token"
              name="token"
              rules={[{ required: true, message: "Please input your token!" }]}
            >
              <Input.Password
                placeholder="Enter Go Rest Token"
                value={goRestToken}
                onChange={(e) => setGoRestToken(e.target.value)}
                className="rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </Form.Item>

            <Form.Item<FieldType> name="remember" valuePropName="checked">
              <Checkbox
                className="text-gray-700"
                checked={rememberMe}
                onChange={onCheckboxChange}
              >
                Remember me
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
