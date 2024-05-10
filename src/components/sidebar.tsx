import { Sidebar, TextInput } from "flowbite-react";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
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

  const [openModal, setOpenModal] = useState(false);

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
              <Sidebar.Item
                href={
                  localStorage.getItem("isLogin") == "yes"
                    ? ""
                    : "/authentication/sign-in"
                }
                icon={HiLogin}
              >
                Sign in
              </Sidebar.Item>
              {localStorage.getItem("isLogin") == "yes" && (
                <Sidebar.Item icon={HiLogin} onClick={() => setOpenModal(true)}>
                  Out
                </Sidebar.Item>
              )}
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </div>
        <Modal
          show={openModal}
          size="md"
          onClose={() => setOpenModal(false)}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Đăng xuất tài khoản này?
              </h3>
              <div className="flex justify-center gap-4">
                <Button
                  color="failure"
                  onClick={() => {
                    localStorage.removeItem("isLogin");
                    localStorage.removeItem("id");
                    localStorage.removeItem("employeeId");
                    setOpenModal(false);
                  }}
                >
                  {"Yes, I'm sure"}
                </Button>
                <Button color="gray" onClick={() => setOpenModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </Sidebar>
  );
};

export default ExampleSidebar;
