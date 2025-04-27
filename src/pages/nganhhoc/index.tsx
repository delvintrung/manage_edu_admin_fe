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

interface Khoa {
  id: string;
  ten: string;
}

interface NganhHoc {
  id: string;
  khoa: Khoa;
  ten: string;
  moTa: string;
}

interface TableProps {
  nganhHocs: NganhHoc[];
}

const NganhHocPage: FC = function () {
  const [nganhHocs, setNganhHocs] = useState<NganhHoc[]>([]);
  const [khoas, setKhoas] = useState<Khoa[]>([]);
  const [openModal, setOpenModal] = useState<"add" | "edit" | "delete" | null>(
    null
  );
  const [selectedNganhHoc, setSelectedNganhHoc] = useState<NganhHoc | null>(
    null
  );
  const [searchValue, setSearchValue] = useState<string>("");

  // Fetch all nganhHocs and khoas on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nganhHocRes, khoaRes] = await Promise.all([
          axios.get("/api/nganhhoc"),
          axios.get("/api/khoa"),
        ]);
        setNganhHocs(nganhHocRes.data);
        setKhoas(khoaRes.data);
      } catch (error) {
        alert("Không thể tải dữ liệu");
      }
    };
    fetchData();
  }, []);

  // Handle search (client-side filtering by ten)
  const handleSearch = async () => {
    try {
      const result = await axios.get("/api/nganhhoc");
      const allNganhHocs = result.data;
      if (!searchValue) {
        setNganhHocs(allNganhHocs);
        return;
      }
      const filteredNganhHocs = allNganhHocs.filter((nh: NganhHoc) =>
        nh.ten.toLowerCase().includes(searchValue.toLowerCase())
      );
      setNganhHocs(filteredNganhHocs);
      if (filteredNganhHocs.length === 0) {
        alert("Không tìm thấy ngành học nào");
      }
    } catch (error) {
      alert("Không thể tải danh sách ngành học");
    }
  };

  // Handle form submission for add/edit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nganhHoc: NganhHoc = {
      id: openModal === "add" ? uuidv4() : selectedNganhHoc!.id,
      khoa: { id: form["khoa"].value, ten: "" },
      ten: form["ten"].value,
      moTa: form["moTa"].value,
    };

    try {
      if (openModal === "add") {
        const result = await axios.post("/api/nganhhoc", nganhHoc);
        setNganhHocs([...nganhHocs, result.data]);
        alert("Thêm ngành học thành công");
      } else {
        const result = await axios.put(
          `/api/nganhhoc/${nganhHoc.id}`,
          nganhHoc
        );
        setNganhHocs(
          nganhHocs.map((nh) => (nh.id === nganhHoc.id ? result.data : nh))
        );
        alert("Cập nhật ngành học thành công");
      }
      setOpenModal(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/nganhhoc/${selectedNganhHoc!.id}`);
      setNganhHocs(nganhHocs.filter((nh) => nh.id !== selectedNganhHoc!.id));
      alert("Xóa ngành học thành công");
      setOpenModal(null);
    } catch (error) {
      alert("Xóa ngành học thất bại");
    }
  };

  return (
    <div>
      <NavbarSidebarLayout isFooter={false}>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Quản lý Ngành Học
              </h1>
            </div>
            <div className="flex">
              <div className="mb-3 dark:divide-gray-700 sm:mb-0 flex sm:divide-x w-full sm:divide-gray-100">
                <div className="flex items-center justify-between w-full">
                  <div className="lg:pr-3">
                    <Label htmlFor="nganhhoc-search" className="sr-only">
                      Tìm kiếm
                    </Label>
                    <div className="relative mt-1 lg:w-64 xl:w-96">
                      <TextInput
                        id="nganhhoc-search"
                        name="nganhhoc-search"
                        placeholder="Tìm kiếm ngành học theo tên"
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
                      Thêm Ngành Học
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
                <NganhHocTable
                  nganhHocs={nganhHocs}
                  setOpenModal={setOpenModal}
                  setSelectedNganhHoc={setSelectedNganhHoc}
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
            {openModal === "add" ? "Thêm Ngành Học" : "Sửa Ngành Học"}
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <Label htmlFor="ten">Tên Ngành Học</Label>
                <TextInput
                  id="ten"
                  name="ten"
                  defaultValue={
                    openModal === "edit" ? selectedNganhHoc?.ten : ""
                  }
                  required
                  maxLength={100}
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="moTa">Mô Tả</Label>
                <TextInput
                  id="moTa"
                  name="moTa"
                  defaultValue={
                    openModal === "edit" ? selectedNganhHoc?.moTa : ""
                  }
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="khoa">Khoa</Label>
                <Select
                  id="khoa"
                  name="khoa"
                  defaultValue={
                    openModal === "edit" ? selectedNganhHoc?.khoa.id : ""
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
          <Modal.Header>Xóa Ngành Học</Modal.Header>
          <Modal.Body>
            <p className="text-lg">
              Bạn có chắc chắn muốn xóa ngành học này không?
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

const NganhHocTable: FC<
  TableProps & {
    setOpenModal: (modal: "edit" | "delete" | null) => void;
    setSelectedNganhHoc: (nganhHoc: NganhHoc) => void;
  }
> = function ({ nganhHocs, setOpenModal, setSelectedNganhHoc }) {
  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell>ID</Table.HeadCell>
        <Table.HeadCell>Tên</Table.HeadCell>
        <Table.HeadCell>Mô Tả</Table.HeadCell>
        <Table.HeadCell>Khoa</Table.HeadCell>
        <Table.HeadCell>Hành Động</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {nganhHocs.map((nganhHoc) => (
          <Table.Row
            className="bg-white dark:border-gray-700 dark:bg-gray-800"
            key={nganhHoc.id}
          >
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {nganhHoc.id}
            </Table.Cell>
            <Table.Cell>{nganhHoc.ten}</Table.Cell>
            <Table.Cell>{nganhHoc.moTa}</Table.Cell>
            <Table.Cell>{nganhHoc.khoa.ten}</Table.Cell>
            <Table.Cell>
              <Button.Group>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedNganhHoc(nganhHoc);
                    setOpenModal("edit");
                  }}
                >
                  <RxUpdate className="mr-3 h-4 w-4" />
                  Sửa
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedNganhHoc(nganhHoc);
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

export default NganhHocPage;
