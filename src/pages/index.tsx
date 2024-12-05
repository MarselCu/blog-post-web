import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { Layout } from "../components/layout/layout";
import {
  Card,
  notification,
  Pagination,
  PaginationProps,
  Input,
  GetProps,
  FloatButton,
  Modal,
  message,
  Checkbox,
  CheckboxProps,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { deletePostById, getPost, getUserPostOnly } from "./api/postApi";
import { Post } from "./services/type";

type SearchProps = GetProps<typeof Input.Search>;

const { confirm } = Modal;
const { Search } = Input;
const pageSizeOption = [5, 10, 20];
const itemRender: PaginationProps["itemRender"] = (
  _,
  type,
  originalElement
) => {
  if (type === "prev") {
    return <a>Previous</a>;
  }
  if (type === "next") {
    return <a>Next</a>;
  }
  return originalElement;
};

const HomePage = () => {
  const router = useRouter();
  // const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [myPostOnly, setMyPostOnly] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [search, setSearch] = useState<string>("");
  const [totalItems, setTotaItems] = useState<number>(500);
  const [goRestToken, setGoRestToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const postMutation = useMutation({
    mutationFn: ({
      userId,
      goRestToken,
      page,
      pageSize,
      search,
    }: {
      userId: string;
      goRestToken: string;
      page: number;
      pageSize: number;
      search?: string;
    }) =>
      myPostOnly
        ? getUserPostOnly(userId, goRestToken, page, pageSize, search)
        : getPost(goRestToken, page, pageSize, search),
    onSuccess: (data) => {
      setPosts(data);
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

  const deletePostMutation = useMutation({
    mutationFn: ({
      postId,
      goRestToken,
    }: {
      postId: string;
      goRestToken: string;
    }) => deletePostById(postId, goRestToken),
    onSuccess: () => {
      message.success("Post deleted successfully");
      postMutation.mutate({userId, goRestToken, page, pageSize, search });
    },
    onError: (error) => {
      notification.error({
        message: "Failed to delete post",
        description: "Post Not Found",
        placement: "topRight",
        duration: 2,
      });
    },
  });

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      router.push("/login");
      return;
    }
    setGoRestToken(JSON.parse(`${authToken}`).token);
    setUserId(JSON.parse(`${authToken}`).data.id);
  }, [router]);

  useEffect(() => {
    postMutation.mutate({userId, goRestToken, page, pageSize, search });
  }, [page, pageSize, search, myPostOnly]);

  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const onPostClick = (data: Post) => {
    router.push({
      pathname: `/post/${data.id}`,
      query: { data: JSON.stringify(data) },
    });
  };

  const onSearch: SearchProps["onSearch"] = (value, _e) => {
    setSearch(value);
    if (value !== "") {
      setTotaItems(posts.length);
    } else {
      // since we dont know the total number of items
      setTotaItems(500);
    }
  };

  const onCreatePost = () => {
    router.push("/post/create");
  };

  const showDeleteConfirm = (event: React.MouseEvent, postId: string) => {
    event.stopPropagation();
    confirm({
      title: "Are you sure delete this post?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        deletePostMutation.mutate({ postId, goRestToken });
      },
    });
  };

  const onEdit = (event: React.MouseEvent, post: Post) => {
    event.stopPropagation();
    router.push({
      pathname: `/post/${post.id}/edit`,
      query: { data: JSON.stringify(post) },
    });
  };

  const onMyPostOnlyChange: CheckboxProps["onChange"] = (e) => {
    setMyPostOnly(e.target.checked);
  };

  return (
    <>
      <div className="px-10 sm:px-20 py-10 bg-gray-50 min-h-screen">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="hidden sm:block text-2xl font-semibold text-gray-800">Posts</h1>
          <div className="flex gap-5 items-center justify-center">
            <Checkbox onChange={onMyPostOnlyChange}>My Post Only</Checkbox>
            <Search
              placeholder="Search posts..."
              onSearch={onSearch}
              className="w-full sm:w-80"
              enterButton
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map((post, index) => (
            <Card
              key={post.id || index}
              type="inner"
              title={post.title}
              size="small"
              actions={
                post.user_id === userId
                  ? [
                      <EditOutlined
                        key="edit"
                        onClick={(e) => onEdit(e, post)}
                      />,
                      <DeleteOutlined
                        key="delete"
                        onClick={(e) => showDeleteConfirm(e, post.id)}
                      />,
                    ]
                  : []
              }
              onClick={() => onPostClick(post)}
              className="border-2 border-gray-300 hover:border-blue-500 hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out transform cursor-pointer"
            >
              <p className="h-10 line-clamp-3 overflow-hidden text-ellipsis text-gray-700 text-sm">
                {post.body}
              </p>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Pagination
            total={totalItems}
            itemRender={itemRender}
            onChange={onPaginationChange}
            pageSizeOptions={pageSizeOption}
            defaultCurrent={page}
            defaultPageSize={pageSize}
            className="pagination-custom"
          />
        </div>
      </div>

      <FloatButton
        shape="square"
        type="primary"
        style={{ insetInlineEnd: 24 }}
        icon={<PlusOutlined />}
        onClick={() => onCreatePost()}
      />
    </>
  );
};

HomePage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default HomePage;
