/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Label, Table, Modal, TextInput } from "flowbite-react";
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
  moTa: string;
}

interface TableProps {
  khoas: Khoa[];
}

const KhoaPage: FC = function () {
  const [khoas, setKhoas] = useState<Khoa[]>([]);
  const [openModal, setOpenModal] = useState<"add" | "edit" | "delete" | null>(
    null
  );
  const [selectedKhoa, setSelectedKhoa] = useState<Khoa | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  // Fetch all khoas on mount
  useEffect(() => {
    const fetchKhoas = async () => {
      try {
        const result = await axios.get("/api/khoa");
        setKhoas(result.data);
      } catch (error) {
        alert("Không thể tải danh sách khoa");
      }
    };
    fetchKhoas();
  }, []);

  // Handle search (client-side filtering by ten)
  const handleSearch = async () => {
    try {
      const result = await axios.get("/api/khoa");
      const allKhoas = result.data;
      if (!searchValue) {
        setKhoas(allKhoas);
        return;
      }
      const filteredKhoas = allKhoas.filter((khoa: Khoa) =>
        khoa.ten.toLowerCase().includes(searchValue.toLowerCase())
      );
      setKhoas(filteredKhoas);
      if (filteredKhoas.length === 0) {
        alert("Không tìm thấy khoa nào");
      }
    } catch (error) {
      alert("Không thể tải danh sách khoa");
    }
  };

  // Handle form submission for add/edit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const khoa: Khoa = {
      id: openModal === "add" ? uuidv4() : selectedKhoa!.id,
      ten: form["ten"].value,
      moTa: form["moTa"].value,
    };

    try {
      if (openModal === "add") {
        const result = await axios.post("/api/khoa", khoa);
        setKhoas([...khoas, result.data]);
        alert("Thêm khoa thành công");
      } else {
        const result = await axios.put(`/api/khoa/${khoa.id}`, khoa);
        setKhoas(khoas.map((k) => (k.id === khoa.id ? result.data : k)));
        alert("Cập nhật khoa thành công");
      }
      setOpenModal(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/khoa/${selectedKhoa!.id}`);
      setKhoas(khoas.filter((k) => k.id !== selectedKhoa!.id));
      alert("Xóa khoa thành công");
      setOpenModal(null);
    } catch (error) {
      alert("Xóa khoa thất bại");
    }
  };

  return (
    <div>
      <NavbarSidebarLayout isFooter={false}>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Quản lý Khoa
              </h1>
            </div>
            <div className="flex">
              <div className="mb-3 dark:divide-gray-700 sm:mb-0 flex sm:divide-x w-full sm:divide-gray-100">
                <div className="flex items-center justify-between w-full">
                  <div className="lg:pr-3">
                    <Label htmlFor="khoa-search" className="sr-only">
                      Tìm kiếm
                    </Label>
                    <div className="relative mt-1 lg:w-64 xl:w-96">
                      <TextInput
                        id="khoa-search"
                        name="khoa-search"
                        placeholder="Tìm kiếm khoa theo tên"
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
                      Thêm Khoa
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
                <KhoaTable
                  khoas={khoas}
                  setOpenModal={setOpenModal}
                  setSelectedKhoa={setSelectedKhoa}
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
            {openModal === "add" ? "Thêm Khoa" : "Sửa Khoa"}
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <Label htmlFor="ten">Tên Khoa</Label>
                <TextInput
                  id="ten"
                  name="ten"
                  defaultValue={openModal === "edit" ? selectedKhoa?.ten : ""}
                  required
                  maxLength={100}
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="moTa">Mô Tả</Label>
                <TextInput
                  id="moTa"
                  name="moTa"
                  defaultValue={openModal === "edit" ? selectedKhoa?.moTa : ""}
                />
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
          <Modal.Header>Xóa Khoa</Modal.Header>
          <Modal.Body>
            <p className="text-lg">Bạn có chắc chắn muốn xóa khoa này không?</p>
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

const KhoaTable: FC<
  TableProps & {
    setOpenModal: (modal: "edit" | "delete" | null) => void;
    setSelectedKhoa: (khoa: Khoa) => void;
  }
> = function ({ khoas, setOpenModal, setSelectedKhoa }) {
  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell>ID</Table.HeadCell>
        <Table.HeadCell>Tên</Table.HeadCell>
        <Table.HeadCell>Mô Tả</Table.HeadCell>
        <Table.HeadCell>Hành Động</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {khoas.map((khoa) => (
          <Table.Row
            className="bg-white dark:border-gray-700 dark:bg-gray-800"
            key={khoa.id}
          >
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {khoa.id}
            </Table.Cell>
            <Table.Cell>{khoa.ten}</Table.Cell>
            <Table.Cell>{khoa.moTa}</Table.Cell>
            <Table.Cell>
              <Button.Group>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedKhoa(khoa);
                    setOpenModal("edit");
                  }}
                >
                  <RxUpdate className="mr-3 h-4 w-4" />
                  Sửa
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedKhoa(khoa);
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

export default KhoaPage;
