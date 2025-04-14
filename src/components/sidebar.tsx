import { Sidebar } from "flowbite-react";
import { Modal } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiChartPie, HiShoppingBag, HiUsers } from "react-icons/hi";
import { AiFillMedicineBox } from "react-icons/ai";
import { FaUserLock } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { GrStorage } from "react-icons/gr";
import { TfiWrite } from "react-icons/tfi";
import { GrUserManager } from "react-icons/gr";
import axios from "../config/axios";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { fetchCurrentAction, fetchPermissionView } from "../Slice/role";

const ExampleSidebar: FC = function () {
  const [currentPage, setCurrentPage] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchPermissionView());
    dispatch(fetchCurrentAction());
  }, []);

  const permissionView = useSelector(
    (state: any) => state.role.actionView.list
  );

  useEffect(() => {
    const newPage = window.location.pathname;

    setCurrentPage(newPage);
  }, [setCurrentPage]);

  const [openModal, setOpenModal] = useState(false);

  const handleLogout = async () => {
    await axios.post("/api/v2/auth/logout");
    localStorage.clear();
    navigate("/authentication/sign-in");
  };

  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example">
      <div className="flex h-full flex-col justify-between py-2 relative">
        <div>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              {
                <Link to={"/"}>
                  <Sidebar.Item
                    icon={HiChartPie}
                    className={
                      "/" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
                    }
                  >
                    Dashboard
                  </Sidebar.Item>
                </Link>
              }
              {
                <Link to="/e-commerce/products">
                  <Sidebar.Item
                    icon={HiShoppingBag}
                    className={
                      "/e-commerce/products" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Phân công giảng dạy
                  </Sidebar.Item>
                </Link>
              }
              {
                <Link to="/users/list">
                  <Sidebar.Item
                    icon={HiUsers}
                    className={
                      "/users/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Kế hoạch mở nhóm
                  </Sidebar.Item>
                </Link>
              }
              {
                <Link to="/orders/list">
                  <Sidebar.Item
                    icon={AiFillMedicineBox}
                    className={
                      "/orders/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Ngành học
                  </Sidebar.Item>
                </Link>
              }
              {
                <Link to="/employee/list">
                  <Sidebar.Item
                    icon={GrUserManager}
                    className={
                      "/employee/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Giảng viên
                  </Sidebar.Item>
                </Link>
              }
              {
                <Link to="/author/list">
                  <Sidebar.Item
                    icon={TfiWrite}
                    className={
                      "/author/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Khoa
                  </Sidebar.Item>
                </Link>
              }
              {
                <Link to="/permissions/list">
                  <Sidebar.Item
                    icon={FaUserLock}
                    className={
                      "/permissions/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Khung chương trình
                  </Sidebar.Item>
                </Link>
              }
              {
                <Link to="/delivery-received">
                  <Sidebar.Item
                    className={
                      "/delivery-received" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                    icon={GrStorage}
                  >
                    Chương trình đào tạo
                  </Sidebar.Item>
                </Link>
              }

              <Link to="/company-delivery">
                <Sidebar.Item
                  className={
                    "/company-delivery" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                  icon={FaBuilding}
                >
                  Đề cương chi tiết
                </Sidebar.Item>
              </Link>
              <Link to="/users">
                <Sidebar.Item
                  className={
                    "/users" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                  icon={FaBuilding}
                >
                  Người dùng
                </Sidebar.Item>
              </Link>
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
        </Modal>
      </div>
    </Sidebar>
  );
};

export default ExampleSidebar;
