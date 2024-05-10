/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Breadcrumb,
  Button,
  Checkbox,
  Badge,
  Label,
  Modal,
  Table,
  TextInput,
} from "flowbite-react";
import type { FC } from "react";
import { useState, useEffect } from "react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiCog,
  HiDotsVertical,
  HiExclamationCircle,
  HiHome,
  HiOutlineExclamationCircle,
  HiOutlinePencilAlt,
  HiPlus,
  HiTrash,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import axios from "axios";

interface User {
  id: number;
  role_id: number;
  address: string;
  fullName: string;
  phone_number: string;
  email: string;
  status: number;
}

const UserListPage: FC = function () {
  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item href="#">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">Home</span>
                </div>
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/orders/list">Orders</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All orders
            </h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              <form className="lg:pr-3">
                <Label htmlFor="users-search" className="sr-only">
                  Search
                </Label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <TextInput
                    id="users-search"
                    name="users-search"
                    placeholder="Search for orders"
                  />
                </div>
              </form>
              <div className="mt-3 flex space-x-1 pl-0 sm:mt-0 sm:pl-2">
                <a
                  href="#"
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Configure</span>
                  <HiCog className="text-2xl" />
                </a>
                <a
                  href="#"
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Delete</span>
                  <HiTrash className="text-2xl" />
                </a>
                <a
                  href="#"
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Purge</span>
                  <HiExclamationCircle className="text-2xl" />
                </a>
                <a
                  href="#"
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Settings</span>
                  <HiDotsVertical className="text-2xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <AllUsersTable />
            </div>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

const AddUserModal: FC = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Add user
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add new user</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <div className="mt-1">
                <TextInput
                  id="firstName"
                  name="firstName"
                  placeholder="Bonnie"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="lastName">Last name</Label>
              <div className="mt-1">
                <TextInput id="lastName" name="lastName" placeholder="Green" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="mt-1">
                <TextInput
                  id="email"
                  name="email"
                  placeholder="example@company.com"
                  type="email"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone number</Label>
              <div className="mt-1">
                <TextInput
                  id="phone"
                  name="phone"
                  placeholder="e.g., +(12)3456 789"
                  type="tel"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <div className="mt-1">
                <TextInput
                  id="department"
                  name="department"
                  placeholder="Development"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <div className="mt-1">
                <TextInput
                  id="company"
                  name="company"
                  placeholder="Somewhere"
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={() => setOpen(false)}>
            Add user
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
type Product = {
  productName: string;
  quantity: number;
  unitPrice: string;
  thumbnail: string;
};
interface Order {
  orderId: string;
  shipFee: number;
  note: string;
  products: Product[];
  total: string;
  orderDate: string;
  status: number;
  employeeId: null | string;
}

function convertToCurrencyFormat(amount: number) {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function Accordion({ order }: { order: Order }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(1);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleChangeStatus = (od: string) => {
    const changeStatus = async (od: string) => {
      const res = await axios.post(
        "http://localhost/WriteResfulAPIPHP/admin/order/changeStatus.php",
        {
          orderId: parseInt(od),
          status: status,
          employeeId: localStorage.getItem("employeeId"),
        }
      );
      console.log(res.data);
    };
    changeStatus(od);
  };

  return (
    <div>
      <div onClick={toggleAccordion}>
        <div className="flex justify-between gap-x-[80px] h-[50px] items-center border-2 border-slate-300">
          <div className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
            {order.orderId}
          </div>
          <div className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white w-[200px] max-w-[210px]">
            {order.products[0]?.productName}
          </div>
          <div className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
            {order.orderDate}
          </div>
          <div className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
            {convertToCurrencyFormat(parseFloat(order.total) + order.shipFee)}
          </div>

          <div className="flex whitespace-nowrap p-4">
            {order.status == 1 ? (
              <Badge color="info">Chờ xử lý</Badge>
            ) : order.status == 2 ? (
              <Badge color="indigo">Đã liên hệ</Badge>
            ) : order.status == 3 ? (
              <Badge color="gray">Đang giao hàng</Badge>
            ) : order.status == 4 ? (
              <Badge color="success">Giao thành công</Badge>
            ) : (
              <Badge color="failure">Đã hủy</Badge>
            )}
          </div>
          <div className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
            {order.employeeId}
          </div>
          <div></div>
        </div>
      </div>

      {isOpen && (
        <div className="mb-5 p-3">
          <div>
            {order.products.map((product) => (
              <div className="flex items-center justify-between my-3">
                <img src={product.thumbnail} alt="" className="w-[80px] " />
                <p className="w-[400px]">{product.productName}</p>
                <span>x{product.quantity}</span>
                <span>
                  {convertToCurrencyFormat(parseFloat(product.unitPrice))}
                </span>
                <span>
                  {convertToCurrencyFormat(
                    product.quantity * parseInt(product.unitPrice)
                  )}{" "}
                </span>
                <div></div>
              </div>
            ))}

            <div className="flex justify-between px-20 ">
              <div></div>
              <div className="flex w-[260px] mb-10">
                <p>Nội dung ghi chú:</p>
                <p>{order.note}</p>
              </div>
            </div>
            <div className="flex justify-between px-20">
              <div></div>
              <div className="flex items-center gap-5">
                <select
                  name=""
                  id=""
                  onChange={(e) => {
                    setStatus(parseInt(e.target.value));
                  }}
                >
                  <option value="1" selected>
                    Vừa tiếp nhận
                  </option>
                  <option value="2">Đã liên hệ</option>
                  <option value="3">Đang giao hàng</option>
                  <option value="4">Giao thành công</option>
                  <option value="5">Đã hủy</option>
                </select>
                <Button
                  color="success"
                  onClick={() => handleChangeStatus(order.orderId)}
                >
                  Xác nhận
                </Button>
              </div>
            </div>
            <div className="flex justify-between mt-10 px-20">
              <div></div>
              <div>
                <div className="flex items-center gap-8">
                  <p>Mã đơn hàng:</p> <span>{order.orderId}</span>{" "}
                </div>
                <div className="flex items-center gap-8">
                  <p>Phương thức giao hàng:</p> <span>COD</span>{" "}
                </div>
                <div className="flex items-center gap-8">
                  <p>Phí Ship:</p>{" "}
                  <span>{convertToCurrencyFormat(order.shipFee)}</span>{" "}
                </div>
                <div className="flex items-center gap-8">
                  <p>Tổng tiền thanh toán:</p>{" "}
                  <span>
                    {convertToCurrencyFormat(
                      parseFloat(order.total) + order.shipFee
                    )}
                  </span>{" "}
                </div>
                <div className="flex items-center gap-8">
                  <p>Ngày đặt hàng:</p> <span>{order.orderDate}</span>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const AllUsersTable: FC = function () {
  const initValue: Order = {
    orderId: "123",
    products: [
      {
        productName: "50 Sắc Màu Tập 2",
        quantity: 3,
        unitPrice: "45000.00",
        thumbnail:
          "https://imagedelivery.net/qUfEtSOHlgMQ8zObLoE0pg/56b0b4b6-f833-46d6-47e7-08ba5a4d2100/w=705",
      },
      {
        productName: "Truyện Kiều và Tarot",
        quantity: 1,
        unitPrice: "250000.00",
        thumbnail:
          "https://imagedelivery.net/qUfEtSOHlgMQ8zObLoE0pg/ef280a01-24ac-4894-843f-3ccef4fc3f00/w=705",
      },
    ],
    total: "1000.00",
    orderDate: "2024-05-10",
    status: 1,
    shipFee: 35000,
    note: "le",
    employeeId: null,
  };

  const [orders, setOrders] = useState<Order[]>([initValue]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost/WriteResfulAPIPHP/admin/order/getAllOrder.php"
        );
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    getOrders();
  }, []);

  return (
    <Table
      striped
      className="min-w-full divide-y divide-gray-200 dark:divide-gray-600"
    >
      <Table.Head className="bg-gray-50 dark:bg-gray-700">
        <Table.HeadCell className="flex justify-between">
          <div>Mã đơn</div> <div>Tên sản phẩm</div> <div>Ngày đặt</div>{" "}
          <div>Tổng</div>
          <div>Trạng thái</div>
          <div>Mã nhân viên</div>
        </Table.HeadCell>
      </Table.Head>

      <Table.Body className="bg-white dark:bg-gray-800">
        <div>
          {orders.map((order) => (
            <Accordion order={order} />
          ))}
        </div>
      </Table.Body>
    </Table>
  );
};

const EditUserModal: FC = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-2">
          <HiOutlinePencilAlt className="text-lg" />
          Edit user
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Edit user</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <div className="mt-1">
                <TextInput
                  id="firstName"
                  name="firstName"
                  placeholder="Bonnie"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="lastName">Last name</Label>
              <div className="mt-1">
                <TextInput id="lastName" name="lastName" placeholder="Green" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="mt-1">
                <TextInput
                  id="email"
                  name="email"
                  placeholder="example@company.com"
                  type="email"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone number</Label>
              <div className="mt-1">
                <TextInput
                  id="phone"
                  name="phone"
                  placeholder="e.g., +(12)3456 789"
                  type="tel"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <div className="mt-1">
                <TextInput
                  id="department"
                  name="department"
                  placeholder="Development"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <div className="mt-1">
                <TextInput
                  id="company"
                  name="company"
                  placeholder="Somewhere"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="passwordCurrent">Current password</Label>
              <div className="mt-1">
                <TextInput
                  id="passwordCurrent"
                  name="passwordCurrent"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="passwordNew">New password</Label>
              <div className="mt-1">
                <TextInput
                  id="passwordNew"
                  name="passwordNew"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={() => setOpen(false)}>
            Save all
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const DeleteUserModal: FC<{ id: number }> = function (props): JSX.Element {
  const [isOpen, setOpen] = useState(false);
  const handleDeleteUser = (userId: number) => {
    const sendRequest = async () => {
      const res = await axios.put(
        "http://localhost/WriteResfulAPIPHP/admin/user/deleteUser.php",
        { userId: userId }
      );
      console.log(userId);
    };
    sendRequest();
  };
  return (
    <>
      <Button color="failure" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-2">
          <HiTrash className="text-lg" />
          Delete user
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-6 pt-6 pb-0">
          <span className="sr-only">Delete user</span>
        </Modal.Header>
        <Modal.Body className="px-6 pt-0 pb-6">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to delete this user?
            </p>
            <div className="flex items-center gap-x-3">
              <Button
                color="failure"
                onClick={() => {
                  handleDeleteUser(props.id);
                  setOpen(false);
                }}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export const Pagination: FC = function () {
  return (
    <div className="sticky right-0 bottom-0 w-full items-center border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex sm:justify-between">
      <div className="mb-4 flex items-center sm:mb-0">
        <a
          href="#"
          className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <span className="sr-only">Previous page</span>
          <HiChevronLeft className="text-2xl" />
        </a>
        <a
          href="#"
          className="mr-2 inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <span className="sr-only">Next page</span>
          <HiChevronRight className="text-2xl" />
        </a>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            1-20
          </span>
          &nbsp;of&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            2290
          </span>
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <a
          href="#"
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary-700 py-2 px-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          <HiChevronLeft className="mr-1 text-base" />
          Previous
        </a>
        <a
          href="#"
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary-700 py-2 px-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Next
          <HiChevronRight className="ml-1 text-base" />
        </a>
      </div>
    </div>
  );
};

export default UserListPage;
