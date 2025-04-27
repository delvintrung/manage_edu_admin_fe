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

interface NganhHoc {
  id: string;
  ten: string;
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

interface TableProps {
  chuongTrinhDaoTaos: ChuongTrinhDaoTao[];
}

const ChuongTrinhDaoTaoPage: FC = function () {
  const [chuongTrinhDaoTaos, setChuongTrinhDaoTaos] = useState<
    ChuongTrinhDaoTao[]
  >([]);
  const [nganhHocs, setNganhHocs] = useState<NganhHoc[]>([]);
  const [openModal, setOpenModal] = useState<"add" | "edit" | "delete" | null>(
    null
  );
  const [selectedChuongTrinh, setSelectedChuongTrinh] =
    useState<ChuongTrinhDaoTao | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  // Fetch all chuongTrinhDaoTaos and nganhHocs on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chuongTrinhRes, nganhHocRes] = await Promise.all([
          axios.get("/api/chuongtrinhdaotao"),
          axios.get("/api/nganhhoc"),
        ]);
        setChuongTrinhDaoTaos(chuongTrinhRes.data);
        setNganhHocs(nganhHocRes.data);
      } catch (error) {
        alert("Không thể lấy dữ liệu");
      }
    };
    fetchData();
  }, []);

  // Handle search (client-side filtering by ten)
  const handleSearch = async () => {
    try {
      const result = await axios.get("/api/chuongtrinhdaotao");
      const allChuongTrinhs = result.data;
      if (!searchValue) {
        setChuongTrinhDaoTaos(allChuongTrinhs);
        return;
      }
      const filteredChuongTrinhs = allChuongTrinhs.filter(
        (ctdt: ChuongTrinhDaoTao) =>
          ctdt.ten.toLowerCase().includes(searchValue.toLowerCase())
      );
      setChuongTrinhDaoTaos(filteredChuongTrinhs);
      if (filteredChuongTrinhs.length === 0) {
        alert("Không tìm thấy chương trình đào tạo nào");
      }
    } catch (error) {
      alert("Không thể lấy danh sách chương trình đào tạo");
    }
  };

  // Handle form submission for add/edit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const chuongTrinh: ChuongTrinhDaoTao = {
      id: openModal === "add" ? uuidv4() : selectedChuongTrinh!.id,
      nganhHoc: { id: form["nganhHoc"].value, ten: "" },
      ten: form["ten"].value,
      heDaoTao: form["heDaoTao"].value,
      trinhDo: form["trinhDo"].value,
      tongTinChi: parseInt(form["tongTinChi"].value),
      thoiGianDaoTao: parseInt(form["thoiGianDaoTao"].value),
    };

    try {
      if (openModal === "add") {
        const result = await axios.post("/api/chuongtrinhdaotao", chuongTrinh);
        setChuongTrinhDaoTaos([...chuongTrinhDaoTaos, result.data]);
        alert("Chương trình đào tạo đã được tạo thành công");
      } else {
        const result = await axios.put(
          `/api/chuongtrinhdaotao/${chuongTrinh.id}`,
          chuongTrinh
        );
        setChuongTrinhDaoTaos(
          chuongTrinhDaoTaos.map((ctdt) =>
            ctdt.id === chuongTrinh.id ? result.data : ctdt
          )
        );
        alert("Chương trình đào tạo đã được cập nhật thành công");
      }
      setOpenModal(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/chuongtrinhdaotao/${selectedChuongTrinh!.id}`);
      setChuongTrinhDaoTaos(
        chuongTrinhDaoTaos.filter((ctdt) => ctdt.id !== selectedChuongTrinh!.id)
      );
      alert("Chương trình đào tạo đã được xóa thành công");
      setOpenModal(null);
    } catch (error) {
      alert("Không thể xóa chương trình đào tạo");
    }
  };

  return (
    <div>
      <NavbarSidebarLayout isFooter={false}>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Quản lý Chương trình Đào tạo
              </h1>
            </div>
            <div className="flex">
              <div className="mb-3 dark:divide-gray-700 sm:mb-0 flex sm:divide-x w-full sm:divide-gray-100">
                <div className="flex items-center justify-between w-full">
                  <div className="lg:pr-3">
                    <Label
                      htmlFor="chuongtrinhdaotao-search"
                      className="sr-only"
                    >
                      Tìm kiếm
                    </Label>
                    <div className="relative mt-1 lg:w-64 xl:w-96">
                      <TextInput
                        id="chuongtrinhdaotao-search"
                        name="chuongtrinhdaotao-search"
                        placeholder="Tìm kiếm chương trình đào tạo theo tên"
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
                      Thêm Chương trình Đào tạo
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
                <ChuongTrinhDaoTaoTable
                  chuongTrinhDaoTaos={chuongTrinhDaoTaos}
                  setOpenModal={setOpenModal}
                  setSelectedChuongTrinh={setSelectedChuongTrinh}
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
              ? "Thêm Chương trình Đào tạo"
              : "Sửa Chương trình Đào tạo"}
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <Label htmlFor="ten">Tên Chương trình</Label>
                <TextInput
                  id="ten"
                  name="ten"
                  defaultValue={
                    openModal === "edit" ? selectedChuongTrinh?.ten : ""
                  }
                  required
                  maxLength={100}
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="heDaoTao">Hệ Đào tạo</Label>
                <TextInput
                  id="heDaoTao"
                  name="heDaoTao"
                  defaultValue={
                    openModal === "edit" ? selectedChuongTrinh?.heDaoTao : ""
                  }
                  required
                  maxLength={50}
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="trinhDo">Trình độ</Label>
                <TextInput
                  id="trinhDo"
                  name="trinhDo"
                  defaultValue={
                    openModal === "edit" ? selectedChuongTrinh?.trinhDo : ""
                  }
                  required
                  maxLength={50}
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="tongTinChi">Tổng Tín chỉ</Label>
                <TextInput
                  id="tongTinChi"
                  name="tongTinChi"
                  type="number"
                  min="0"
                  defaultValue={
                    openModal === "edit" ? selectedChuongTrinh?.tongTinChi : "0"
                  }
                  required
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="thoiGianDaoTao">Thời gian Đào tạo (năm)</Label>
                <TextInput
                  id="thoiGianDaoTao"
                  name="thoiGianDaoTao"
                  type="number"
                  min="0"
                  defaultValue={
                    openModal === "edit"
                      ? selectedChuongTrinh?.thoiGianDaoTao
                      : "0"
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
                    openModal === "edit" ? selectedChuongTrinh?.nganhHoc.id : ""
                  }
                  required
                >
                  <option value="">Chọn Ngành Học</option>
                  {nganhHocs.map((nganhHoc) => (
                    <option key={nganhHoc.id} value={nganhHoc.id}>
                      {nganhHoc.ten}
                    </option>
                  ))}
                </Select>
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
          <Modal.Header>Xóa Chương trình Đào tạo</Modal.Header>
          <Modal.Body>
            <p className="text-lg">
              Bạn có chắc chắn muốn xóa chương trình đào tạo này không?
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

const ChuongTrinhDaoTaoTable: FC<
  TableProps & {
    setOpenModal: (modal: "edit" | "delete" | null) => void;
    setSelectedChuongTrinh: (chuongTrinh: ChuongTrinhDaoTao) => void;
  }
> = function ({ chuongTrinhDaoTaos, setOpenModal, setSelectedChuongTrinh }) {
  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell>Mã</Table.HeadCell>
        <Table.HeadCell>Tên</Table.HeadCell>
        <Table.HeadCell>Hệ Đào tạo</Table.HeadCell>
        <Table.HeadCell>Trình độ</Table.HeadCell>
        <Table.HeadCell>Tổng Tín chỉ</Table.HeadCell>
        <Table.HeadCell>Thời gian (năm)</Table.HeadCell>
        <Table.HeadCell>Ngành Học</Table.HeadCell>
        <Table.HeadCell>Hành động</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {chuongTrinhDaoTaos.map((chuongTrinh) => (
          <Table.Row
            className="bg-white dark:border-gray-700 dark:bg-gray-800"
            key={chuongTrinh.id}
          >
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {chuongTrinh.id}
            </Table.Cell>
            <Table.Cell>{chuongTrinh.ten}</Table.Cell>
            <Table.Cell>{chuongTrinh.heDaoTao}</Table.Cell>
            <Table.Cell>{chuongTrinh.trinhDo}</Table.Cell>
            <Table.Cell>{chuongTrinh.tongTinChi}</Table.Cell>
            <Table.Cell>{chuongTrinh.thoiGianDaoTao}</Table.Cell>
            <Table.Cell>{chuongTrinh.nganhHoc.ten}</Table.Cell>
            <Table.Cell>
              <Button.Group>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedChuongTrinh(chuongTrinh);
                    setOpenModal("edit");
                  }}
                >
                  <RxUpdate className="mr-3 h-4 w-4" />
                  Sửa
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedChuongTrinh(chuongTrinh);
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

export default ChuongTrinhDaoTaoPage;
