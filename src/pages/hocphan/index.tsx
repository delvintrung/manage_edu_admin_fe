/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Label, Table, Modal, TextInput, Select } from "flowbite-react";
import type { FC } from "react";
import { IoIosSearch } from "react-icons/io";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { MdDeleteForever } from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";
import { RxUpdate } from "react-icons/rx";
import { useEffect, useState } from "react";
import axios from "../../config/axios";
import { v4 as uuidv4 } from "uuid";
import { HocPhan, NganhHoc } from "../../types";

interface TableProps {
  hocPhans: HocPhan[];
}

const HocPhanPage: FC = function () {
  const [hocPhans, setHocPhans] = useState<HocPhan[]>([]);
  const [nganhHocs, setNganhHocs] = useState<NganhHoc[]>([]);
  const [openModal, setOpenModal] = useState<"add" | "edit" | "delete" | null>(
    null
  );
  const [selectedHocPhan, setSelectedHocPhan] = useState<HocPhan | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedNganhHoc, setSelectedNganhHoc] = useState<string>("");

  // Fetch all hocPhans and nganhHocs on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hocPhanRes, nganhHocRes] = await Promise.all([
          axios.get("/api/hocphan"),
          axios.get("/api/nganhhoc"),
        ]);
        setHocPhans(hocPhanRes.data);
        setNganhHocs(nganhHocRes.data);
      } catch (error) {
        alert("Không thể tải dữ liệu");
      }
    };
    fetchData();
  }, []);

  // Handle search (client-side filtering by ten and nganhHoc)
  const handleSearch = async () => {
    try {
      const result = await axios.get("/api/hocphan");
      let filteredHocPhans = result.data;

      // Filter by name if searchValue is provided
      if (searchValue) {
        filteredHocPhans = filteredHocPhans.filter((hp: HocPhan) =>
          hp.ten.toLowerCase().includes(searchValue.toLowerCase())
        );
      }

      // Filter by nganhHoc if selectedNganhHoc is provided
      if (selectedNganhHoc) {
        filteredHocPhans = filteredHocPhans.filter(
          (hp: HocPhan) => hp.nganhHoc?.id === selectedNganhHoc
        );
      }

      setHocPhans(filteredHocPhans);
      if (filteredHocPhans.length === 0) {
        alert("Không tìm thấy học phần nào");
      }
    } catch (error) {
      alert("Không thể tải danh sách học phần");
    }
  };

  // Handle form submission for add/edit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const selectedNganhHocId = form["nganhHoc"].value;
    const hocPhan: HocPhan = {
      id: openModal === "add" ? uuidv4() : selectedHocPhan!.id,
      ten: form["ten"].value,
      tinChi: parseInt(form["tinChi"].value),
      tietLyThuyet: parseInt(form["tietLyThuyet"].value),
      tietThucHanh: parseInt(form["tietThucHanh"].value),
      nganhHoc: selectedNganhHocId
        ? nganhHocs.find((nganh) => nganh.id === selectedNganhHocId)
        : undefined,
    };

    try {
      if (openModal === "add") {
        const result = await axios.post("/api/hocphan", hocPhan);
        setHocPhans([...hocPhans, result.data]);
        alert("Thêm học phần thành công");
      } else {
        const result = await axios.put(`/api/hocphan/${hocPhan.id}`, hocPhan);
        setHocPhans(
          hocPhans.map((hp) => (hp.id === hocPhan.id ? result.data : hp))
        );
        alert("Cập nhật học phần thành công");
      }
      setOpenModal(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/hocphan/${selectedHocPhan!.id}`);
      setHocPhans(hocPhans.filter((hp) => hp.id !== selectedHocPhan!.id));
      alert("Xóa học phần thành công");
      setOpenModal(null);
    } catch (error) {
      alert("Xóa học phần thất bại");
    }
  };

  return (
    <div>
      <NavbarSidebarLayout isFooter={false}>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Quản lý Học Phần
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <div className="mb-3 sm:mb-0">
                <Label htmlFor="hocphan-search" className="sr-only">
                  Tìm kiếm
                </Label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <TextInput
                    id="hocphan-search"
                    name="hocphan-search"
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
              <div className="mb-3 sm:mb-0">
                <Label htmlFor="nganhhoc-search" className="sr-only">
                  Tìm kiếm theo ngành học
                </Label>
                <Select
                  id="nganhhoc-search"
                  value={selectedNganhHoc}
                  onChange={(e) => setSelectedNganhHoc(e.target.value)}
                >
                  <option value="">Tất cả ngành học</option>
                  {nganhHocs.map((nganh) => (
                    <option key={nganh.id} value={nganh.id}>
                      {nganh.ten}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Button color="gray" onClick={() => setOpenModal("add")}>
                  <IoAddCircle className="mr-3 h-4 w-4" />
                  Thêm Học Phần
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow">
                <HocPhanTable
                  hocPhans={hocPhans}
                  setOpenModal={setOpenModal}
                  setSelectedHocPhan={setSelectedHocPhan}
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
            {openModal === "add" ? "Thêm Học Phần" : "Sửa Học Phần"}
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <Label htmlFor="ten">Tên Học Phần</Label>
                <TextInput
                  id="ten"
                  name="ten"
                  defaultValue={
                    openModal === "edit" ? selectedHocPhan?.ten : ""
                  }
                  required
                  maxLength={100}
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="tinChi">Số Tín Chỉ</Label>
                <TextInput
                  id="tinChi"
                  name="tinChi"
                  type="number"
                  min="1"
                  defaultValue={
                    openModal === "edit" ? selectedHocPhan?.tinChi : ""
                  }
                  required
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="tietLyThuyet">Tiết Lý Thuyết</Label>
                <TextInput
                  id="tietLyThuyet"
                  name="tietLyThuyet"
                  type="number"
                  min="0"
                  defaultValue={
                    openModal === "edit" ? selectedHocPhan?.tietLyThuyet : "0"
                  }
                  required
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="tietThucHanh">Tiết Thực Hành</Label>
                <TextInput
                  id="tietThucHanh"
                  name="tietThucHanh"
                  type="number"
                  min="0"
                  defaultValue={
                    openModal === "edit" ? selectedHocPhan?.tietThucHanh : "0"
                  }
                  required
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="nganhHoc">Ngành Học</Label>
                <Select
                  id="nganhHoc"
                  name="nganhHoc"
                  defaultValue={
                    openModal === "edit"
                      ? selectedHocPhan?.nganhHoc?.id || ""
                      : ""
                  }
                >
                  <option value="">Không chọn ngành học</option>
                  {nganhHocs.map((nganh) => (
                    <option key={nganh.id} value={nganh.id}>
                      {nganh.ten}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex">
                <Button type="submit">Lưu</Button>
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
          <Modal.Header>Xóa Học Phần</Modal.Header>
          <Modal.Body>
            <p className="text-lg">
              Bạn có chắc chắn muốn xóa học phần này không?
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

const HocPhanTable: FC<
  TableProps & {
    setOpenModal: (modal: "edit" | "delete" | null) => void;
    setSelectedHocPhan: (hocPhan: HocPhan) => void;
  }
> = function ({ hocPhans, setOpenModal, setSelectedHocPhan }) {
  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell>ID</Table.HeadCell>
        <Table.HeadCell>Tên Học Phần</Table.HeadCell>
        <Table.HeadCell>Số Tín Chỉ</Table.HeadCell>
        <Table.HeadCell>Tiết Lý Thuyết</Table.HeadCell>
        <Table.HeadCell>Tiết Thực Hành</Table.HeadCell>
        <Table.HeadCell>Ngành Học</Table.HeadCell>
        <Table.HeadCell>Hành Động</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {hocPhans.map((hocPhan) => (
          <Table.Row
            className="bg-white dark:border-gray-700 dark:bg-gray-800"
            key={hocPhan.id}
          >
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {hocPhan.id}
            </Table.Cell>
            <Table.Cell>{hocPhan.ten}</Table.Cell>
            <Table.Cell>{hocPhan.tinChi}</Table.Cell>
            <Table.Cell>{hocPhan.tietLyThuyet}</Table.Cell>
            <Table.Cell>{hocPhan.tietThucHanh}</Table.Cell>
            <Table.Cell>
              {hocPhan.nganhHoc ? hocPhan.nganhHoc.ten : "Không có ngành"}
            </Table.Cell>
            <Table.Cell>
              <Button.Group>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedHocPhan(hocPhan);
                    setOpenModal("edit");
                  }}
                >
                  <RxUpdate className="mr-3 h-4 w-4" />
                  Sửa
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedHocPhan(hocPhan);
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

export default HocPhanPage;
