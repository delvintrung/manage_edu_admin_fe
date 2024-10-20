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
import { GrStorage } from "react-icons/gr";
import { GrUserManager } from "react-icons/gr";
import axios from "../config/axios";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { fetchUserRole } from "../Slice/role";

const ExampleSidebar: FC = function () {
  const [currentPage, setCurrentPage] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchUserRole());
  }, [dispatch]);

  useEffect(() => {
    const newPage = window.location.pathname;

    setCurrentPage(newPage);
  }, [setCurrentPage]);

  const [openModal, setOpenModal] = useState(false);
  const [permission, setPermission] = useState(false);

  const handleLogout = async () => {
    await axios.post("/api/v2/auth/logout");
    localStorage.clear();
    window.location.href = "/authentication/sign-in";
  };

  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example">
      <div className="flex h-full flex-col justify-between py-2 relative">
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
                href="/employee/list"
                icon={GrUserManager}
                className={
                  "/employee/list" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >
                Employee
              </Sidebar.Item>
              <Sidebar.Item
                href="/author/list"
                icon={GrUserManager}
                className={
                  "/author/list" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >
                Author
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
                className="max-w-20"
                icon={GrStorage}
                href={
                  localStorage.getItem("id") == "2"
                    ? "/delivery-received"
                    : null
                }
              >
                Delivery & Received
              </Sidebar.Item>

              <Sidebar.Item href={"/authentication/sign-in"} icon={HiLogin}>
                Sign in
              </Sidebar.Item>

              <Sidebar.Item icon={HiLogin} onClick={() => setOpenModal(true)}>
                Out
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </div>

        <Modal show={permission} onClose={() => setPermission(false)}>
          <Modal.Header>Tài khoản không đủ quyền</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <p>Tài khoản cuả bạn không đủ quyền để truy cập phần này</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setPermission(false)}>I accept</Button>
          </Modal.Footer>
        </Modal>

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
                    handleLogout();
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
