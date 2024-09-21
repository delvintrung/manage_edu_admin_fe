/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Label, Table, TextInput, Modal, Select } from "flowbite-react";
import type { FC } from "react";
import { useState, useEffect } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { IoMdAddCircleOutline, IoIosSearch } from "react-icons/io";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import axios from "axios";
import { Link } from "react-router-dom";

const DeliveryPage: FC = function () {
  const [openModal, setOpenModal] = useState(false);
  const [idProduct, setIdProduct] = useState(0);
  const [products, setProducts] = useState([]);
  const [company, setCompany] = useState([]);

  function onCloseModal() {
    setOpenModal(false);
  }

  useEffect(() => {
    const fetch = async () => {
      const allProducts = await axios.get("http://localhost:3006/api/product");
      setProducts(allProducts.data);

      const company = await axios.get("http://localhost:3006/api/company");
      setCompany(company.data);
    };

    fetch();
  }, []);

  return (
    <div>
      <NavbarSidebarLayout isFooter={false}>
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
                  <Button color="light">
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
                  type="text"
                  required
                  placeholder="Enter cost price"
                  className="w-80"
                  disabled={idProduct == 0 ? true : false}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="quantity" value="Quantity" />
                </div>
                <TextInput
                  id="quantity"
                  type="text"
                  required
                  placeholder="quantity of product"
                  className="w-80"
                  disabled={idProduct == 0 ? true : false}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="Company" value="Company" />
              </div>
              <Select
                className="w-80"
                id="comp"
                disabled={idProduct == 0 ? true : false}
              >
                <option value={0}>Select Company </option>
                {company.map((item: Company) => (
                  <option value={item.id}>{`${
                    item.name
                  } - Chiết khấu ${Math.floor(item.discount)}%`}</option>
                ))}
              </Select>
            </div>
            <div className="w-full flex justify-between">
              <div></div>
              <Button>Send Request</Button>
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

const AllDeliveryTable: FC = function () {
  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Product name</Table.HeadCell>
          <Table.HeadCell>Color</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {'Apple MacBook Pro 17"'}
            </Table.Cell>
            <Table.Cell>Sliver</Table.Cell>
            <Table.Cell>Laptop</Table.Cell>
            <Table.Cell>$2999</Table.Cell>
            <Table.Cell>
              <a
                href="#"
                className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
              >
                Edit
              </a>
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Microsoft Surface Pro
            </Table.Cell>
            <Table.Cell>White</Table.Cell>
            <Table.Cell>Laptop PC</Table.Cell>
            <Table.Cell>$1999</Table.Cell>
            <Table.Cell>
              <a
                href="#"
                className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
              >
                Edit
              </a>
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Magic Mouse 2
            </Table.Cell>
            <Table.Cell>Black</Table.Cell>
            <Table.Cell>Accessories</Table.Cell>
            <Table.Cell>$99</Table.Cell>
            <Table.Cell>
              <a
                href="#"
                className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
              >
                Edit
              </a>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
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

export default DeliveryPage;
