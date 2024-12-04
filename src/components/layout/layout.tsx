import { Avatar, Drawer } from "antd";
import { use, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { User } from "@/pages/services/type";
import { useRouter } from "next/router";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main>{children}</main>
    </div>
  );
};

export const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    id: '',
    name: "Guest",
    email: "-",
    gender: "-",
    status: "-",
  });
  const [open, setOpen] = useState(false);

  const userName = user['name'];
  const userFirstLetter = userName.charAt(0);

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    const data = authToken ? JSON.parse(authToken) : null;
    if (data && data.data) {
      setUser(data.data);
    }
  }, []);

  useEffect(() => {},[user])

  const onLogout = () => {
    Cookies.remove("authToken");
    router.push("/login");
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <nav className="flex justify-between items-center py-4 px-10 bg-gray-800 text-white border-b border-gray-700 shadow-md">
        <div className="text-xl font-semibold">BlogPost</div>
        <div className="flex items-center space-x-4">
          <Avatar
            style={{ backgroundColor: "#1890ff", verticalAlign: "middle" }}
            size={"large"}
            gap={4}
            className="hover:cursor-pointer"
            onClick={showDrawer}
          >
            {userFirstLetter}
          </Avatar>
        </div>
      </nav>
      <Drawer title={userName} onClose={onClose} open={open}>
        <div className="flex flex-col justify-between h-full">
          {/* Drawer content goes here */}
          <div className="flex-grow">{/* Additional content if needed */}</div>

          {/* Sign Out label at the bottom with hover effect */}
          <div
            className="text-red-500 cursor-pointer hover:text-red-700 text-sm py-2 text-center"
            onClick={onLogout}
          >
            Sign Out
          </div>
        </div>
      </Drawer>
    </>
  );
};
