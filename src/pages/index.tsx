import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect } from "react";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      router.push("/login");
    }
  }, [router]);

  return (
    <>
     <h1>Home Page</h1>
    </>
  );
}

export default HomePage;