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
import { KeHoachDayHoc, HocPhan, NganhHoc } from "../../types";

const KeHoachDayHocPage: FC = function () {
  const [keHoachDayHocs, setKeHoachDayHocs] = useState<KeHoachDayHoc[]>([]);
  const [hocPhans, setHocPhans] = useState<HocPhan[]>([]);
  const [nganhHocs, setNganhHocs] = useState<NganhHoc[]>([]);
  const [openModal, setOpenModal] = useState<"add" | "edit" | "delete" | null>(
    null
  );
  const [selectedKeHoachDayHoc, setSelectedKeHoachDayHoc] =
    useState<KeHoachDayHoc | null>(null);
  const [searchHocKy, setSearchHocKy] = useState<string>("");
  const [searchNganhHocId, setSearchNganhHocId] = useState<string>("");

  // Fetch all keHoachDayHocs, hocPhans, and nganhHocs on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [keHoachDayHocRes, hocPhanRes, nganhHocsRes] = await Promise.all([
          axios.get("/api/kehoachdayhoc"),
          axios.get("/api/hocphan"),
          axios.get("/api/nganhhoc"),
        ]);
        setKeHoachDayHocs(keHoachDayHocRes.data);
        setHocPhans(hocPhanRes.data);
        setNganhHocs(nganhHocsRes.data);
      } catch (error) {
        alert("Không thể tải dữ liệu");
      }
    };
    fetchData();
  }, []);

  // Handle search by hocKy and nganhHocId
  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (searchHocKy) params.append("hocKy", searchHocKy);
      if (searchNganhHocId) params.append("nganhHocId", searchNganhHocId);

      const result = await axios.get(
        `/api/kehoachdayhoc/search?${params.toString()}`
      );
      const filteredKeHoachDayHocs = result.data;

      setKeHoachDayHocs(filteredKeHoachDayHocs);
      if (filteredKeHoachDayHocs.length === 0) {
        alert("Không tìm thấy kế hoạch dạy học nào");
      }
    } catch (error) {
      alert("Không thể tải danh sách kế hoạch dạy học");
    }
  };

  // Handle form submission for add/edit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nganhHocIdValue = form["nganhHocId"].value || null;

    const keHoachDayHoc: KeHoachDayHoc = {
      id: openModal === "add" ? uuidv4() : selectedKeHoachDayHoc!.id,
      hocPhan: (() => {
        const found = hocPhans.find((hp) => hp.id === form["hocPhanId"].value);
        if (!found) throw new Error("Học phần không tồn tại");
        return found;
      })(),
      hocKy: parseInt(form["hocKy"].value),
      hocPhanTruoc:
        form["maHocPhanTruoc"].value !== ""
          ? hocPhans.find((hp) => hp.id === form["maHocPhanTruoc"].value) ||
            null
          : null,
      nganhHocId: nganhHocIdValue,
    };

    try {
      if (openModal === "add") {
        const result = await axios.post("/api/kehoachdayhoc", keHoachDayHoc);
        setKeHoachDayHocs([...keHoachDayHocs, result.data]);
        alert("Thêm kế hoạch dạy học thành công");
      } else {
        const result = await axios.put(
          `/api/kehoachdayhoc/${keHoachDayHoc.id}`,
          keHoachDayHoc
        );
        setKeHoachDayHocs(
          keHoachDayHocs.map((khdh) =>
            khdh.id === keHoachDayHoc.id ? result.data : khdh
          )
        );
        alert("Cập nhật kế hoạch dạy học thành công");
      }
      setOpenModal(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/kehoachdayhoc/${selectedKeHoachDayHoc!.id}`);
      setKeHoachDayHocs(
        keHoachDayHocs.filter((khdh) => khdh.id !== selectedKeHoachDayHoc!.id)
      );
      alert("Xóa kế hoạch dạy học thành công");
      setOpenModal(null);
    } catch (error) {
      alert("Xóa kế hoạch dạy học thất bại");
    }
  };

  return (
    <div>
      <NavbarSidebarLayout isFooter={false}>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Quản lý Kế hoạch Dạy Học
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <div className="mb-3 sm:mb-0">
                <Label htmlFor="hocKy-search" className="sr-only">
                  Tìm kiếm theo học kỳ
                </Label>
                <div className="relative">
                  <TextInput
                    id="hocKy-search"
                    name="hocKy-search"
                    type="number"
                    placeholder="Nhập học kỳ (1, 2, ...)"
                    value={searchHocKy}
                    onChange={(e) => setSearchHocKy(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-3 sm:mb-0">
                <Label htmlFor="nganhHocId-search" className="sr-only">
                  Tìm kiếm theo ngành học
                </Label>
                <div className="relative">
                  <Select
                    id="nganhHocId-search"
                    name="nganhHocId-search"
                    value={searchNganhHocId}
                    onChange={(e) => setSearchNganhHocId(e.target.value)}
                  >
                    <option value="">Chọn ngành học</option>
                    {nganhHocs.map((nh) => (
                      <option key={nh.id} value={nh.id}>
                        {nh.ten}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div>
                <Button color="gray" onClick={handleSearch}>
                  <IoIosSearch className="mr-3 h-4 w-4" />
                  Tìm kiếm
                </Button>
              </div>
              <div>
                <Button color="gray" onClick={() => setOpenModal("add")}>
                  <IoAddCircle className="mr-3 h-4 w-4" />
                  Thêm Kế hoạch
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow">
                <KeHoachDayHocTable
                  keHoachDayHocs={keHoachDayHocs}
                  setOpenModal={setOpenModal}
                  setSelectedKeHoachDayHoc={setSelectedKeHoachDayHoc}
                  hocPhans={hocPhans}
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
              ? "Thêm Kế hoạch Dạy Học"
              : "Sửa Kế hoạch Dạy Học"}
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <Label htmlFor="hocPhanId">Học Phần</Label>
                <Select
                  id="hocPhanId"
                  name="hocPhanId"
                  defaultValue={
                    openModal === "edit"
                      ? selectedKeHoachDayHoc?.hocPhan?.id
                      : ""
                  }
                  required
                >
                  <option value="">Chọn học phần</option>
                  {hocPhans.map((hp) => (
                    <option key={hp.id} value={hp.id}>
                      {hp.ten}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="mb-5">
                <Label htmlFor="hocKy">Học Kỳ Thực Hiện</Label>
                <TextInput
                  id="hocKy"
                  name="hocKy"
                  type="number"
                  min="1"
                  max="12"
                  defaultValue={
                    openModal === "edit" ? selectedKeHoachDayHoc?.hocKy : ""
                  }
                  required
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="maHocPhanTruoc">Học Phần Trước</Label>
                <Select
                  id="maHocPhanTruoc"
                  name="maHocPhanTruoc"
                  defaultValue={
                    openModal === "edit"
                      ? selectedKeHoachDayHoc?.hocPhanTruoc?.id || ""
                      : ""
                  }
                >
                  <option value="">Không có</option>
                  {openModal === "edit"
                    ? hocPhans
                        .filter(
                          (hp) => selectedKeHoachDayHoc?.hocPhan?.id !== hp.id
                        )
                        .map((hp) => (
                          <option key={hp.id} value={hp.id}>
                            {hp.ten}
                          </option>
                        ))
                    : hocPhans.map((hp) => (
                        <option key={hp.id} value={hp.id}>
                          {hp.ten}
                        </option>
                      ))}
                </Select>
              </div>
              <div className="mb-5">
                <Label htmlFor="nganhHocId">Ngành học</Label>
                <Select
                  id="nganhHocId"
                  name="nganhHocId"
                  defaultValue={
                    openModal === "edit"
                      ? selectedKeHoachDayHoc?.nganhHocId || ""
                      : ""
                  }
                  required
                >
                  <option value="">Chọn ngành học</option>
                  {nganhHocs.map((nh) => (
                    <option key={nh.id} value={nh.id}>
                      {nh.ten}
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
          <Modal.Header>Xóa Kế hoạch Dạy Học</Modal.Header>
          <Modal.Body>
            <p className="text-lg">
              Bạn có chắc chắn muốn xóa kế hoạch dạy học này không?
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

const KeHoachDayHocTable: FC<{
  keHoachDayHocs: KeHoachDayHoc[];
  setOpenModal: (modal: "edit" | "delete" | null) => void;
  setSelectedKeHoachDayHoc: (keHoachDayHoc: KeHoachDayHoc) => void;
  hocPhans: HocPhan[];
}> = function ({
  keHoachDayHocs,
  setOpenModal,
  setSelectedKeHoachDayHoc,
  hocPhans,
}) {
  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell>ID</Table.HeadCell>
        <Table.HeadCell>Học Phần</Table.HeadCell>
        <Table.HeadCell>Học Kỳ</Table.HeadCell>
        <Table.HeadCell>Học Phần Trước</Table.HeadCell>
        <Table.HeadCell>Hành Động</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {keHoachDayHocs.map((khdh) => (
          <Table.Row
            className="bg-white dark:border-gray-700 dark:bg-gray-800"
            key={khdh.id}
          >
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {khdh.id}
            </Table.Cell>
            <Table.Cell>{khdh.hocPhan?.ten || "N/A"}</Table.Cell>
            <Table.Cell>{khdh.hocKy}</Table.Cell>
            <Table.Cell>{khdh.hocPhanTruoc?.ten || "Không có"}</Table.Cell>
            <Table.Cell>
              <Button.Group>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedKeHoachDayHoc(khdh);
                    setOpenModal("edit");
                  }}
                >
                  <RxUpdate className="mr-3 h-4 w-4" />
                  Sửa
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedKeHoachDayHoc(khdh);
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

export default KeHoachDayHocPage;
