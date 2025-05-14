/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Button,
  Label,
  Table,
  Modal,
  TextInput,
  Select,
  Textarea,
} from "flowbite-react";
import type { FC } from "react";
import { IoIosSearch } from "react-icons/io";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { MdDeleteForever } from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";
import { RxUpdate } from "react-icons/rx";
import { useEffect, useState } from "react";
import axios from "../../config/axios";
import { v4 as uuidv4 } from "uuid";

interface HocPhan {
  id: string;
  ten: string;
}

interface DeCuongChiTiet {
  id: string;
  hocPhan: HocPhan;
  mucTieu: string;
  noiDung: string;
  phuongPhapDanhGia: string;
  taiLieuThamKhao: string;
}

interface TableProps {
  deCuongChiTiets: DeCuongChiTiet[];
}

const DeCuongChiTietPage: FC = function () {
  const [deCuongChiTiets, setDeCuongChiTiets] = useState<DeCuongChiTiet[]>([]);
  const [hocPhans, setHocPhans] = useState<HocPhan[]>([]);
  const [openModal, setOpenModal] = useState<"add" | "edit" | "delete" | null>(
    null
  );
  const [selectedDeCuong, setSelectedDeCuong] = useState<DeCuongChiTiet | null>(
    null
  );
  const [searchValue, setSearchValue] = useState<string>("");

  // Fetch all deCuongChiTiets and hocPhans on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deCuongRes, hocPhanRes] = await Promise.all([
          axios.get("/api/decuongchitiet"),
          axios.get("/api/hocphan"),
        ]);
        setDeCuongChiTiets(deCuongRes.data);
        setHocPhans(hocPhanRes.data);
      } catch (error) {
        alert("Không thể lấy dữ liệu");
      }
    };
    fetchData();
  }, []);

  // Handle search (client-side filtering by hocPhan.ten)
  const handleSearch = async () => {
    try {
      const result = await axios.get("/api/decuongchitiet");
      const allDeCuongs = result.data;
      if (!searchValue) {
        setDeCuongChiTiets(allDeCuongs);
        return;
      }
      const filteredDeCuongs = allDeCuongs.filter((dc: DeCuongChiTiet) =>
        dc.hocPhan.ten.toLowerCase().includes(searchValue.toLowerCase())
      );
      setDeCuongChiTiets(filteredDeCuongs);
      if (filteredDeCuongs.length === 0) {
        alert("Không tìm thấy đề cương chi tiết nào");
      }
    } catch (error) {
      alert("Không thể lấy danh sách đề cương chi tiết");
    }
  };

  // Handle form submission for add/edit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const deCuong: DeCuongChiTiet = {
      id: openModal === "add" ? uuidv4() : selectedDeCuong!.id,
      hocPhan: { id: form["hocPhan"].value, ten: "" },
      mucTieu: form["mucTieu"].value,
      noiDung: form["noiDung"].value,
      phuongPhapDanhGia: form["phuongPhapDanhGia"].value,
      taiLieuThamKhao: form["taiLieuThamKhao"].value,
    };

    try {
      if (openModal === "add") {
        const result = await axios.post("/api/decuongchitiet", deCuong);
        setDeCuongChiTiets([...deCuongChiTiets, result.data]);
        alert("Đề cương chi tiết đã được tạo thành công");
      } else {
        const result = await axios.put(
          `/api/decuongchitiet/${deCuong.id}`,
          deCuong
        );
        setDeCuongChiTiets(
          deCuongChiTiets.map((dc) => (dc.id === deCuong.id ? result.data : dc))
        );
        alert("Đề cương chi tiết đã được cập nhật thành công");
      }
      setOpenModal(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/decuongchitiet/${selectedDeCuong!.id}`);
      setDeCuongChiTiets(
        deCuongChiTiets.filter((dc) => dc.id !== selectedDeCuong!.id)
      );
      alert("Đề cương chi tiết đã được xóa thành công");
      setOpenModal(null);
    } catch (error) {
      alert("Không thể xóa đề cương chi tiết");
    }
  };

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Quản lý Đề cương Chi tiết
            </h1>
          </div>
          <div className="flex items-center justify-between">
            <div className="relative lg:w-64 xl:w-96">
              <TextInput
                id="decuongchitiet-search"
                name="decuongchitiet-search"
                placeholder="Tìm kiếm học phần theo tên"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <IoIosSearch
                className="absolute right-2 top-2.5 h-5 w-5 cursor-pointer"
                onClick={handleSearch}
              />
            </div>
            <Button
              color="blue"
              onClick={() => setOpenModal("add")}
              className="flex items-center"
            >
              <IoAddCircle className="mr-2 h-5 w-5" />
              Thêm Đề cương
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-4">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <DeCuongChiTietTable
                deCuongChiTiets={deCuongChiTiets}
                setOpenModal={setOpenModal}
                setSelectedDeCuong={setSelectedDeCuong}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(openModal === "add" || openModal === "edit") && (
        <Modal show={true} onClose={() => setOpenModal(null)} size="xl">
          <Modal.Header>
            {openModal === "add"
              ? "Thêm Đề cương Chi tiết"
              : "Sửa Đề cương Chi tiết"}
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="hocPhan" value="Học Phần" />
                <Select
                  id="hocPhan"
                  name="hocPhan"
                  defaultValue={
                    openModal === "edit" ? selectedDeCuong?.hocPhan.id : ""
                  }
                  required
                >
                  <option value="">Chọn Học Phần</option>
                  {hocPhans.map((hocPhan) => (
                    <option key={hocPhan.id} value={hocPhan.id}>
                      {hocPhan.ten}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="mucTieu" value="Mục Tiêu" />
                <Textarea
                  id="mucTieu"
                  name="mucTieu"
                  defaultValue={
                    openModal === "edit" ? selectedDeCuong?.mucTieu : ""
                  }
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label htmlFor="noiDung" value="Nội Dung" />
                <Textarea
                  id="noiDung"
                  name="noiDung"
                  defaultValue={
                    openModal === "edit" ? selectedDeCuong?.noiDung : ""
                  }
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="phuongPhapDanhGia"
                  value="Phương Pháp Đánh Giá"
                />
                <Textarea
                  id="phuongPhapDanhGia"
                  name="phuongPhapDanhGia"
                  defaultValue={
                    openModal === "edit"
                      ? selectedDeCuong?.phuongPhapDanhGia
                      : ""
                  }
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label htmlFor="taiLieuThamKhao" value="Tài Liệu Tham Khảo" />
                <Textarea
                  id="taiLieuThamKhao"
                  name="taiLieuThamKhao"
                  defaultValue={
                    openModal === "edit" ? selectedDeCuong?.taiLieuThamKhao : ""
                  }
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="submit" color="blue">
                  {openModal === "add" ? "Thêm" : "Cập nhật"}
                </Button>
                <Button color="gray" onClick={() => setOpenModal(null)}>
                  Hủy
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}

      {/* Delete Modal */}
      {openModal === "delete" && (
        <Modal show={true} onClose={() => setOpenModal(null)}>
          <Modal.Header>Xóa Đề cương Chi tiết</Modal.Header>
          <Modal.Body>
            <p className="text-lg">
              Bạn có chắc chắn muốn xóa đề cương chi tiết này không?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button color="red" onClick={handleDelete}>
              Xóa
            </Button>
            <Button color="gray" onClick={() => setOpenModal(null)}>
              Hủy
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </NavbarSidebarLayout>
  );
};

const DeCuongChiTietTable: FC<
  TableProps & {
    setOpenModal: (modal: "edit" | "delete" | null) => void;
    setSelectedDeCuong: (deCuong: DeCuongChiTiet) => void;
  }
> = function ({ deCuongChiTiets, setOpenModal, setSelectedDeCuong }) {
  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell>Mã</Table.HeadCell>
        <Table.HeadCell>Học Phần</Table.HeadCell>
        <Table.HeadCell>Mục Tiêu</Table.HeadCell>
        <Table.HeadCell>Nội Dung</Table.HeadCell>
        <Table.HeadCell>Phương Pháp Đánh Giá</Table.HeadCell>
        <Table.HeadCell>Tài Liệu Tham Khảo</Table.HeadCell>
        <Table.HeadCell>Hành Động</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {deCuongChiTiets.map((deCuong) => (
          <Table.Row
            className="bg-white dark:border-gray-700 dark:bg-gray-800"
            key={deCuong.id}
          >
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {deCuong.id}
            </Table.Cell>
            <Table.Cell>{deCuong.hocPhan.ten}</Table.Cell>
            <Table.Cell className="max-w-xs truncate">
              {deCuong.mucTieu}
            </Table.Cell>
            <Table.Cell className="max-w-xs truncate">
              {deCuong.noiDung}
            </Table.Cell>
            <Table.Cell className="max-w-xs truncate">
              {deCuong.phuongPhapDanhGia}
            </Table.Cell>
            <Table.Cell className="max-w-xs truncate">
              {deCuong.taiLieuThamKhao}
            </Table.Cell>
            <Table.Cell>
              <Button.Group>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedDeCuong(deCuong);
                    setOpenModal("edit");
                  }}
                >
                  <RxUpdate className="mr-2 h-4 w-4" />
                  Sửa
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedDeCuong(deCuong);
                    setOpenModal("delete");
                  }}
                >
                  <MdDeleteForever className="mr-2 h-4 w-4" />
                  Xóa
                </Button>
              </Button.Group>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default DeCuongChiTietPage;
