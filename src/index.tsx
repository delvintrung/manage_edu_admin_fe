import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import DashboardPage from "./pages/index";
import EcommerceProductsPage from "./pages/e-commerce/products";
import UserListPage from "./pages/users/list";
import KhoaPage from "./pages/khoa/list";
import HocPhanPage from "./pages/hocphan";
import GiangVienPage from "./pages/giangvien";
import ToastComponent from "./components/toast";
import { ContextProvider } from "./context/contextAPI.jsx";
import KhoiKienThucPage from "./pages/khoikienthuc";
import ChuongTrinhDaoTaoPage from "./pages/chuongtrinhdaotao";
import DeCuongChiTietPage from "./pages/decuongchitiet";
import NganhHocPage from "./pages/nganhhoc";
import KeHoachMoNhomPage from "./pages/kehoachmonhom";
import NhomHocPage from "./pages/phanconggiangday";
import ThongTinChungCTDTPage from "./pages/thongtinchung";
import KeHoachDayHocPage from "./pages/kehoachdayhoc";
import CotDiemPage from "./pages/cotdiem";
const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <Provider store={store}>
      <ContextProvider>
        <Flowbite theme={{ theme }}>
          <ToastComponent />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<DashboardPage />} index />
              <Route
                path="/e-commerce/products"
                element={<EcommerceProductsPage />}
              />
              <Route
                path="/thongtinchung/list"
                element={<ThongTinChungCTDTPage />}
              />
              <Route
                path="/kehoachmonhom/list"
                element={<KeHoachMoNhomPage />}
              />
              <Route path="/phanconggiangday/list" element={<NhomHocPage />} />
              <Route path="/users/list" element={<UserListPage />} />
              <Route path="/khoa/list" element={<KhoaPage />} />
              <Route path="/lecturer/list" element={<GiangVienPage />} />
              <Route path="/hocphan/list" element={<HocPhanPage />} />
              <Route
                path="/kehoachdayhoc/list"
                element={<KeHoachDayHocPage />}
              />
              <Route path="/nhomkienthuc/list" element={<KhoiKienThucPage />} />
              <Route
                path="/chuongtrinhdaotao/list"
                element={<ChuongTrinhDaoTaoPage />}
              />
              <Route
                path="/decuongchitiet/list"
                element={<DeCuongChiTietPage />}
              />

              <Route path="/nganhhoc/list" element={<NganhHocPage />} />
              <Route path="/cotdiem/list" element={<CotDiemPage />} />
            </Routes>
          </BrowserRouter>
        </Flowbite>
      </ContextProvider>
    </Provider>
  </StrictMode>
);
