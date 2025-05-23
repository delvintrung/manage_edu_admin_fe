/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Label, Table, Modal, Select, TextInput } from "flowbite-react";
import type { FC } from "react";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { MdDeleteForever } from "react-icons/md";
import { FaChalkboardTeacher, FaPrint } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "../../config/axios";
import { v4 as uuidv4 } from "uuid";
import { HocPhan, NganhHoc, Khoa, GiangVien } from "../../types";

interface KeHoachMoNhom {
  id: string;
  hocPhan: HocPhan;
  khoa: Khoa;
  soSinhVien: number;
  soSinhVienMotLop: number;
}

interface NhomHoc {
  id: string;
  keHoachMoNhom: KeHoachMoNhom;
  giangVien: GiangVien | null;
  maNhom: number;
  soSinhVien: number;
}

interface TableProps {
  nhomHocs: NhomHoc[];
}

const NhomHocPage: FC = function () {
  const [nhomHocs, setNhomHocs] = useState<NhomHoc[]>([]);
  const [nganhHocs, setNganhHocs] = useState<NganhHoc[]>([]);
  const [giangViens, setGiangViens] = useState<GiangVien[]>([]);
  const [keHoachMoNhoms, setKeHoachMoNhom] = useState<KeHoachMoNhom[]>([]);
  const [selectedNganhHoc, setSelectedNganhHoc] = useState<string>("");
  const [selectedGiangVien, setSelectedGiangVien] = useState<string>("");
  const [openModal, setOpenModal] = useState<
    "delete" | "assignManual" | "assignAuto" | "schedule" | null
  >(null);
  const [selectedNhomHoc, setSelectedNhomHoc] = useState<NhomHoc | null>(null);
  const [selectedKeHoachMoNhomId, setSelectedKeHoachMoNhomId] = useState<
    string | null
  >(null);
  const [lecturerAssignments, setLecturerAssignments] = useState<{
    [key: string]: number[];
  }>({});
  const [filteredGiangViens, setFilteredGiangViens] = useState<GiangVien[]>([]);
  const [selectedKhoaFilter, setSelectedKhoaFilter] = useState<string>("");
  const [selectedLecturerId, setSelectedLecturerId] = useState<string | null>(
    null
  );
  const [scheduleForm, setScheduleForm] = useState<{
    soTiet: number;
    nhom: number;
    hocKy: number;
  }>({
    soTiet: 0,
    nhom: 0,
    hocKy: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nhomHocRes, nganhHocRes, giangVienRes, keHoachMoNhomRes] =
          await Promise.all([
            axios.get("/api/nhomhoc"),
            axios.get("/api/nganhhoc"),
            axios.get("/api/giangvien"),
            axios.get("/api/kehoachmonhom"),
          ]);
        setNhomHocs(nhomHocRes.data || []);
        setNganhHocs(nganhHocRes.data || []);
        setGiangViens(giangVienRes.data || []);
        setKeHoachMoNhom(keHoachMoNhomRes.data || []);
        setFilteredGiangViens(giangVienRes.data || []);
      } catch (error) {
        alert("Không thể tải dữ liệu");
      }
    };
    fetchData();
  }, []);

  const handleFilter = async () => {
    try {
      let url = "/api/nhomhoc";
      if (selectedNganhHoc) {
        url = `/api/nhomhoc/nganhhoc/${selectedNganhHoc}`;
      } else if (selectedGiangVien) {
        url = `/api/nhomhoc/giangvien/${selectedGiangVien}`;
      }
      const result = await axios.get(url);
      setNhomHocs(result.data || []);
      if (result.data.length === 0) {
        alert("Không tìm thấy nhóm học nào");
      }
    } catch (error) {
      alert("Không thể lọc dữ liệu");
    }
  };

  const handleKhoaFilter = (khoa: string) => {
    setSelectedKhoaFilter(khoa);
    if (khoa) {
      setFilteredGiangViens(giangViens.filter((gv) => gv.khoa.ten === khoa));
    } else {
      setFilteredGiangViens(giangViens);
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedNhomHoc) return;
      await axios.delete(`/api/nhomhoc/${selectedNhomHoc.id}`);
      setNhomHocs(nhomHocs.filter((nh) => nh.id !== selectedNhomHoc.id));
      alert("Xóa nhóm học thành công");
      setOpenModal(null);
    } catch (error) {
      alert("Xóa nhóm học thất bại");
    }
  };

  const handleAssignManual = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedKeHoachMoNhomId) return;

    const availableGroups = nhomHocs
      .filter((nh) => nh.keHoachMoNhom.id === selectedKeHoachMoNhomId)
      .map((nh) => nh.maNhom);
    const assignedGroups = Object.values(lecturerAssignments).flat();
    const unassignedGroups = availableGroups.filter(
      (group) => !assignedGroups.includes(group)
    );

    if (new Set(assignedGroups).size !== assignedGroups.length) {
      alert("Một nhóm không thể được phân công cho nhiều giảng viên");
      return;
    }

    try {
      const assignmentData = Object.entries(lecturerAssignments).map(
        ([giangVienId, groups]) => ({
          giangVienId,
          groups,
        })
      );
      const result = await axios.post(
        `/api/nhomhoc/assign/manual/${selectedKeHoachMoNhomId}`,
        assignmentData
      );
      setNhomHocs(
        nhomHocs.map((nh) =>
          nh.keHoachMoNhom.id === selectedKeHoachMoNhomId
            ? result.data.find((r: NhomHoc) => r.id === nh.id) || nh
            : nh
        )
      );
      alert("Phân công giảng viên thủ công thành công");
      setOpenModal(null);
      setLecturerAssignments({});
    } catch (error: any) {
      alert(error.response?.data?.message || "Phân công thất bại");
    }
  };

  const handleLecturerSelection = (lecturerId: string, groupInput: string) => {
    const groups = groupInput
      .split(",")
      .map((g) => parseInt(g.trim()))
      .filter((g) => !isNaN(g) && g > 0);
    if (groups.length === 0) return;

    setLecturerAssignments((prev) => ({
      ...prev,
      [lecturerId]: groups,
    }));
  };

  const handleScheduleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedKeHoachMoNhomId || !selectedLecturerId || !scheduleForm.nhom)
      return;

    try {
      const scheduleData = {
        id: uuidv4(),
        giangVien: { id: selectedLecturerId },
        keHoachMoNhom: { id: selectedKeHoachMoNhomId },
        soTiet: scheduleForm.soTiet,
        nhom: scheduleForm.nhom,
        hocKy: scheduleForm.hocKy,
      };
      await axios.post("/api/phanconggiangday", scheduleData);
      setNhomHocs(
        nhomHocs.map((nh) =>
          nh.keHoachMoNhom.id === selectedKeHoachMoNhomId &&
          nh.maNhom === scheduleForm.nhom
            ? {
                ...nh,
                giangVien:
                  giangViens.find((gv) => gv.id === selectedLecturerId) || null,
              }
            : nh
        )
      );
      alert("Phân công giảng dạy thành công");
      setOpenModal(null);
      setScheduleForm({ soTiet: 0, nhom: 0, hocKy: 0 });
      setSelectedLecturerId(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Phân công giảng dạy thất bại");
    }
  };

  const handlePrintTemplate = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const groupedNhomHocs = nhomHocs.reduce((acc, nhomHoc) => {
      const hocPhanId = nhomHoc.keHoachMoNhom.hocPhan.id;
      if (!acc[hocPhanId]) {
        acc[hocPhanId] = [];
      }
      acc[hocPhanId].push(nhomHoc);
      return acc;
    }, {} as { [key: string]: NhomHoc[] });

    let totalStudents = 0;
    let totalSoTiets = 0;
    let totalSoTiet = 0;
    const prepareDataPrint: {
      [giangVienId: string]: { hocPhan: HocPhan; nhomHocs: NhomHoc[] }[];
    } = {};

    giangViens.forEach((giangVien) => {
      const assignedNhomHocs = nhomHocs.filter(
        (nh) => nh.giangVien?.id === giangVien.id
      );
      if (assignedNhomHocs.length === 0) return;

      const hocPhanGroups = assignedNhomHocs.reduce((acc, nhomHoc) => {
        const hocPhanId = nhomHoc.keHoachMoNhom.hocPhan.id;
        if (!acc[hocPhanId]) {
          acc[hocPhanId] = {
            hocPhan: nhomHoc.keHoachMoNhom.hocPhan,
            nhomHocs: [],
          };
        }
        acc[hocPhanId].nhomHocs.push(nhomHoc);
        return acc;
      }, {} as { [hocPhanId: string]: { hocPhan: HocPhan; nhomHocs: NhomHoc[] } });

      prepareDataPrint[giangVien.id] = Object.values(hocPhanGroups);
    });

    let res = "";
    Object.entries(prepareDataPrint).forEach(([giangVienId, hocPhanList]) => {
      let rowHtml = "";
      hocPhanList.forEach((item, index) => {
        const hocPhan = item.hocPhan;
        const nhomHocList = item.nhomHocs;
        const totalSinhVien = nhomHocList.reduce(
          (sum, nh) => sum + nh.soSinhVien,
          0
        );
        totalStudents += totalSinhVien;

        totalSoTiet = nhomHocList.reduce(
          (sum, nh) =>
            sum +
            nh.keHoachMoNhom.hocPhan.tietLyThuyet +
            nh.keHoachMoNhom.hocPhan.tietThucHanh,
          0
        );
        totalSoTiets += totalSoTiet;

        const dh1 = nhomHocList.filter((nh) => nh.maNhom == 1).length;
        const dh2 = nhomHocList.filter((nh) => nh.maNhom == 2).length;
        const dh3 = nhomHocList.filter(
          (nh) => nh.maNhom == 3 || nh.maNhom == 10
        ).length;

        const giangVien = giangViens.find((gv) => gv.id === giangVienId) || {
          id: "",
          hoTen: "",
          khoa: { id: "", ten: "", moTa: "" },
          namSinh: "",
          chuyenMon: "",
        };

        if (index === 0) {
          rowHtml = `<tr>
            <td rowspan="${hocPhanList.length}">${giangVien?.id}</td>
            <td rowspan="${hocPhanList.length}">${giangVien?.hoTen || ""}</td>
            <td rowspan="${hocPhanList.length}">${giangVien?.namSinh || ""}</td>
            <td rowspan="${hocPhanList.length}">${
            giangVien?.chuyenMon || ""
          }</td>
            <td>${hocPhan.ten}</td>
            <td>${hocPhan.id}</td>
            <td>${hocPhan.tinChi}</td>
            <td>${hocPhan.tietLyThuyet}</td>
            <td>${hocPhan.tietThucHanh}</td>
            <td>${nhomHocList.length}</td>
            <td>${dh1}</td>
            <td>${dh2}</td>
            <td>${dh3}</td>
            <td>${totalSoTiet}</td>
          </tr>`;
        } else {
          rowHtml += `<tr>
            <td>${hocPhan.ten}</td>
            <td>${hocPhan.id}</td>
            <td>${hocPhan.tinChi}</td>
            <td>${hocPhan.tietLyThuyet}</td>
            <td>${hocPhan.tietThucHanh}</td>
            <td>${nhomHocList.length}</td>
            <td>${dh1}</td>
            <td>${dh2}</td>
            <td>${dh3}</td>
            <td>${totalSoTiet}</td>
          </tr>`;
        }
      });
      res += rowHtml;
    });

    const htmlContent = `
      <html>
        <head>
          <title>Phân công giảng dạy</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: center; }
            th { background-color: #f2f2f2; }
            .title { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 20px; }
            .total-row { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="title">Phân công giảng dạy</div>
          <table>
            <thead>
              <tr>
                <th rowspan="2">STT/Mã CB</th>
                <th rowspan="2">Họ và tên GV</th>
                <th rowspan="2">Năm sinh</th>
                <th rowspan="2">Chức danh, học vị</th>
                <th rowspan="2">Tên học phần</th>
                <th rowspan="2">Mã học phần</th>
                <th rowspan="2">Số tín chỉ TC</th>
                <th rowspan="2">Số tiết LT</th>
                <th rowspan="2">Số tiết TH</th>
                <th rowspan="2">Số nhóm</th>
                <th colspan="3">Giảng dạy ở học kỳ</th>
                <th rowspan="2">Tổng số tiết giảng dạy của GV</th>
              </tr>
              <tr>
                <th>1</th>
                <th>2</th>
                <th>3</th>
              </tr>
            </thead>
            <tbody>
              ${res}
              <tr class="total-row">
                <td colspan="9">Tổng cộng</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>${totalSoTiets}</td>
              </tr>
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Get unassigned groups for the selected KeHoachMoNhom
  const unassignedGroups = selectedKeHoachMoNhomId
    ? nhomHocs
        .filter(
          (nh) =>
            nh.keHoachMoNhom.id === selectedKeHoachMoNhomId &&
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
                Phân công giảng dạy
              </h1>
            </div>
            <div className="flex">
              <div className="mb-3 dark:divide-gray-700 sm:mb-0 flex sm:divide-x w-full sm:divide-gray-100">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 w-full">
                    <div className="lg:pr-3">
                      <Label htmlFor="nganhHoc-filter" className="sr-only">
                        Lọc theo ngành học
                      </Label>
                      <Select
                        id="nganhHoc-filter"
                        name="nganhHoc-filter"
                        value={selectedNganhHoc}
                        onChange={(e) => {
                          setSelectedNganhHoc(e.target.value);
                          setSelectedGiangVien("");
                        }}
                      >
                        <option value="">Tất cả ngành học</option>
                        {nganhHocs.map((nganhHoc) => (
                          <option key={nganhHoc.id} value={nganhHoc.id}>
                            {nganhHoc.ten}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="lg:pr-3">
                      <Label htmlFor="giangVien-filter" className="sr-only">
                        Lọc theo giảng viên
                      </Label>
                      <Select
                        id="giangVien-filter"
                        name="giangVien-filter"
                        value={selectedGiangVien}
                        onChange={(e) => {
                          setSelectedGiangVien(e.target.value);
                          setSelectedNganhHoc("");
                        }}
                      >
                        <option value="">Tất cả giảng viên</option>
                        {giangViens.map((giangVien) => (
                          <option key={giangVien.id} value={giangVien.id}>
                            {giangVien.hoTen}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="lg:pr-3">
                      <Button color="blue" onClick={handleFilter}>
                        Lọc
                      </Button>
                    </div>
                    <div>
                      <Button color="green" onClick={handlePrintTemplate}>
                        <FaPrint className="mr-3 h-4 w-4" />
                        In mẫu
                      </Button>
                    </div>
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
                <NhomHocTable
                  nhomHocs={nhomHocs}
                  setOpenModal={setOpenModal}
                  setSelectedNhomHoc={setSelectedNhomHoc}
                  setSelectedKeHoachMoNhomId={setSelectedKeHoachMoNhomId}
                />
              </div>
            </div>
          </div>
        </div>
      </NavbarSidebarLayout>

      {openModal === "delete" && (
        <Modal show={true} position="center" onClose={() => setOpenModal(null)}>
          <Modal.Header>Xóa Nhóm Học</Modal.Header>
          <Modal.Body>
            <p className="text-lg">
              Bạn có chắc chắn muốn xóa nhóm học này không?
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

      {openModal === "assignManual" && (
        <Modal show={true} position="center" onClose={() => setOpenModal(null)}>
          <Modal.Header>Phân công giảng viên thủ công</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleAssignManual}>
              <div className="mb-5">
                <Label htmlFor="khoa-filter">Lọc giảng viên theo khoa</Label>
                <Select
                  id="khoa-filter"
                  name="khoa-filter"
                  value={selectedKhoaFilter}
                  onChange={(e) => handleKhoaFilter(e.target.value)}
                >
                  <option value="">Tất cả khoa</option>
                  {Array.from(new Set(giangViens.map((gv) => gv.khoa))).map(
                    (khoa) => (
                      <option key={khoa.id} value={khoa.ten}>
                        {khoa.ten}
                      </option>
                    )
                  )}
                </Select>
              </div>
              {filteredGiangViens.map((giangVien) => (
                <div key={giangVien.id} className="mb-5 flex items-center">
                  <div className="flex-1">
                    <Label htmlFor={`groups-${giangVien.id}`} className="mr-3">
                      {giangVien.hoTen} {`(${giangVien.khoa.ten})`}
                    </Label>
                  </div>
                  <Button
                    color="blue"
                    onClick={() => {
                      setSelectedLecturerId(giangVien.id);
                      setOpenModal("schedule");
                    }}
                    className="ml-3"
                  >
                    Phân công dạy học
                  </Button>
                </div>
              ))}
              <div className="flex">
                <Button type="submit" color="blue">
                  Phân công
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setOpenModal(null);
                    setLecturerAssignments({});
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

      {openModal === "schedule" && (
        <Modal show={true} position="center" onClose={() => setOpenModal(null)}>
          <Modal.Header>Phân công giảng dạy</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleScheduleSubmit}>
              <div className="mb-4">
                <Label htmlFor="soTiet">Số tiết</Label>
                <TextInput
                  id="soTiet"
                  type="number"
                  min="1"
                  value={scheduleForm.soTiet || ""}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      soTiet: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="nhom">Nhóm</Label>
                <Select
                  id="nhom"
                  value={scheduleForm.nhom}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      nhom: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                >
                  <option value="">Chọn nhóm</option>
                  {unassignedGroups.map((maNhom) => (
                    <option key={maNhom} value={maNhom}>
                      {maNhom}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="mb-4">
                <Label htmlFor="hocKy">Học kỳ</Label>
                <TextInput
                  id="hocKy"
                  type="number"
                  min="1"
                  value={scheduleForm.hocKy || ""}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      hocKy: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
              <div className="flex">
                <Button type="submit" color="blue">
                  Xác nhận
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setOpenModal(null);
                    setScheduleForm({
                      soTiet: 0,
                      nhom: 0,
                      hocKy: 0,
                    });
                    setSelectedLecturerId(null);
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
    </div>
  );
};

const NhomHocTable: FC<
  TableProps & {
    setOpenModal: (
      type: "delete" | "assignManual" | "assignAuto" | "schedule" | null
    ) => void;
    setSelectedNhomHoc: (nhomHoc: NhomHoc | null) => void;
    setSelectedKeHoachMoNhomId: (id: string | null) => void;
  }
> = function ({
  nhomHocs,
  setOpenModal,
  setSelectedNhomHoc,
  setSelectedKeHoachMoNhomId,
}) {
  const groupedNhomHocs = nhomHocs.reduce((acc, nhomHoc) => {
    const keHoachId = nhomHoc.keHoachMoNhom.id;
    if (!acc[keHoachId]) {
      acc[keHoachId] = [];
    }
    acc[keHoachId].push(nhomHoc);
    return acc;
  }, {} as { [key: string]: NhomHoc[] });

  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell>ID</Table.HeadCell>
        <Table.HeadCell>Mã Nhóm</Table.HeadCell>
        <Table.HeadCell>Học Phần</Table.HeadCell>
        <Table.HeadCell>Giảng Viên</Table.HeadCell>
        <Table.HeadCell>Số Sinh Viên</Table.HeadCell>
        <Table.HeadCell>Hành Động</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {Object.entries(groupedNhomHocs).length > 0 ? (
          Object.entries(groupedNhomHocs).map(([keHoachId, nhomHocList]) =>
            nhomHocList.map((nhomHoc, index) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={nhomHoc.id}
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {nhomHoc.id}
                </Table.Cell>
                <Table.Cell>{nhomHoc.maNhom}</Table.Cell>
                <Table.Cell>{nhomHoc.keHoachMoNhom.hocPhan.ten}</Table.Cell>
                <Table.Cell>
                  {nhomHoc.giangVien
                    ? nhomHoc.giangVien.hoTen
                    : "Chưa phân công"}
                </Table.Cell>
                <Table.Cell>{nhomHoc.soSinhVien}</Table.Cell>
                <Table.Cell>
                  <Button.Group>
                    <Button
                      color="red"
                      onClick={() => {
                        setSelectedNhomHoc(nhomHoc);
                        setOpenModal("delete");
                      }}
                    >
                      <MdDeleteForever className="mr-3 h-4 w-4" />
                      Xóa
                    </Button>
                  </Button.Group>
                </Table.Cell>
              </Table.Row>
            ))
          )
        ) : (
          <Table.Row>
            <Table.Cell colSpan={7} className="text-center">
              Không có dữ liệu
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};

export default NhomHocPage;
