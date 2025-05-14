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
