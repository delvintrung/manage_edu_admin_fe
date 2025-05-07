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
                <Link to={"/thongtinchung/list"}>
                  <Sidebar.Item
                    icon={HiChartPie}
                    className={
                      "/thongtinchung/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Thông tin chung CTDT
                  </Sidebar.Item>
                </Link>
              }

              <Link to={"/kehoachmonhom/list"}>
                <Sidebar.Item
                  icon={HiChartPie}
                  className={
                    "/kehoachmonhom/list" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  Mở nhóm môn học
                </Sidebar.Item>
              </Link>

              <Link to="/phanconggiangday/list">
                <Sidebar.Item
                  icon={HiShoppingBag}
                  className={
                    "/phanconggiangday/list" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  Quản lý nhóm đã mở
                </Sidebar.Item>
              </Link>
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
                    Users
                  </Sidebar.Item>
                </Link>
              }
              {
                <Link to="/khoa/list">
                  <Sidebar.Item
                    icon={AiFillMedicineBox}
                    className={
                      "/orders/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Khoa
                  </Sidebar.Item>
                </Link>
              }
              <Link to="/nganhhoc/list">
                <Sidebar.Item
                  icon={AiFillMedicineBox}
                  className={
                    "/nganhhoc/list" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  Ngành học
                </Sidebar.Item>
              </Link>
              {
                <Link to="/lecturer/list">
                  <Sidebar.Item
                    icon={GrUserManager}
                    className={
                      "/lecturer/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Giảng viên
                  </Sidebar.Item>
                </Link>
              }
              {
                <Link to="/hocphan/list">
                  <Sidebar.Item
                    icon={TfiWrite}
                    className={
                      "/hocphan/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Học phần
                  </Sidebar.Item>
                </Link>
              }
              {
                <Link to="/nhomkienthuc/list">
                  <Sidebar.Item
                    icon={FaUserLock}
                    className={
                      "/nhomkienthuc/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Nhóm kiến thức
                  </Sidebar.Item>
                </Link>
              }
              {
                <Link to="/chuongtrinhdaotao/list">
                  <Sidebar.Item
                    className={
                      "/chuongtrinhdaotao/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                    icon={GrStorage}
                  >
                    Chương trình đào tạo
                  </Sidebar.Item>
                </Link>
              }

              <Link to="/decuongchitiet/list">
                <Sidebar.Item
                  className={
                    "/decuongchitiet/list" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                  icon={FaBuilding}
                >
                  Đề cương chi tiết
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
