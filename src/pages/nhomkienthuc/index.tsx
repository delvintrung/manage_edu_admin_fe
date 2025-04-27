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

interface ChuongTrinhDaoTao {
  id: string;
  ten: string;
}

interface NhomKienThuc {
  id: string;
  chuongTrinhDaoTao: ChuongTrinhDaoTao;
  ten: string;
  tinChiBatBuoc: number;
  tinChiTuChon: number;
}

interface TableProps {
  nhomKienThucs: NhomKienThuc[];
}

const NhomKienThucPage: FC = function () {
  const [nhomKienThucs, setNhomKienThucs] = useState<NhomKienThuc[]>([]);
  const [chuongTrinhDaoTaos, setChuongTrinhDaoTaos] = useState<
    ChuongTrinhDaoTao[]
  >([]);
  const [openModal, setOpenModal] = useState<"add" | "edit" | "delete" | null>(
    null
  );
  const [selectedNhomKienThuc, setSelectedNhomKienThuc] =
    useState<NhomKienThuc | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  // Fetch all nhomKienThucs and chuongTrinhDaoTaos on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nhomKienThucRes, chuongTrinhDaoTaoRes] = await Promise.all([
          axios.get("/api/nhomkienthuc"),
          axios.get("/api/chuongtrinhdaotao"),
        ]);
        setNhomKienThucs(nhomKienThucRes.data);
        setChuongTrinhDaoTaos(chuongTrinhDaoTaoRes.data);
      } catch (error) {
        alert("Không thể tải dữ liệu");
      }
    };
    fetchData();
  }, []);

  // Handle search (client-side filtering by ten)
  const handleSearch = async () => {
    try {
      const result = await axios.get("/api/nhomkienthuc");
      const allNhomKienThucs = result.data;
      if (!searchValue) {
        setNhomKienThucs(allNhomKienThucs);
        return;
      }
      const filteredNhomKienThucs = allNhomKienThucs.filter(
        (nkt: NhomKienThuc) =>
          nkt.ten.toLowerCase().includes(searchValue.toLowerCase())
      );
      setNhomKienThucs(filteredNhomKienThucs);
      if (filteredNhomKienThucs.length === 0) {
        alert("Không tìm thấy nhóm kiến thức nào");
      }
    } catch (error) {
      alert("Không thể tải danh sách nhóm kiến thức");
    }
  };

  // Handle form submission for add/edit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nhomKienThuc: NhomKienThuc = {
      id: openModal === "add" ? uuidv4() : selectedNhomKienThuc!.id,
      chuongTrinhDaoTao: { id: form["chuongTrinhDaoTao"].value, ten: "" },
      ten: form["ten"].value,
      tinChiBatBuoc: parseInt(form["tinChiBatBuoc"].value),
      tinChiTuChon: parseInt(form["tinChiTuChon"].value),
    };

    try {
      if (openModal === "add") {
        const result = await axios.post("/api/nhomkienthuc", nhomKienThuc);
        setNhomKienThucs([...nhomKienThucs, result.data]);
        alert("Thêm nhóm kiến thức thành công");
      } else {
        const result = await axios.put(
          `/api/nhomkienthuc/${nhomKienThuc.id}`,
          nhomKienThuc
        );
        setNhomKienThucs(
          nhomKienThucs.map((nkt) =>
            nkt.id === nhomKienThuc.id ? result.data : nkt
          )
        );
        alert("Cập nhật nhóm kiến thức thành công");
      }
      setOpenModal(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/nhomkienthuc/${selectedNhomKienThuc!.id}`);
      setNhomKienThucs(
        nhomKienThucs.filter((nkt) => nkt.id !== selectedNhomKienThuc!.id)
      );
      alert("Xóa nhóm kiến thức thành công");
      setOpenModal(null);
    } catch (error) {
      alert("Xóa nhóm kiến thức thất bại");
    }
  };

  return (
    <div>
      <NavbarSidebarLayout isFooter={false}>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Quản lý Nhóm Kiến Thức
              </h1>
            </div>
            <div className="flex">
              <div className="mb-3 dark:divide-gray-700 sm:mb-0 flex sm:divide-x w-full sm:divide-gray-100">
                <div className="flex items-center justify-between w-full">
                  <div className="lg:pr-3">
                    <Label htmlFor="nhomkienthuc-search" className="sr-only">
                      Tìm kiếm
                    </Label>
                    <div className="relative mt-1 lg:w-64 xl:w-96">
                      <TextInput
                        id="nhomkienthuc-search"
                        name="nhomkienthuc-search"
                        placeholder="Tìm kiếm nhóm kiến thức theo tên"
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
                      Thêm Nhóm Kiến Thức
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
                <NhomKienThucTable
                  nhomKienThucs={nhomKienThucs}
                  setOpenModal={setOpenModal}
                  setSelectedNhomKienThuc={setSelectedNhomKienThuc}
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
            {openModal === "add" ? "Thêm Nhóm Kiến Thức" : "Sửa Nhóm Kiến Thức"}
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <Label htmlFor="ten">Tên</Label>
                <TextInput
                  id="ten"
                  name="ten"
                  defaultValue={
                    openModal === "edit" ? selectedNhomKienThuc?.ten : ""
                  }
                  required
                  maxLength={100}
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="tinChiBatBuoc">Tín Chỉ Bắt Buộc</Label>
                <TextInput
                  id="tinChiBatBuoc"
                  name="tinChiBatBuoc"
                  type="number"
                  min="0"
                  defaultValue={
                    openModal === "edit"
                      ? selectedNhomKienThuc?.tinChiBatBuoc
                      : "0"
                  }
                  required
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="tinChiTuChon">Tín Chỉ Tự Chọn</Label>
                <TextInput
                  id="tinChiTuChon"
                  name="tinChiTuChon"
                  type="number"
                  min="0"
                  defaultValue={
                    openModal === "edit"
                      ? selectedNhomKienThuc?.tinChiTuChon
                      : "0"
                  }
                  required
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="chuongTrinhDaoTao">Chương Trình Đào Tạo</Label>
                <Select
                  id="chuongTrinhDaoTao"
                  name="chuongTrinhDaoTao"
                  defaultValue={
                    openModal === "edit"
                      ? selectedNhomKienThuc?.chuongTrinhDaoTao.id
                      : ""
                  }
                  required
                >
                  <option value="">Chọn Chương Trình Đào Tạo</option>
                  {chuongTrinhDaoTaos.map((ctdt) => (
                    <option key={ctdt.id} value={ctdt.id}>
                      {ctdt.ten}
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
          <Modal.Header>Xóa Nhóm Kiến Thức</Modal.Header>
          <Modal.Body>
            <p className="text-lg">
              Bạn có chắc chắn muốn xóa nhóm kiến thức này không?
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

const NhomKienThucTable: FC<
  TableProps & {
    setOpenModal: (modal: "edit" | "delete" | null) => void;
    setSelectedNhomKienThuc: (nhomKienThuc: NhomKienThuc) => void;
  }
> = function ({ nhomKienThucs, setOpenModal, setSelectedNhomKienThuc }) {
  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell>ID</Table.HeadCell>
        <Table.HeadCell>Tên</Table.HeadCell>
        <Table.HeadCell>Tín Chỉ Bắt Buộc</Table.HeadCell>
        <Table.HeadCell>Tín Chỉ Tự Chọn</Table.HeadCell>
        <Table.HeadCell>Chương Trình Đào Tạo</Table.HeadCell>
        <Table.HeadCell>Hành Động</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {nhomKienThucs.map((nhomKienThuc) => (
          <Table.Row
            className="bg-white dark:border-gray-700 dark:bg-gray-800"
            key={nhomKienThuc.id}
          >
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {nhomKienThuc.id}
            </Table.Cell>
            <Table.Cell>{nhomKienThuc.ten}</Table.Cell>
            <Table.Cell>{nhomKienThuc.tinChiBatBuoc}</Table.Cell>
            <Table.Cell>{nhomKienThuc.tinChiTuChon}</Table.Cell>
            <Table.Cell>{nhomKienThuc.chuongTrinhDaoTao.ten}</Table.Cell>
            <Table.Cell>
              <Button.Group>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedNhomKienThuc(nhomKienThuc);
                    setOpenModal("edit");
                  }}
                >
                  <RxUpdate className="mr-3 h-4 w-4" />
                  Sửa
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedNhomKienThuc(nhomKienThuc);
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

export default NhomKienThucPage;
