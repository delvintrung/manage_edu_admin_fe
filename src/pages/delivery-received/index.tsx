/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Button,
  Label,
  Table,
  TextInput,
  Modal,
  Select,
  Textarea,
} from "flowbite-react";
import type { FC } from "react";
import { useState, useEffect } from "react";
import { IoMdAddCircleOutline, IoIosSearch } from "react-icons/io";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import axios from "../../config/axios";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { addProductsWait, removeProductsWait } from "../../Slice/products_wait";
import checkActionValid from "../../function/checkActionValid";
import ToastComponent from "../../components/toast";
import { showToast } from "../../Slice/toast";

const DeliveryPage: FC = function () {
  const [openModal, setOpenModal] = useState(false);
  const [idProduct, setIdProduct] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [products, setProducts] = useState([]);
  const [company, setCompany] = useState([]);
  const [note, setNote] = useState("");

  const [companySelected, setCompanySelected] = useState(0);

  const dispatch = useDispatch();

  const productsWait = useSelector(
    (state: RootState) => state.productsWait.productsWait
  );

  const role = useSelector((state: RootState) => state.role.currentAction.list);

  function onCloseModal() {
    setOpenModal(false);
  }

  useEffect(() => {
    const fetch = async () => {
      const allProducts = await axios.get("/api/v2/product");
      setProducts(allProducts.data);

      const company = await axios.get("/api/v2/company");
      setCompany(company.data);
    };

    fetch();
  }, []);

  const handleAddDelivery = () => {
    try {
      const data = {
        companyId: companySelected,
        note: note,
        products: productsWait,
      };
      axios
        .post("/api/v2/create-received", data)
        .then(() => {
          dispatch(
            showToast({ message: "Create delivery success", type: "success" })
          );
          setOpenModal(false);
        })
        .catch((error) => {
          dispatch(
            showToast({ message: "Create delivery fail", type: "error" })
          );
          console.log(error);
          setOpenModal(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <NavbarSidebarLayout isFooter={false}>
        <ToastComponent />
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Delivery History
              </h1>
            </div>
            <div className="sm:flex sm:justify-between">
              <div className="hidden mb-3 items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
                <form className="lg:pr-3">
                  <Label htmlFor="users-search" className="sr-only">
                    Search
                  </Label>
                  <div className="relative mt-1 lg:w-64 xl:w-96">
                    <TextInput
                      id="users-search"
                      name="users-search"
                      placeholder="Search for delivery"
                    />
                    <IoIosSearch
                      className="w-8 h-8 absolute top-1 right-2 hover:cursor-pointer"
                      onClick={() => {
                        console.log("Tingggg");
                      }}
                    />
                  </div>
                </form>
              </div>
              <Button
                gradientDuoTone="greenToBlue"
                onClick={() => setOpenModal(true)}
                disabled={checkActionValid(role, "goods", "create")}
              >
                {" "}
                <IoMdAddCircleOutline className="w-6 h-6" />
                New Delivery
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow">
                <AllDeliveryTable />
              </div>
            </div>
          </div>
        </div>
      </NavbarSidebarLayout>
      <Modal show={openModal} size="4xl" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Delivery Product
            </h3>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="Company" value="Company" />
              </div>

              <Select
                className="w-80"
                id="comp"
                onChange={(e) => {
                  setCompanySelected(parseInt(e.target.value));
                }}
                disabled={productsWait.length > 0 ? true : false}
              >
                <option value={0}>Select Company </option>
                {company.map((item: Company) => (
                  <option value={item.id}>{`${
                    item.name
                  } - Chiết khấu ${Math.floor(item.discount)}%`}</option>
                ))}
              </Select>
            </div>
            <div className="flex gap-5">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="id" value="Product ID" />
                </div>
                <div className="max-w-md">
                  <Select
                    id="id"
                    required
                    onChange={(e) => {
                      setIdProduct(parseInt(e.target.value));
                    }}
                    disabled={companySelected == 0 ? true : false}
                  >
                    <option value={0}>Select Product ID </option>
                    {products.map((product: Product) => (
                      <option key={product.id} value={product.id}>
                        {`${product.id} | ${product.title}`}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div>
                <div className="mb-2 block">
                  <p className="text-[10px] text-gray-900">
                    If product not exist. Create temporary product with some
                    basic infomation
                  </p>
                </div>
                <div className="max-w-md relative">
                  <Button
                    color="light"
                    disabled={companySelected == 0 ? true : false}
                  >
                    <Link
                      to="/delivery-received/create-temporary-product"
                      className={
                        idProduct != 0
                          ? "flex space-x-1 cursor-not-allowed opacity-50"
                          : "flex space-x-1"
                      }
                    >
                      <IoMdAddCircleOutline className="w-6 h-6" />
                      <p>Create Temp Product</p>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex gap-5">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="cost-price" value="Cost Price" />
                </div>
                <TextInput
                  id="cost-price"
                  type="number"
                  required
                  placeholder="Enter cost price"
                  onChange={(e) => setCostPrice(parseInt(e.target.value))}
                  className="w-80 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  disabled={idProduct == 0 ? true : false}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="quantity" value="Quantity" />
                </div>
                <TextInput
                  id="quantity"
                  type="number"
                  required
                  placeholder="quantity of product"
                  className="w-80"
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  disabled={idProduct == 0 ? true : false}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={() =>
                  dispatch(
                    addProductsWait({
                      id: idProduct,
                      price: costPrice,
                      quantity: quantity,
                    })
                  )
                }
                disabled={idProduct == 0 || costPrice == 0 || quantity == 0}
              >
                Add{" "}
              </Button>
            </div>
            <div className="bg-primary-300 border border-r-blue-50 p-3 rounded-sm">
              {productsWait.length > 0 &&
                productsWait.map((product) => {
                  return (
                    <div className="flex space-x-2">
                      <div className="flex justify-between w-[90%]">
                        <p>ID: {product.id}</p>
                        <p>Cost Price: {product.price}</p>
                        <p>Quantity: {product.quantity}</p>
                      </div>
                      <span
                        className="w-7 h-7 border-red-300 border text-center cursor-pointer"
                        onClick={() => dispatch(removeProductsWait(product.id))}
                      >
                        X
                      </span>
                    </div>
                  );
                })}
            </div>
            <div className="max-w-md">
              <p>Note</p>
              <Textarea
                id="comment"
                placeholder="Muốn note cái gì thì note. không muốn cũng phải note vào cho đẹp"
                required
                onChange={(e) => setNote(e.target.value)}
                rows={4}
              />
            </div>
            <div className="w-full flex justify-between">
              <div></div>
              <Button
                disabled={productsWait.length <= 0}
                onClick={handleAddDelivery}
              >
                Send Request
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

type Product = {
  id: number;
  title: string;
};

type Company = {
  id: number;
  name: string;
  discount: number;
  status: string;
  description: string;
};

type Received = {
  id: number;
  dateReceived: string;
  name_company: string;
  noteReceived: string;
  total_value: string;
};

const AllDeliveryTable: FC = function () {
  const [received, setReceived] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const result = await axios.get("/api/v2/received");
      setReceived(result.data);
    };
    fetch();
  }, []);
  const formatPrice: (currentPrice: number) => string = (
    currenPrice: number
  ) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    return formatter.format(currenPrice);
  };

  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell className="w-[30px]">ID</Table.HeadCell>
          <Table.HeadCell className="w-[250px]">Name Company</Table.HeadCell>
          <Table.HeadCell className="w-[250px]">Date</Table.HeadCell>
          <Table.HeadCell className="w-[150px]">Total Value</Table.HeadCell>
          <Table.HeadCell className="w-[450px] text-center">
            Note
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {received &&
            received.map((item: Received) => (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{item.id}</Table.Cell>

                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {item.name_company}
                </Table.Cell>
                <Table.Cell>
                  {new Date(item.dateReceived).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </Table.Cell>
                <Table.Cell>
                  {formatPrice(parseInt(item.total_value))}
                </Table.Cell>
                <Table.Cell>{item.noteReceived}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default DeliveryPage;
