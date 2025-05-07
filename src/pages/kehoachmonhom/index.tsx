/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Label, Table, Modal, TextInput, Select } from "flowbite-react";
import type { FC } from "react";
import { IoIosSearch } from "react-icons/io";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { MdDeleteForever } from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";
import { RxUpdate } from "react-icons/rx";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import axios from "../../config/axios";
import { v4 as uuidv4 } from "uuid";

interface HocPhan {
  id: string;
  ten: string;
}

interface GiangVien {
  id: string;
  hoTen: string;
}

interface KeHoachMoNhom {
  id: string;
  hocPhan: HocPhan;
  khoa: string;
  soSinhVien: number;
  soSinhVienMotLop: number;
}

interface NhomHoc {
  id: string;
  keHoachMoNhom: KeHoachMoNhom;
  maNhom: number;
  soSinhVien: number;
  giangVien: GiangVien | null;
}

interface PhanCongGiangDay {
  id: string;
  giangVien: GiangVien;
  keHoachMoNhom: KeHoachMoNhom;
  soTiet: number;
  nhom: number;
  hocKy: number;
}

interface TableProps {
  keHoachMoNhoms: KeHoachMoNhom[];
}

const KeHoachMoNhomPage: FC = function () {
  const [keHoachMoNhoms, setKeHoachMoNhoms] = useState<KeHoachMoNhom[]>([]);
  const [hocPhans, setHocPhans] = useState<HocPhan[]>([]);
  const [giangViens, setGiangViens] = useState<GiangVien[]>([]);
  const [nhomHocs, setNhomHocs] = useState<NhomHoc[]>([]);
  const [openModal, setOpenModal] = useState<
    "add" | "edit" | "delete" | "assign" | "editAssign" | "deleteAssign" | null
  >(null);
  const [selectedKeHoachMoNhom, setSelectedKeHoachMoNhom] =
    useState<KeHoachMoNhom | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedAssignment, setSelectedAssignment] =
    useState<PhanCongGiangDay | null>(null);
  const [assignmentStatus, setAssignmentStatus] = useState<{
    [key: string]: string;
  }>({});
  const [assignForm, setAssignForm] = useState<{
    giangVienId: string;
    soTiet: number;
    nhom: number;
    hocKy: number;
  }>({
    giangVienId: "",
    soTiet: 0,
    nhom: 0,
    hocKy: 0,
  });
  const [lecturerSearch, setLecturerSearch] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [keHoachMoNhomRes, hocPhanRes, giangVienRes, nhomHocRes] =
          await Promise.all([
            axios.get("/api/kehoachmonhom"),
            axios.get("/api/hocphan"),
            axios.get("/api/giangvien"),
            axios.get("/api/nhomhoc"),
          ]);
        setKeHoachMoNhoms(keHoachMoNhomRes.data);
        setHocPhans(
          hocPhanRes.data.map((hp: any) => ({ id: hp.id, ten: hp.ten }))
        );
        setGiangViens(
          giangVienRes.data.map((gv: any) => ({ id: gv.id, hoTen: gv.hoTen }))
        );
        setNhomHocs(nhomHocRes.data || []);

        // Fetch assignment status for each plan
        const statusMap: { [key: string]: string } = {};
        for (const kmn of keHoachMoNhomRes.data) {
          const assign = await fetchAssignments(kmn.id);
          statusMap[kmn.id] = assign ? "Sửa phân công" : "Phân công";
        }
        setAssignmentStatus(statusMap);
      } catch (error) {
        alert("Không thể tải dữ liệu");
      }
    };
    fetchData();
  }, []);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async () => {
    try {
      const result = await axios.get("/api/kehoachmonhom");
      const allKeHoachMoNhoms = result.data;
      if (!searchValue) {
        setKeHoachMoNhoms(allKeHoachMoNhoms);
        return;
      }
      const filteredKeHoachMoNhoms = allKeHoachMoNhoms.filter(
        (kmn: KeHoachMoNhom) =>
          kmn.khoa.toLowerCase().includes(searchValue.toLowerCase())
      );
      setKeHoachMoNhoms(filteredKeHoachMoNhoms);
      if (filteredKeHoachMoNhoms.length === 0) {
        alert("Không tìm thấy kế hoạch nào");
      }
    } catch (error) {
      alert("Không thể tải danh sách kế hoạch");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const keHoachMoNhom: KeHoachMoNhom = {
      id: openModal === "add" ? uuidv4() : selectedKeHoachMoNhom!.id,
      hocPhan: { id: form["hocPhan"].value, ten: "" },
      khoa: form["khoa"].value,
      soSinhVien: parseInt(form["soSinhVien"].value),
      soSinhVienMotLop: parseInt(form["soSinhVienMotLop"].value),
    };

    try {
      if (openModal === "add") {
        const result = await axios.post("/api/kehoachmonhom", keHoachMoNhom);
        setKeHoachMoNhoms([...keHoachMoNhoms, result.data]);
        alert("Thêm kế hoạch thành công");
      } else if (openModal === "edit") {
        const result = await axios.put(
          `/api/kehoachmonhom/${keHoachMoNhom.id}`,
          keHoachMoNhom
        );
        setKeHoachMoNhoms(
          keHoachMoNhoms.map((kmn) =>
            kmn.id === keHoachMoNhom.id ? result.data : kmn
          )
        );
        alert("Cập nhật kế hoạch thành công");
      }
      setOpenModal(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/kehoachmonhom/${selectedKeHoachMoNhom!.id}`);
      setKeHoachMoNhoms(
        keHoachMoNhoms.filter((kmn) => kmn.id !== selectedKeHoachMoNhom!.id)
      );
      alert("Xóa kế hoạch thành công");
      setOpenModal(null);
    } catch (error) {
      alert("Xóa kế hoạch thất bại");
    }
  };

  const handleAssign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedKeHoachMoNhom || !assignForm.giangVienId || !assignForm.nhom) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const phanCongGiangDay: PhanCongGiangDay = {
        id: uuidv4(),
        giangVien: { id: assignForm.giangVienId, hoTen: "" },
        keHoachMoNhom: selectedKeHoachMoNhom,
        soTiet: assignForm.soTiet,
        nhom: assignForm.nhom,
        hocKy: assignForm.hocKy,
      };
      await axios.post("/api/phanconggiangday", phanCongGiangDay);
      alert("Phân công giảng dạy thành công");
      setAssignmentStatus((prev) => ({
        ...prev,
        [selectedKeHoachMoNhom.id]: "Sửa phân công",
      }));
      setOpenModal(null);
      setAssignForm({ giangVienId: "", soTiet: 0, nhom: 0, hocKy: 0 });
      setLecturerSearch("");
    } catch (error: any) {
      alert(error.response?.data?.message || "Phân công thất bại");
    }
  };

  const handleEditAssign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAssignment || !assignForm.giangVienId || !assignForm.nhom) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const updatedPhanCongGiangDay: PhanCongGiangDay = {
        id: selectedAssignment.id,
        giangVien: { id: assignForm.giangVienId, hoTen: "" },
        keHoachMoNhom: selectedKeHoachMoNhom!,
        soTiet: assignForm.soTiet,
        nhom: assignForm.nhom,
        hocKy: assignForm.hocKy,
      };
      await axios.put(
        `/api/phanconggiangday/${updatedPhanCongGiangDay.id}`,
        updatedPhanCongGiangDay
      );
      alert("Cập nhật phân công thành công");
      setOpenModal(null);
      setAssignForm({ giangVienId: "", soTiet: 0, nhom: 0, hocKy: 0 });
      setLecturerSearch("");
    } catch (error: any) {
      alert(error.response?.data?.message || "Cập nhật thất bại");
    }
  };

  const handleDeleteAssign = async () => {
    if (!selectedAssignment) return;
    try {
      await axios.delete(`/api/phanconggiangday/${selectedAssignment.id}`);
      alert("Xóa phân công thành công");
      setAssignmentStatus((prev) => ({
        ...prev,
        [selectedKeHoachMoNhom!.id]: "Phân công",
      }));
      setOpenModal(null);
    } catch (error) {
      alert("Xóa phân công thất bại");
    }
  };

  const handleCreateNhomHoc = async (keHoachMoNhomId: string) => {
    try {
      const result = await axios.post(`/api/nhomhoc/create/${keHoachMoNhomId}`);
      if (result.data.length > 0) {
        alert(`Đã tạo thành công ${result.data.length} nhóm học`);
        setNhomHocs([...nhomHocs, ...result.data]);
      } else {
        alert("Không thể tạo nhóm học. Vui lòng kiểm tra phân công giảng dạy.");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Tạo nhóm học thất bại");
    }
  };

  const fetchAssignments = async (keHoachMoNhomId: string) => {
    try {
      const response = await axios.get(
        `/api/phanconggiangday?keHoachMoNhomId=${keHoachMoNhomId}`
      );
      return (
        response.data.find(
          (a: PhanCongGiangDay) => a.keHoachMoNhom.id === keHoachMoNhomId
        ) || null
      );
    } catch (error) {
      return null;
    }
  };

  // Filter lecturers based on search input
  const filteredGiangViens = giangViens.filter((giangVien) =>
    giangVien.hoTen.toLowerCase().includes(lecturerSearch.toLowerCase())
  );

  // Handle lecturer selection from dropdown
  const handleSelectLecturer = (giangVien: GiangVien) => {
    setAssignForm({ ...assignForm, giangVienId: giangVien.id });
    setLecturerSearch(giangVien.hoTen);
    setShowDropdown(false);
  };

  // Get available groups for the selected KeHoachMoNhom
  const availableNhomHocs = selectedKeHoachMoNhom
    ? nhomHocs
        .filter(
          (nh) =>
            nh.keHoachMoNhom.id === selectedKeHoachMoNhom.id &&
            nh.giangVien === null
        )
        .map((nh) => nh.maNhom)
    : [];

  return (
    <div>
      <NavbarSidebarLayout isFooter={false}>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Quản lý Kế hoạch Mở Nhóm
              </h1>
            </div>
            <div className="flex">
              <div className="mb-3 dark:divide-gray-700 sm:mb-0 flex sm:divide-x w-full sm:divide-gray-100">
                <div className="flex items-center justify-between w-full">
                  <div className="lg:pr-3">
                    <Label htmlFor="kehoach-search" className="sr-only">
                      Tìm kiếm
                    </Label>
                    <div className="relative mt-1 lg:w-64 xl:w-96">
                      <TextInput
                        id="kehoach-search"
                        name="kehoach-search"
                        placeholder="Tìm kiếm kế hoạch theo khóa"
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
                    <Button color="blue" onClick={() => setOpenModal("add")}>
                      <IoAddCircle className="mr-3 h-4 w-4" />
                      Thêm Kế hoạch
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
                <KeHoachMoNhomTable
                  keHoachMoNhoms={keHoachMoNhoms}
                  setOpenModal={setOpenModal}
                  setSelectedKeHoachMoNhom={setSelectedKeHoachMoNhom}
                  setSelectedAssignment={setSelectedAssignment}
                  handleCreateNhomHoc={handleCreateNhomHoc}
                  assignmentStatus={assignmentStatus}
                />
              </div>
            </div>
          </div>
        </div>
      </NavbarSidebarLayout>

      {(openModal === "add" || openModal === "edit") && (
        <Modal show={true} position="center" onClose={() => setOpenModal(null)}>
          <Modal.Header>
            {openModal === "add" ? "Thêm Kế hoạch" : "Sửa Kế hoạch"}
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <Label htmlFor="hocPhan">Học Phần</Label>
                <Select
                  id="hocPhan"
                  name="hocPhan"
                  defaultValue={
                    openModal === "edit"
                      ? selectedKeHoachMoNhom?.hocPhan.id
                      : ""
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
              <div className="mb-5">
                <Label htmlFor="khoa">Khóa</Label>
                <TextInput
                  id="khoa"
                  name="khoa"
                  defaultValue={
                    openModal === "edit" ? selectedKeHoachMoNhom?.khoa : ""
                  }
                  required
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="soSinhVien">Tổng số sinh viên</Label>
                <TextInput
                  id="soSinhVien"
                  name="soSinhVien"
                  type="number"
                  min="0"
                  defaultValue={
                    openModal === "edit"
                      ? selectedKeHoachMoNhom?.soSinhVien
                      : "0"
                  }
                  required
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="soSinhVienMotLop">Số sinh viên một lớp</Label>
                <TextInput
                  id="soSinhVienMotLop"
                  name="soSinhVienMotLop"
                  type="number"
                  min="0"
                  defaultValue={
                    openModal === "edit"
                      ? selectedKeHoachMoNhom?.soSinhVienMotLop
                      : "0"
                  }
                  required
                />
              </div>
              <div className="flex">
                <Button type="submit" color="blue">
                  Lưu
                </Button>
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

      {openModal === "delete" && (
        <Modal show={true} position="center" onClose={() => setOpenModal(null)}>
          <Modal.Header>Xóa Kế hoạch</Modal.Header>
          <Modal.Body>
            <p className="text-lg">
              Bạn có chắc chắn muốn xóa kế hoạch này không?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button color="red" onClick={handleDelete}>
              Xác nhận
            </Button>
            <Button color="gray" onClick={() => setOpenModal(null)}>
              Hủy
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {(openModal === "assign" || openModal === "editAssign") && (
        <Modal show={true} position="center" onClose={() => setOpenModal(null)}>
          <Modal.Header>
            {openModal === "assign"
              ? "Phân công giảng dạy"
              : "Sửa phân công giảng dạy"}
          </Modal.Header>
          <Modal.Body>
            <form
              onSubmit={
                openModal === "assign" ? handleAssign : handleEditAssign
              }
            >
              <div className="mb-5">
                <Label htmlFor="giangVien">Giảng viên</Label>
                <div className="relative" ref={dropdownRef}>
                  <TextInput
                    id="giangVien"
                    name="giangVien"
                    placeholder="Tìm kiếm giảng viên"
                    value={lecturerSearch}
                    onChange={(e) => {
                      setLecturerSearch(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    required
                  />
                  {showDropdown && filteredGiangViens.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredGiangViens.map((giangVien) => (
                        <div
                          key={giangVien.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectLecturer(giangVien)}
                        >
                          {giangVien.hoTen}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-5">
                <Label htmlFor="soTiet">Số tiết</Label>
                <TextInput
                  id="soTiet"
                  name="soTiet"
                  type="number"
                  min="1"
                  value={assignForm.soTiet || ""}
                  onChange={(e) =>
                    setAssignForm({
                      ...assignForm,
                      soTiet: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="nhom">Nhóm</Label>
                <Select
                  id="nhom"
                  name="nhom"
                  value={assignForm.nhom}
                  onChange={(e) =>
                    setAssignForm({
                      ...assignForm,
                      nhom: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                >
                  <option value="">Chọn nhóm</option>
                  {availableNhomHocs.map((maNhom) => (
                    <option key={maNhom} value={maNhom}>
                      {maNhom}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="mb-5">
                <Label htmlFor="hocKy">Học kỳ</Label>
                <TextInput
                  id="hocKy"
                  name="hocKy"
                  type="number"
                  min="1"
                  value={assignForm.hocKy || ""}
                  onChange={(e) =>
                    setAssignForm({
                      ...assignForm,
                      hocKy: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
              <div className="flex">
                <Button type="submit" color="blue">
                  {openModal === "assign" ? "Phân công" : "Cập nhật"}
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setOpenModal(null);
                    setAssignForm({
                      giangVienId: "",
                      soTiet: 0,
                      nhom: 0,
                      hocKy: 0,
                    });
                    setLecturerSearch("");
                  }}
                  className="ml-2"
                >
                  Hủy
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}

      {openModal === "deleteAssign" && (
        <Modal show={true} position="center" onClose={() => setOpenModal(null)}>
          <Modal.Header>Xóa phân công giảng dạy</Modal.Header>
          <Modal.Body>
            <p className="text-lg">
              Bạn có chắc chắn muốn xóa phân công này không?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button color="red" onClick={handleDeleteAssign}>
              Xác nhận
            </Button>
            <Button color="gray" onClick={() => setOpenModal(null)}>
              Hủy
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

const KeHoachMoNhomTable: FC<
  TableProps & {
    setOpenModal: (
      modal: "edit" | "delete" | "assign" | "editAssign" | "deleteAssign" | null
    ) => void;
    setSelectedKeHoachMoNhom: (keHoachMoNhom: KeHoachMoNhom) => void;
    setSelectedAssignment: (assignment: PhanCongGiangDay | null) => void;
    handleCreateNhomHoc: (keHoachMoNhomId: string) => void;
    assignmentStatus: { [key: string]: string };
  }
> = function ({
  keHoachMoNhoms,
  setOpenModal,
  setSelectedKeHoachMoNhom,
  setSelectedAssignment,
  handleCreateNhomHoc,
  assignmentStatus,
}) {
  const fetchAssignments = async (keHoachMoNhomId: string) => {
    try {
      const response = await axios.get(
        `/api/phanconggiangday?keHoachMoNhomId=${keHoachMoNhomId}`
      );
      return (
        response.data.find(
          (a: PhanCongGiangDay) => a.keHoachMoNhom.id === keHoachMoNhomId
        ) || null
      );
    } catch (error) {
      return null;
    }
  };

  const handleOpenAssignModal = async (keHoachMoNhom: KeHoachMoNhom) => {
    setSelectedKeHoachMoNhom(keHoachMoNhom);
    const assignment = await fetchAssignments(keHoachMoNhom.id);
    if (assignment) {
      setSelectedAssignment(assignment);
      setOpenModal("editAssign");
    } else {
      setSelectedAssignment(null);
      setOpenModal("assign");
    }
  };

  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell>ID</Table.HeadCell>
        <Table.HeadCell>Học Phần</Table.HeadCell>
        <Table.HeadCell>Khóa</Table.HeadCell>
        <Table.HeadCell>Tổng số sinh viên</Table.HeadCell>
        <Table.HeadCell>Số sinh viên một lớp</Table.HeadCell>
        <Table.HeadCell>Hành Động</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {keHoachMoNhoms.map((keHoachMoNhom) => (
          <Table.Row
            className="bg-white dark:border-gray-700 dark:bg-gray-800"
            key={keHoachMoNhom.id}
          >
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {keHoachMoNhom.id}
            </Table.Cell>
            <Table.Cell>{keHoachMoNhom.hocPhan.ten}</Table.Cell>
            <Table.Cell>{keHoachMoNhom.khoa}</Table.Cell>
            <Table.Cell>{keHoachMoNhom.soSinhVien}</Table.Cell>
            <Table.Cell>{keHoachMoNhom.soSinhVienMotLop}</Table.Cell>
            <Table.Cell>
              <Button.Group>
                <Button
                  color="blue"
                  onClick={() => handleOpenAssignModal(keHoachMoNhom)}
                >
                  <FaChalkboardTeacher className="mr-3 h-4 w-4" />
                  {assignmentStatus[keHoachMoNhom.id] || "Phân công"}
                </Button>
                <Button
                  color="blue"
                  onClick={() => {
                    setSelectedKeHoachMoNhom(keHoachMoNhom);
                    setOpenModal("edit");
                  }}
                >
                  <RxUpdate className="mr-3 h-4 w-4" />
                  Sửa
                </Button>
                <Button
                  color="red"
                  onClick={() => {
                    setSelectedKeHoachMoNhom(keHoachMoNhom);
                    setOpenModal("delete");
                  }}
                >
                  <MdDeleteForever className="mr-3 h-4 w-4" />
                  Xóa
                </Button>
                <Button
                  color="blue"
                  onClick={() => handleCreateNhomHoc(keHoachMoNhom.id)}
                >
                  <FaUsers className="mr-3 h-4 w-4" />
                  Tạo nhóm
                </Button>
              </Button.Group>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default KeHoachMoNhomPage;
