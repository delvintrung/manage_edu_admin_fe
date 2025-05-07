/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Label, Table, Modal, Select, TextInput } from "flowbite-react";
import type { FC } from "react";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { useEffect, useState } from "react";
import axios from "../../config/axios";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

interface NganhHoc {
  id: string;
  ten: string;
  moTa: string;
  khoa: { id: string; ten: string; moTa: string };
}

interface ChuongTrinhDaoTao {
  id: string;
  nganhHoc: NganhHoc;
  ten: string;
  heDaoTao: string;
  trinhDo: string;
  tongTinChi: number;
  thoiGianDaoTao: number;
}

interface ThongTinChungCTDT {
  id: string;
  chuongTrinhDaoTao: ChuongTrinhDaoTao;
  nganhHoc: NganhHoc;
  loaiBang: string;
  loaiHinhDaoTao: string;
  ngonNguDaoTao: string;
}

interface TableProps {
  thongTinChungs: ThongTinChungCTDT[];
}

const ThongTinChungCTDTPage: FC = function () {
  const [thongTinChungs, setThongTinChungs] = useState<ThongTinChungCTDT[]>([]);
  const [nganhHocs, setNganhHocs] = useState<NganhHoc[]>([]);
  const [chuongTrinhDaoTaos, setChuongTrinhDaoTaos] = useState<
    ChuongTrinhDaoTao[]
  >([]);
  const [openModal, setOpenModal] = useState<
    "details" | "add" | "edit" | "delete" | null
  >(null);
  const [selectedThongTin, setSelectedThongTin] =
    useState<ThongTinChungCTDT | null>(null);
  const [formData, setFormData] = useState<{
    chuongTrinhDaoTaoId: string;
    nganhHocId: string;
    loaiBang: string;
    loaiHinhDaoTao: string;
    ngonNguDaoTao: string;
  }>({
    chuongTrinhDaoTaoId: "",
    nganhHocId: "",
    loaiBang: "",
    loaiHinhDaoTao: "",
    ngonNguDaoTao: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [thongTinRes, nganhHocRes, chuongTrinhRes] = await Promise.all([
          axios.get("/api/thongtinchungctdt"),
          axios.get("/api/nganhhoc"),
          axios.get("/api/chuongtrinhdaotao"),
        ]);
        setThongTinChungs(thongTinRes.data || []);
        setNganhHocs(nganhHocRes.data || []);
        setChuongTrinhDaoTaos(chuongTrinhRes.data || []);
      } catch (error) {
        alert("Không thể tải dữ liệu");
      }
    };
    fetchData();
  }, []);

  const handleAddOrEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = {
        id: openModal === "add" ? uuidv4() : selectedThongTin?.id,
        chuongTrinhDaoTao: { id: formData.chuongTrinhDaoTaoId },
        nganhHoc: { id: formData.nganhHocId },
        loaiBang: formData.loaiBang,
        loaiHinhDaoTao: formData.loaiHinhDaoTao,
        ngonNguDaoTao: formData.ngonNguDaoTao,
      };
      if (openModal === "add") {
        const response = await axios.post("/api/thongtinchungctdt", data);
        setThongTinChungs([...thongTinChungs, response.data]);
        alert("Thêm thông tin chung CTDT thành công");
      } else if (openModal === "edit" && selectedThongTin) {
        const response = await axios.put(
          `/api/thongtinchungctdt/${selectedThongTin.id}`,
          data
        );
        setThongTinChungs(
          thongTinChungs.map((tt) =>
            tt.id === selectedThongTin.id ? { ...tt, ...response.data } : tt
          )
        );
        alert("Cập nhật thông tin chung CTDT thành công");
      }
      setOpenModal(null);
      setFormData({
        chuongTrinhDaoTaoId: "",
        nganhHocId: "",
        loaiBang: "",
        loaiHinhDaoTao: "",
        ngonNguDaoTao: "",
      });
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Thao tác thất bại, vui lòng thử lại"
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedThongTin) return;
    try {
      await axios.delete(`/api/thongtinchungctdt/${selectedThongTin.id}`);
      setThongTinChungs(
        thongTinChungs.filter((tt) => tt.id !== selectedThongTin.id)
      );
      alert("Xóa thông tin chung CTDT thành công");
      setOpenModal(null);
      setSelectedThongTin(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Xóa thất bại, vui lòng thử lại");
    }
  };

  const openEditModal = (thongTin: ThongTinChungCTDT) => {
    setSelectedThongTin(thongTin);
    setFormData({
      chuongTrinhDaoTaoId: thongTin.chuongTrinhDaoTao.id,
      nganhHocId: thongTin.nganhHoc.id,
      loaiBang: thongTin.loaiBang,
      loaiHinhDaoTao: thongTin.loaiHinhDaoTao,
      ngonNguDaoTao: thongTin.ngonNguDaoTao,
    });
    setOpenModal("edit");
  };

  return (
    <div>
      <NavbarSidebarLayout isFooter={false}>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Thông Tin Chung Chương Trình Đào Tạo
              </h1>
            </div>
            <div className="flex justify-end">
              <Button
                color="gray"
                onClick={() => setOpenModal("add")}
                className="w-[150px]"
              >
                <MdAdd className="mr-3 h-4 w-4" />
                Thêm mới
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow">
                <ThongTinChungCTDTTable
                  thongTinChungs={thongTinChungs}
                  setOpenModal={setOpenModal}
                  setSelectedThongTin={setSelectedThongTin}
                  openEditModal={openEditModal}
                />
              </div>
            </div>
          </div>
        </div>
      </NavbarSidebarLayout>

      {openModal === "details" && selectedThongTin && (
        <Modal show={true} position="center" onClose={() => setOpenModal(null)}>
          <Modal.Header>Chi Tiết Thông Tin Chung CTDT</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <Label>ID</Label>
                <p className="text-base text-gray-900 dark:text-white">
                  {selectedThongTin.id}
                </p>
              </div>
              <div>
                <Label>Chương Trình Đào Tạo</Label>
                <p className="text-base text-gray-900 dark:text-white">
                  {selectedThongTin.chuongTrinhDaoTao.ten}
                </p>
              </div>
              <div>
                <Label>Ngành Học</Label>
                <p className="text-base text-gray-900 dark:text-white">
                  {selectedThongTin.nganhHoc.ten}
                </p>
              </div>
              <div>
                <Label>Loại Bằng</Label>
                <p className="text-base text-gray-900 dark:text-white">
                  {selectedThongTin.loaiBang}
                </p>
              </div>
              <div>
                <Label>Loại Hình Đào Tạo</Label>
                <p className="text-base text-gray-900 dark:text-white">
                  {selectedThongTin.loaiHinhDaoTao}
                </p>
              </div>
              <div>
                <Label>Ngôn Ngữ Đào Tạo</Label>
                <p className="text-base text-gray-900 dark:text-white">
                  {selectedThongTin.ngonNguDaoTao}
                </p>
              </div>
              <div>
                <Label>Hệ Đào Tạo</Label>
                <p className="text-base text-gray-900 dark:text-white">
                  {selectedThongTin.chuongTrinhDaoTao.heDaoTao}
                </p>
              </div>
              <div>
                <Label>Trình Độ</Label>
                <p className="text-base text-gray-900 dark:text-white">
                  {selectedThongTin.chuongTrinhDaoTao.trinhDo}
                </p>
              </div>
              <div>
                <Label>Tổng Tín Chỉ</Label>
                <p className="text-base text-gray-900 dark:text-white">
                  {selectedThongTin.chuongTrinhDaoTao.tongTinChi}
                </p>
              </div>
              <div>
                <Label>Thời Gian Đào Tạo (năm)</Label>
                <p className="text-base text-gray-900 dark:text-white">
                  {selectedThongTin.chuongTrinhDaoTao.thoiGianDaoTao}
                </p>
              </div>
              <div>
                <Label>Khoa</Label>
                <p className="text-base text-gray-900 dark:text-white">
                  {selectedThongTin.nganhHoc.khoa.ten}
                </p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color="gray" onClick={() => setOpenModal(null)}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {(openModal === "add" || openModal === "edit") && (
        <Modal show={true} position="center" onClose={() => setOpenModal(null)}>
          <Modal.Header>
            {openModal === "add"
              ? "Thêm Thông Tin Chung CTDT"
              : "Sửa Thông Tin Chung CTDT"}
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleAddOrEdit}>
              <div className="mb-4">
                <Label htmlFor="chuongTrinhDaoTaoId">
                  Chương Trình Đào Tạo
                </Label>
                <Select
                  id="chuongTrinhDaoTaoId"
                  value={formData.chuongTrinhDaoTaoId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chuongTrinhDaoTaoId: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Chọn chương trình đào tạo</option>
                  {chuongTrinhDaoTaos.map((ctdt) => (
                    <option key={ctdt.id} value={ctdt.id}>
                      {ctdt.ten}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="mb-4">
                <Label htmlFor="nganhHocId">Ngành Học</Label>
                <Select
                  id="nganhHocId"
                  value={formData.nganhHocId}
                  onChange={(e) =>
                    setFormData({ ...formData, nganhHocId: e.target.value })
                  }
                  required
                >
                  <option value="">Chọn ngành học</option>
                  {nganhHocs.map((nganh) => (
                    <option key={nganh.id} value={nganh.id}>
                      {nganh.ten}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="mb-4">
                <Label htmlFor="loaiBang">Loại Bằng</Label>
                <TextInput
                  id="loaiBang"
                  value={formData.loaiBang}
                  onChange={(e) =>
                    setFormData({ ...formData, loaiBang: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="loaiHinhDaoTao">Loại Hình Đào Tạo</Label>
                <TextInput
                  id="loaiHinhDaoTao"
                  value={formData.loaiHinhDaoTao}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      loaiHinhDaoTao: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="ngonNguDaoTao">Ngôn Ngữ Đào Tạo</Label>
                <TextInput
                  id="ngonNguDaoTao"
                  value={formData.ngonNguDaoTao}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ngonNguDaoTao: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex">
                <Button type="submit">Xác nhận</Button>
                <Button
                  color="gray"
                  onClick={() => setOpenModal(null)}
                  className="ml-2"
                >
                  Hủy
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}

      {openModal === "delete" && selectedThongTin && (
        <Modal show={true} position="center" onClose={() => setOpenModal(null)}>
          <Modal.Header>Xóa Thông Tin Chung CTDT</Modal.Header>
          <Modal.Body>
            <p className="text-lg">
              Bạn có chắc chắn muốn xóa thông tin chung CTDT này không?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleDelete}>Xác nhận</Button>
            <Button color="gray" onClick={() => setOpenModal(null)}>
              Hủy
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

const ThongTinChungCTDTTable: FC<
  TableProps & {
    setOpenModal: (type: "details" | "edit" | "delete" | null) => void;
    setSelectedThongTin: (thongTin: ThongTinChungCTDT | null) => void;
    openEditModal: (thongTin: ThongTinChungCTDT) => void;
  }
> = function ({
  thongTinChungs,
  setOpenModal,
  setSelectedThongTin,
  openEditModal,
}) {
  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell>ID</Table.HeadCell>
        <Table.HeadCell>Chương Trình Đào Tạo</Table.HeadCell>
        <Table.HeadCell>Ngành Học</Table.HeadCell>
        <Table.HeadCell>Loại Bằng</Table.HeadCell>
        <Table.HeadCell>Hành Động</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {thongTinChungs.length > 0 ? (
          thongTinChungs.map((thongTin) => (
            <Table.Row
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
              key={thongTin.id}
            >
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {thongTin.id}
              </Table.Cell>
              <Table.Cell>{thongTin.chuongTrinhDaoTao.ten}</Table.Cell>
              <Table.Cell>{thongTin.nganhHoc.ten}</Table.Cell>
              <Table.Cell>{thongTin.loaiBang}</Table.Cell>
              <Table.Cell>
                <Button.Group>
                  <Button
                    color="gray"
                    onClick={() => {
                      setSelectedThongTin(thongTin);
                      setOpenModal("details");
                    }}
                  >
                    <FaEye className="mr-3 h-4 w-4" />
                    Xem
                  </Button>
                  <Button color="gray" onClick={() => openEditModal(thongTin)}>
                    <FaEdit className="mr-3 h-4 w-4" />
                    Sửa
                  </Button>
                  <Button
                    color="gray"
                    onClick={() => {
                      setSelectedThongTin(thongTin);
                      setOpenModal("delete");
                    }}
                  >
                    <FaTrash className="mr-3 h-4 w-4" />
                    Xóa
                  </Button>
                </Button.Group>
              </Table.Cell>
            </Table.Row>
          ))
        ) : (
          <Table.Row>
            <Table.Cell colSpan={5} className="text-center">
              Không có dữ liệu
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};

export default ThongTinChungCTDTPage;
