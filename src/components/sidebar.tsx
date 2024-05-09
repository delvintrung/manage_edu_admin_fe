import { Sidebar, TextInput } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  HiChartPie,
  HiLogin,
  HiSearch,
  HiShoppingBag,
  HiUsers,
} from "react-icons/hi";
import { AiFillMedicineBox } from "react-icons/ai";
import { FaUserLock } from "react-icons/fa";

const ExampleSidebar: FC = function () {
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    const newPage = window.location.pathname;

    setCurrentPage(newPage);
  }, [setCurrentPage]);

  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example">
      <div className="flex h-full flex-col justify-between py-2">
        <div>
          <form className="pb-3 md:hidden">
            <TextInput
              icon={HiSearch}
              type="search"
              placeholder="Search"
              required
              size={32}
            />
          </form>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                href="/"
                icon={HiChartPie}
                className={
                  "/" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
                }
              >
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item
                href="/e-commerce/products"
                icon={HiShoppingBag}
                className={
                  "/e-commerce/products" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >
                Products
              </Sidebar.Item>
              <Sidebar.Item
                href="/users/list"
                icon={HiUsers}
                className={
                  "/users/list" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >
                Users list
              </Sidebar.Item>
              <Sidebar.Item
                href="/orders/list"
                icon={AiFillMedicineBox}
                className={
                  "/orders/list" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >
                Orders
              </Sidebar.Item>
              <Sidebar.Item
                href="/permissions/list"
                icon={FaUserLock}
                className={
                  "/permissions/list" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >
                Permissions
              </Sidebar.Item>
              <Sidebar.Item href="/authentication/sign-in" icon={HiLogin}>
                Sign in
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </div>
      </div>
    </Sidebar>
  );
};

export default ExampleSidebar;
