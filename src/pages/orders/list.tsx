/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Breadcrumb,
  Button,
  Badge,
  Label,
  Table,
  TextInput,
} from "flowbite-react";
import type { FC } from "react";
import { useState, useEffect } from "react";
import {
  HiCog,
  HiDotsVertical,
  HiExclamationCircle,
  HiHome,
  HiTrash,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import axios from "../../config/axios";
import { fetchOrderStatus } from "../../Slice/order_status";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import checkActionValid from "../../function/checkActionValid";
import { showToast } from "../../Slice/toast";
import ToastComponent from "../../components/toast";

const UserListPage: FC = function () {
  return (
    <NavbarSidebarLayout isFooter={false}>
      <ToastComponent />
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

interface OrderStatus {
  id: number;
  name: string;
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
  const dispatch = useDispatch<AppDispatch>();

  const orderStatus: OrderStatus[] = useSelector(
    (state: RootState) => state.order_status.orderStatus.list
  );

  const role = useSelector((state: RootState) => state.role.currentAction.list);

  const selectStatus = (status: number) => {
    const now = orderStatus?.find((s) => s.id === status);
    let tag = { color: "", name: "" };
    switch (now?.id) {
      case 1:
        tag = { color: "info", name: now.name };
        break;
      case 2:
        tag = { color: "pink", name: now.name };
        break;
      case 3:
        tag = { color: "indigo", name: now.name };
        break;
      case 4:
        tag = { color: "gray", name: now.name };
        break;
      case 5:
        tag = { color: "purple", name: now.name };
        break;
      case 6:
        tag = { color: "success", name: now.name };
        break;
      case 7:
        tag = { color: "failure", name: now.name };
        break;
      case 8:
        tag = { color: "failure", name: now.name };
        break;
      case 9:
        tag = { color: "pink", name: now.name };
        break;
      case 10:
        tag = { color: "success", name: now.name };
        break;
      default:
        tag = { color: "info", name: "Lỗi chưa xác định" };
        break;
    }
    return tag;
  };

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleChangeStatus = (od: string) => {
    const changeStatus = async (od: string) => {
      const res = await axios.put("/api/v2/order/update-order-status", {
        orderId: parseInt(od),
        status: status,
      });
      if (res.data.success === true) {
        dispatch(showToast({ type: "success", message: res.data.message }));
      }
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
            <Badge color={selectStatus(order.status).color}>
              {selectStatus(order.status).name}
            </Badge>
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
                  {orderStatus.length > 0 &&
                    orderStatus.map((item) => (
                      <option
                        value={item.id}
                        selected={order.status == item.id ? true : false}
                      >
                        {item.name}
                      </option>
                    ))}
                </select>
                <Button
                  color="success"
                  onClick={() => handleChangeStatus(order.orderId)}
                  disabled={checkActionValid(role, "orders", "update")}
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
  const [orders, setOrders] = useState<Order[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchOrderStatus());
    const getOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3006/api/v2/order/get-all-order-admin"
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
          {orders.length > 0 &&
            orders.map((order) => <Accordion order={order} />)}
        </div>
      </Table.Body>
    </Table>
  );
};

export default UserListPage;
