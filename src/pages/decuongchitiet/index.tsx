/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Button,
  Label,
  Table,
  Modal,
  TextInput,
  Select,
  Checkbox,
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
  tenHocPhan: string;
}

interface NhomKienThuc {
  id: string;
  ten: string;
}

interface DeCuongChiTiet {
  id: string;
  hocPhan: HocPhan;
  nhomKienThuc: NhomKienThuc;
  thuTuHocKy: number;
  batBuoc: boolean;
}

interface TableProps {
  deCuongChiTiets: DeCuongChiTiet[];
}

const DeCuongChiTietPage: FC = function () {
  const [deCuongChiTiets, setDeCuongChiTiets] = useState<DeCuongChiTiet[]>([]);
  const [hocPhans, setHocPhans] = useState<HocPhan[]>([]);
  const [nhomKienThucs, setNhomKienThucs] = useState<NhomKienThuc[]>([]);
  const [openModal, setOpenModal] = useState<"add" | "edit" | "delete" | null>(
    null
  );
  const [selectedDeCuong, setSelectedDeCuong] = useState<DeCuongChiTiet | null>(
    null
  );
  const [searchValue, setSearchValue] = useState<string>("");

  // Fetch all deCuongChiTiets, hocPhans, and nhomKienThucs on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deCuongRes, hocPhanRes, nhomKienThucRes] = await Promise.all([
          axios.get("/api/decuongchitiet"),
          axios.get("/api/hocphan"),
          axios.get("/api/nhomkienthuc"),
        ]);
        setDeCuongChiTiets(deCuongRes.data);
        setHocPhans(hocPhanRes.data);
        setNhomKienThucs(nhomKienThucRes.data);
      } catch (error) {
        alert("Không thể lấy dữ liệu");
      }
    };
    fetchData();
  }, []);

  // Handle search (client-side filtering by hocPhan.tenHocPhan)
  const handleSearch = async () => {
    try {
      const result = await axios.get("/api/decuongchitiet");
      const allDeCuongs = result.data;
      if (!searchValue) {
        setDeCuongChiTiets(allDeCuongs);
        return;
      }
      const filteredDeCuongs = allDeCuongs.filter((dc: DeCuongChiTiet) =>
        dc.hocPhan.tenHocPhan.toLowerCase().includes(searchValue.toLowerCase())
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
      hocPhan: { id: form["hocPhan"].value, tenHocPhan: "" },
      nhomKienThuc: { id: form["nhomKienThuc"].value, ten: "" },
      thuTuHocKy: parseInt(form["thuTuHocKy"].value),
      batBuoc: form["batBuoc"].checked,
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
    <div>
      <NavbarSidebarLayout isFooter={false}>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Quản lý Đề cương Chi tiết
              </h1>
            </div>
            <div className="flex">
              <div className="mb-3 dark:divide-gray-700 sm:mb-0 flex sm:divide-x w-full sm:divide-gray-100">
                <div className="flex items-center justify-between w-full">
                  <div className="lg:pr-3">
                    <Label htmlFor="decuongchitiet-search" className="sr-only">
                      Tìm kiếm
                    </Label>
                    <div className="relative mt-1 lg:w-64 xl:w-96">
                      <TextInput
                        id="decuongchitiet-search"
                        name="decuongchitiet-search"
                        placeholder="Tìm kiếm học phần theo tên"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                      />
                      <IoIosSearch
                        className="w-8 h-8 absolute top-1 right-2 hover:cursor-pointer"
                        onClick={handleSearch}
                      />
                    </div>
                  </div>
                  <div>
                    <Button color="gray" onClick={() => setOpenModal("add")}>
                      <IoAddCircle className="mr-3 h-4 w-4" />
                      Thêm Đề cương Chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
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
      </NavbarSidebarLayout>

      {/* Add/Edit Modal */}
      {(openModal === "add" || openModal === "edit") && (
        <Modal show={true} position="center" onClose={() => setOpenModal(null)}>
          <Modal.Header>
            {openModal === "add"
              ? "Thêm Đề cương Chi tiết"
              : "Sửa Đề cương Chi tiết"}
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <Label htmlFor="hocPhan">Học Phần</Label>
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
                      {hocPhan.tenHocPhan}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="mb-5">
                <Label htmlFor="nhomKienThuc">Nhóm Kiến Thức</Label>
                <Select
                  id="nhomKienThuc"
                  name="nhomKienThuc"
                  defaultValue={
                    openModal === "edit" ? selectedDeCuong?.nhomKienThuc.id : ""
                  }
                  required
                >
                  <option value="">Chọn Nhóm Kiến Thức</option>
                  {nhomKienThucs.map((nhomKienThuc) => (
                    <option key={nhomKienThuc.id} value={nhomKienThuc.id}>
                      {nhomKienThuc.ten}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="mb-5">
                <Label htmlFor="thuTuHocKy">Thứ tự Học kỳ</Label>
                <TextInput
                  id="thuTuHocKy"
                  name="thuTuHocKy"
                  type="number"
                  min="1"
                  defaultValue={
                    openModal === "edit" ? selectedDeCuong?.thuTuHocKy : "1"
                  }
                  required
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="batBuoc">Bắt buộc</Label>
                <Checkbox
                  id="batBuoc"
                  name="batBuoc"
                  defaultChecked={
                    openModal === "edit" ? selectedDeCuong?.batBuoc : false
                  }
                />
              </div>
              <div className="flex">
                <Button type="submit">Gửi</Button>
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

      {/* Delete Modal */}
      {openModal === "delete" && (
        <Modal show={true} position="center" onClose={() => setOpenModal(null)}>
          <Modal.Header>Xóa Đề cương Chi tiết</Modal.Header>
          <Modal.Body>
            <p className="text-lg">
              Bạn có chắc chắn muốn xóa đề cương chi tiết này không?
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
        <Table.HeadCell>Nhóm Kiến Thức</Table.HeadCell>
        <Table.HeadCell>Học Kỳ</Table.HeadCell>
        <Table.HeadCell>Bắt Buộc</Table.HeadCell>
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
            <Table.Cell>{deCuong.hocPhan.tenHocPhan}</Table.Cell>
            <Table.Cell>{deCuong.nhomKienThuc.ten}</Table.Cell>
            <Table.Cell>{deCuong.thuTuHocKy}</Table.Cell>
            <Table.Cell>{deCuong.batBuoc ? "Có" : "Không"}</Table.Cell>
            <Table.Cell>
              <Button.Group>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedDeCuong(deCuong);
                    setOpenModal("edit");
                  }}
                >
                  <RxUpdate className="mr-3 h-4 w-4" />
                  Sửa
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedDeCuong(deCuong);
                    setOpenModal("delete");
                  }}
                >
                  <MdDeleteForever className="mr-3 h-4 w-4" />
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
