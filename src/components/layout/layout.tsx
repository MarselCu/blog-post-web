import { Avatar, Drawer, Switch } from "antd";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { User } from "@/pages/services/type";
import { useRouter } from "next/router";
import { useTheme } from "@/context/themeContext";
import Link from "next/link";

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
    id: "",
    name: "Guest",
    email: "-",
    gender: "-",
    status: "-",
  });
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const userName = user["name"];
  const userFirstLetter = userName.charAt(0);

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    const data = authToken ? JSON.parse(authToken) : null;
    if (data && data.data) {
      setUser(data.data);
    }
  }, []);

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

  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <>
      <nav className="flex justify-between items-center py-4 px-10 bg-gray-800 text-white border-b border-gray-700 shadow-md">
        <div className="text-xl font-semibold">
          <Link href="/">BlogPost</Link>
        </div>
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
        <div className="flex flex-col justify-between h-full dark:bg-gray-800 dark:text-white">
          <div className="flex-grow">
            <div className="text-gray-800 dark:text-gray-300">
              ID: {user["id"]}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Dark Mode
              </span>
              <Switch checked={theme === "dark"} onChange={switchTheme} />
            </div>
          </div>
          <div
            className="text-red-500 cursor-pointer hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 text-sm py-2 text-center"
            onClick={onLogout}
          >
            Sign Out
          </div>
        </div>
      </Drawer>
    </>
  );
};
