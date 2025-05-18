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

import { CotDiem, DeCuongChiTiet, CotDiemChiTiet } from "../../types";

interface TableProps {
  cotDiems: CotDiem[];
}

const CotDiemPage: FC = function () {
  const [cotDiems, setCotDiems] = useState<CotDiem[]>([]);
  const [deCuongChiTiets, setDeCuongChiTiets] = useState<DeCuongChiTiet[]>([]);
  const [openModal, setOpenModal] = useState<"add" | "edit" | "delete" | null>(
    null
  );
  const [selectedCotDiem, setSelectedCotDiem] = useState<CotDiem | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  // Fetch all cotDiems and deCuongChiTiets on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cotDiemRes, deCuongChiTietRes] = await Promise.all([
          axios.get("/api/cotdiem"),
          axios.get("/api/decuongchitiet"),
        ]);
        setCotDiems(cotDiemRes.data);
        setDeCuongChiTiets(deCuongChiTietRes.data);
      } catch (error) {
        alert("Không thể tải dữ liệu");
      }
    };
    fetchData();
  }, []);

  // Handle search (client-side filtering by tenCotDiem)
  const handleSearch = async () => {
    try {
      const result = await axios.get("/api/cotdiem");
      const allCotDiems = result.data;
      if (!searchValue) {
        setCotDiems(allCotDiems);
        return;
      }
      const filteredCotDiems = allCotDiems.filter((cd: CotDiem) =>
        cd.tenCotDiem.toLowerCase().includes(searchValue.toLowerCase())
      );
      setCotDiems(filteredCotDiems);
      if (filteredCotDiems.length === 0) {
        alert("Không tìm thấy cột điểm nào");
      }
    } catch (error) {
      alert("Không thể tải danh sách cột điểm");
    }
  };

  // Handle form submission for add/edit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const cotDiem: CotDiem = {
      id: openModal === "add" ? uuidv4() : selectedCotDiem!.id,
      tenCotDiem: form["tenCotDiem"].value,
      trongSoDanhGia: form["trongSoDanhGia"].value,
      hinhThucDanhGia: form["hinhThucDanhGia"].value || null,
    };

    try {
      if (openModal === "add") {
        const result = await axios.post("/api/cotdiem", cotDiem);
        setCotDiems([...cotDiems, result.data]);
        alert("Thêm cột điểm thành công");
      } else {
        const result = await axios.put(`/api/cotdiem/${cotDiem.id}`, cotDiem);
        setCotDiems(
          cotDiems.map((cd) => (cd.id === cotDiem.id ? result.data : cd))
        );
        alert("Cập nhật cột điểm thành công");
      }
      setOpenModal(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/cotdiem/${selectedCotDiem!.id}`);
      setCotDiems(cotDiems.filter((cd) => cd.id !== selectedCotDiem!.id));
      alert("Xóa cột điểm thành công");
      setOpenModal(null);
    } catch (error) {
      alert("Xóa cột điểm thất bại");
    }
  };

  return (
    <div>
      <NavbarSidebarLayout isFooter={false}>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Quản lý Cột Điểm
              </h1>
            </div>
            <div className="flex">
              <div className="mb-3 dark:divide-gray-700 sm:mb-0 flex sm:divide-x w-full sm:divide-gray-100">
                <div className="flex items-center justify-between w-full">
                  <div className="lg:pr-3">
                    <Label htmlFor="cotdiem-search" className="sr-only">
                      Tìm kiếm
                    </Label>
                    <div className="relative mt-1 lg:w-64 xl:w-96">
                      <TextInput
                        id="cotdiem-search"
                        name="cotdiem-search"
                        placeholder="Tìm kiếm cột điểm theo tên"
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
                      Thêm Cột Điểm
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
                <CotDiemTable
                  cotDiems={cotDiems}
                  setOpenModal={setOpenModal}
                  setSelectedCotDiem={setSelectedCotDiem}
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
            {openModal === "add" ? "Thêm Cột Điểm" : "Sửa Cột Điểm"}
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className="mb-5"></div>
              <div className="mb-5">
                <Label htmlFor="tenCotDiem">Tên Cột Điểm</Label>
                <TextInput
                  id="tenCotDiem"
                  name="tenCotDiem"
                  defaultValue={
                    openModal === "edit" ? selectedCotDiem?.tenCotDiem : ""
                  }
                  required
                  maxLength={255}
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="trongSoDanhGia">Trọng Số Đánh Giá</Label>
                <TextInput
                  id="trongSoDanhGia"
                  name="trongSoDanhGia"
                  type="text"
                  defaultValue={
                    openModal === "edit" ? selectedCotDiem?.trongSoDanhGia : ""
                  }
                  required
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="hinhThucDanhGia">Hình Thức Đánh Giá</Label>
                <TextInput
                  id="hinhThucDanhGia"
                  name="hinhThucDanhGia"
                  defaultValue={
                    openModal === "edit"
                      ? selectedCotDiem?.hinhThucDanhGia ?? ""
                      : ""
                  }
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
          <Modal.Header>Xóa Cột Điểm</Modal.Header>
          <Modal.Body>
            <p className="text-lg">
              Bạn có chắc chắn muốn xóa cột điểm này không?
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

const CotDiemTable: FC<
  TableProps & {
    setOpenModal: (modal: "edit" | "delete" | null) => void;
    setSelectedCotDiem: (cotDiem: CotDiem) => void;
  }
> = function ({ cotDiems, setOpenModal, setSelectedCotDiem }) {
  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell>ID</Table.HeadCell>
        <Table.HeadCell>Tên Cột Điểm</Table.HeadCell>
        <Table.HeadCell>Trọng Số Đánh Giá</Table.HeadCell>
        <Table.HeadCell>Hình Thức Đánh Giá</Table.HeadCell>
        <Table.HeadCell>Hành Động</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {cotDiems.map((cotDiem) => (
          <Table.Row
            className="bg-white dark:border-gray-700 dark:bg-gray-800"
            key={cotDiem.id}
          >
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {cotDiem.id}
            </Table.Cell>
            <Table.Cell>{cotDiem.tenCotDiem}</Table.Cell>
            <Table.Cell>{cotDiem.trongSoDanhGia}</Table.Cell>
            <Table.Cell>{cotDiem.hinhThucDanhGia || "Không có"}</Table.Cell>
            <Table.Cell>
              <Button.Group>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedCotDiem(cotDiem);
                    setOpenModal("edit");
                  }}
                >
                  <RxUpdate className="mr-3 h-4 w-4" />
                  Sửa
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedCotDiem(cotDiem);
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

export default CotDiemPage;
