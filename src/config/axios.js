import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3006",
  headers: {
    token: `Bearer ${localStorage.getItem("token")}`,
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response && error.response.status === 401) ||
      error.response.status === 403
    ) {
      console.error("Unauthorized: Token không hợp lệ hoặc không có token");
      window.location.href = "/authentication/sign-in";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
