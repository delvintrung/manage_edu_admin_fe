import { Table, useTheme } from "flowbite-react";
import { MdAdsClick } from "react-icons/md";
import { FaCartPlus } from "react-icons/fa";
import { IoIosCash } from "react-icons/io";
import { useState, useEffect } from "react";
import axios from "../config/axios";
import type { FC } from "react";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import { ThongKe } from "../types";

const DashboardPage: FC = function () {
  return (
    <NavbarSidebarLayout>
      <div className="px-4 pt-6 relative">
        <div className="my-6"></div>
        <Dashboard />
        <div className="my-6"></div>
      </div>
    </NavbarSidebarLayout>
  );
};

const Dashboard: FC = function () {
  const [data, setData] = useState<ThongKe>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/thongke");
        const result = response.data;
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="w-[200px] bg-primary-500 p-5 rounded-md text-white">
          <p>Số giảng viên:</p>
          <p>{data.soGiangVien}</p>
        </div>
        <div className="w-[200px] bg-gray-500 p-5 rounded-md text-white">
          <p>Số học phần:</p>
          <p>{data.soHocPhan}</p>
        </div>

        <div className="w-[200px] bg-gray-500 p-5 rounded-md text-white">
          <p>Số khoa:</p>
          <p>{data.soKhoa}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
