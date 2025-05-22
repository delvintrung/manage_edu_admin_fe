export interface HocPhan {
  id: string;
  ten: string;
  tinChi: number;
  tietLyThuyet: number;
  tietThucHanh: number;
}

export interface KhoiKienThuc {
  id: string;
  ten: string;
  tinChi?: number;
  tinChiBatBuoc?: number;
  tinChiTuChon?: number;
}

export interface KeHoachDayHoc {
  id: string;
  hocPhan: HocPhan;
  nganhHocId?: string;
  hocKy: number;
  hocPhanTruoc: HocPhan | null;
}

export interface NganhHoc {
  id: string;
  ten: string;
  moTa: string;
}

export interface KhoiKienThuc_KeHoachDayHoc {
  id: string;
  khoiKienThuc: KhoiKienThuc;
  keHoachDayHoc: KeHoachDayHoc;
}

export interface KeHoachDayHoc_NganhHoc {
  id: string;
  keHoachDayHoc: KeHoachDayHoc;
  nganhHoc: NganhHoc;
}

export interface GiangVien {
  id: string;
  khoa: Khoa;
  user: User;
  hoTen: string;
  trinhDo: string;
  chuyenMon: string;
  namSinh: string;
}

export interface Khoa {
  id: string;
  ten: string;
  moTa: string;
}

export interface User {
  id: string;
  username: string;
}

export interface ThongKe {
  soGiangVien?: number;
  soKhoa?: number;
  soNganh?: number;
  soHocPhan?: number;
  soKeHoachDayHoc?: number;
  soKhoiKienThuc?: number;
  soKeHoachMoNhom?: number;
  soNhomHoc?: number;
  soDeCuongChiTiet?: number;
  chuongTrinhDaoTao?: number;
}

export interface CotDiem {
  id: string;
  tenCotDiem: string;
  trongSoDanhGia: string;
  hinhThucDanhGia: string | null;
}

export interface DeCuongChiTiet {
  id: string;
  hocPhan: HocPhan;
}

export interface CotDiemChiTiet {
  id: string;
  de_cuong_id: DeCuongChiTiet;
  cotDiem: CotDiem;
}

export interface ChuongTrinhKhung {
  id: string;
  nganhHoc: NganhHoc;
}

export interface KhoiKienThucKhungChuongTrinh {
  id: string;
  khoiKienThuc: KhoiKienThuc;
  khungChuongTrinh: ChuongTrinhKhung;
}
