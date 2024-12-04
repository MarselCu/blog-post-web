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
} from "antd";
import { useMutation } from "@tanstack/react-query";
import { getPost } from "./api/postApi";
import { Post } from "./services/type";

type SearchProps = GetProps<typeof Input.Search>;

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
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [search, setSearch] = useState<string>("");
  const [totalItems, setTotaItems] = useState<number>(500);
  const [goRestToken, setGoRestToken] = useState<string>("");

  const postMutation = useMutation({
    mutationFn: ({
      goRestToken,
      page,
      pageSize,
      search,
    }: {
      goRestToken: string;
      page: number;
      pageSize: number;
      search?: string;
    }) => getPost(goRestToken, page, pageSize, search),
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

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      router.push("/login");
    }
    setGoRestToken(JSON.parse(`${authToken}`).token);
    if (router.query) {

    }
  }, [router]);

  useEffect(() => {
    postMutation.mutate({ goRestToken, page, pageSize, search });
  }, [page, pageSize, search]);

  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const onPostClick = (data: Post ) => {
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

  return (
    <>
      <div className="px-10 sm:px-20 py-10 bg-gray-50 min-h-screen">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Posts</h1>
          <Search
            placeholder="Search posts..."
            onSearch={onSearch}
            className="w-full sm:w-80"
            enterButton
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map((post, index) => (
            <Card
              key={post.id || index}
              type="inner"
              title={post.title}
              size="small"
              className="h-40 p-4 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-blue-50 hover:shadow-lg hover:scale-105 transition-transform duration-200 ease-in-out cursor-pointer"
              onClick={() => onPostClick(post)}
            >
              <p className="line-clamp-3 overflow-hidden text-ellipsis text-gray-700 text-sm">
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
    </>
  );
};

HomePage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default HomePage;
