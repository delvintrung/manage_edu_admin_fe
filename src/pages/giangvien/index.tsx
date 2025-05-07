/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Button,
  Label,
  Table,
  Modal,
  TextInput,
  Select,
  FileInput,
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
import { IoInformation } from "react-icons/io5";
import { FaFileExport, FaFileImport } from "react-icons/fa";

interface Khoa {
  id: string;
  ten: string;
}

interface User {
  id: string;
  username: string;
}

interface GiangVien {
  id: string;
  khoa: Khoa;
  user: User;
  hoTen: string;
  trinhDo: string;
  chuyenMon: string;
  namSinh: string;
}

interface TableProps {
  giangViens: GiangVien[];
}

const GiangVienPage: FC = function () {
  const [giangViens, setGiangViens] = useState<GiangVien[]>([]);
  const [khoas, setKhoas] = useState<Khoa[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [openModal, setOpenModal] = useState<
    "add" | "edit" | "delete" | "import" | null
  >(null);
  const [selectedGiangVien, setSelectedGiangVien] = useState<GiangVien | null>(
    null
  );
  const [searchValue, setSearchValue] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  // Fetch all giangViens, khoas, and users on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [giangVienRes, khoaRes, userRes] = await Promise.all([
          axios.get("/api/giangvien"),
          axios.get("/api/khoa"),
          axios.get("/api/user"),
        ]);
        setGiangViens(giangVienRes.data);
        setKhoas(khoaRes.data);
        setUsers(userRes.data);
      } catch (error) {
        alert("Không thể tải dữ liệu");
      }
    };
    fetchData();
  }, []);

  // Handle search (client-side filtering by hoTen)
  const handleSearch = async () => {
    try {
      const result = await axios.get("/api/giangvien");
      const allGiangViens = result.data;
      if (!searchValue) {
        setGiangViens(allGiangViens);
        return;
      }
      const filteredGiangViens = allGiangViens.filter((gv: GiangVien) =>
        gv.hoTen.toLowerCase().includes(searchValue.toLowerCase())
      );
      setGiangViens(filteredGiangViens);
      if (filteredGiangViens.length === 0) {
        alert("Không tìm thấy giảng viên nào");
      }
    } catch (error) {
      alert("Không thể tải danh sách giảng viên");
    }
  };

  // Handle form submission for add/edit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const giangVien: GiangVien = {
      id: openModal === "add" ? uuidv4() : selectedGiangVien!.id,
      khoa: { id: form["khoa"].value, ten: "" },
      user: { id: form["user"].value, username: "" },
      hoTen: form["hoTen"].value,
      trinhDo: form["trinhDo"].value,
      chuyenMon: form["chuyenMon"].value,
      namSinh: form["namSinh"].value,
    };

    try {
      if (openModal === "add") {
        const result = await axios.post("/api/giangvien", giangVien);
        setGiangViens([...giangViens, result.data]);
        alert("Thêm giảng viên thành công");
      } else {
        const result = await axios.put(
          `/api/giangvien/${giangVien.id}`,
          giangVien
        );
        setGiangViens(
          giangViens.map((gv) => (gv.id === giangVien.id ? result.data : gv))
        );
        alert("Cập nhật giảng viên thành công");
      }
      setOpenModal(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/giangvien/${selectedGiangVien!.id}`);
      setGiangViens(giangViens.filter((gv) => gv.id !== selectedGiangVien!.id));
      alert("Xóa giảng viên thành công");
      setOpenModal(null);
    } catch (error) {
      alert("Xóa giảng viên thất bại");
    }
  };

  // Handle export to CSV
  const handleExport = async () => {
    try {
      const response = await axios.get("/api/giangvien");
      const giangViens = response.data;

      const headers = [
        "ID",
        "Họ Tên",
        "Trình Độ",
        "Chuyên Môn",
        "Năm Sinh",
        "Khoa",
        "Người Dùng",
      ];
      const csvContent = [
        "\uFEFF" + headers.join(","), // Add UTF-8 BOM
        ...giangViens.map((gv: GiangVien) =>
          [
            gv.id,
            `"${gv.hoTen.replace(/"/g, '""')}"`, // Escape quotes
            `"${gv.trinhDo.replace(/"/g, '""')}"`,
            `"${gv.chuyenMon.replace(/"/g, '""')}"`,
            gv.namSinh,
            `"${gv.khoa.ten.replace(/"/g, '""')}"`,
            `"${gv.user.username.replace(/"/g, '""')}"`,
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "giang_vien_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Xuất danh sách giảng viên thất bại");
    }
  };

  // Handle import file
  const handleImport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert("Vui lòng chọn file để nhập");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/giangvien/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setGiangViens(response.data); // Assuming backend returns updated list
      alert("Nhập danh sách giảng viên thành công");
      setOpenModal(null);
      setFile(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Nhập danh sách thất bại");
    }
  };

  return (
    <div>
      <NavbarSidebarLayout isFooter={false}>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Quản lý Giảng Viên
              </h1>
            </div>
            <div className="flex">
              <div className="mb-3 dark:divide-gray-700 sm:mb-0 flex sm:divide-x w-full sm:divide-gray-100">
                <div className="flex items-center justify-between w-full">
                  <div className="lg:pr-3">
                    <Label htmlFor="giangvien-search" className="sr-only">
                      Tìm kiếm
                    </Label>
                    <div className="relative mt-1 lg:w-64 xl:w-96">
                      <TextInput
                        id="giangvien-search"
                        name="giangvien-search"
                        placeholder="Tìm kiếm giảng viên theo họ tên"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                      />
                      <IoIosSearch
                        className="w-8 h-8 absolute top-1 right-2 hover:cursor-pointer"
                        onClick={handleSearch}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button color="gray" onClick={() => setOpenModal("add")}>
                      <IoAddCircle className="mr-3 h-4 w-4" />
                      Thêm Giảng Viên
                    </Button>
                    <Button color="gray" onClick={handleExport}>
                      <FaFileExport className="mr-3 h-4 w-4" />
                      Xuất CSV
                    </Button>
                    <Button color="gray" onClick={() => setOpenModal("import")}>
                      <FaFileImport className="mr-3 h-4 w-4" />
                      Nhập CSV
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
                <GiangVienTable
                  giangViens={giangViens}
                  setOpenModal={setOpenModal}
                  setSelectedGiangVien={setSelectedGiangVien}
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
            {openModal === "add" ? "Thêm Giảng Viên" : "Sửa Giảng Viên"}
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <Label htmlFor="hoTen">Họ Tên</Label>
                <TextInput
                  id="hoTen"
                  name="hoTen"
                  defaultValue={
                    openModal === "edit" ? selectedGiangVien?.hoTen : ""
                  }
                  required
                  maxLength={100}
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="trinhDo">Trình Độ</Label>
                <TextInput
                  id="trinhDo"
                  name="trinhDo"
                  defaultValue={
                    openModal === "edit" ? selectedGiangVien?.trinhDo : ""
                  }
                  required
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="chuyenMon">Chuyên Môn</Label>
                <TextInput
                  id="chuyenMon"
                  name="chuyenMon"
                  defaultValue={
                    openModal === "edit" ? selectedGiangVien?.chuyenMon : ""
                  }
                  required
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="namSinh">Năm Sinh</Label>
                <TextInput
                  id="namSinh"
                  name="namSinh"
                  defaultValue={
                    openModal === "edit" ? selectedGiangVien?.namSinh : ""
                  }
                  required
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="khoa">Khoa</Label>
                <Select
                  id="khoa"
                  name="khoa"
                  defaultValue={
                    openModal === "edit" ? selectedGiangVien?.khoa.id : ""
                  }
                  required
                >
                  <option value="">Chọn Khoa</option>
                  {khoas.map((khoa) => (
                    <option key={khoa.id} value={khoa.id}>
                      {khoa.ten}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="mb-5">
                <Label htmlFor="user">Người Dùng</Label>
                <Select
                  id="user"
                  name="user"
                  defaultValue={
                    openModal === "edit" ? selectedGiangVien?.user.id : ""
                  }
                  required
                >
                  <option value="">Chọn Người Dùng</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username}
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

      {/* Import Modal */}
      {openModal === "import" && (
        <Modal show={true} position="center" onClose={() => setOpenModal(null)}>
          <Modal.Header>Nhập Danh Sách Giảng Viên</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleImport}>
              <div className="mb-5">
                <Label htmlFor="file">Chọn file CSV</Label>
                <FileInput
                  id="file"
                  name="file"
                  accept=".csv"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                />
              </div>
              <div className="flex">
                <Button type="submit">Nhập</Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setOpenModal(null);
                    setFile(null);
                  }}
                  className="ml-2"
                >
                  Hủy
                </Button>
              </div>
            </form>{" "}
          </Modal.Body>
        </Modal>
      )}

      {/* Delete Modal */}
      {openModal === "delete" && (
        <Modal show={true} position="center" onClose={() => setOpenModal(null)}>
          <Modal.Header>Xóa Giảng Viên</Modal.Header>
          <Modal.Body>
            <p className="text-lg">
              Bạn có chắc chắn muốn xóa giảng viên này không?
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

const GiangVienTable: FC<
  TableProps & {
    setOpenModal: (modal: "edit" | "delete" | null) => void;
    setSelectedGiangVien: (giangVien: GiangVien) => void;
  }
> = function ({ giangViens, setOpenModal, setSelectedGiangVien }) {
  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell>ID</Table.HeadCell>
        <Table.HeadCell>Họ Tên</Table.HeadCell>
        <Table.HeadCell>Trình Độ</Table.HeadCell>
        <Table.HeadCell>Chuyên Môn</Table.HeadCell>
        <Table.HeadCell>Năm Sinh</Table.HeadCell>
        <Table.HeadCell>Khoa</Table.HeadCell>
        <Table.HeadCell>Người Dùng</Table.HeadCell>
        <Table.HeadCell>Hành Động</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {giangViens.map((giangVien) => (
          <Table.Row
            className="bg-white dark:border-gray-700 dark:bg-gray-800"
            key={giangVien.id}
          >
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {giangVien.id}
            </Table.Cell>
            <Table.Cell>{giangVien.hoTen}</Table.Cell>
            <Table.Cell>{giangVien.trinhDo}</Table.Cell>
            <Table.Cell>{giangVien.chuyenMon}</Table.Cell>
            <Table.Cell>{giangVien.namSinh}</Table.Cell>
            <Table.Cell>{giangVien.khoa.ten}</Table.Cell>
            <Table.Cell>{giangVien.user.username}</Table.Cell>
            <Table.Cell>
              <Button.Group>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedGiangVien(giangVien);
                    setOpenModal("edit");
                  }}
                  className=" py-1"
                >
                  <IoInformation className="mr-3 h-4 w-4" />
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedGiangVien(giangVien);
                    setOpenModal("edit");
                  }}
                >
                  <RxUpdate className="mr-3 h-4 w-4" />
                  Sửa
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedGiangVien(giangVien);
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

export default GiangVienPage;
