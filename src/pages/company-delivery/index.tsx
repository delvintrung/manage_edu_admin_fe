/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Label, Table, Modal, TextInput, Select } from "flowbite-react";
import type { FC } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";

import { MdDeleteForever } from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";
import { RxUpdate } from "react-icons/rx";
import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

type Values = {
  name: string;
  discount: number;
  infomation: string;
};
const CompanyDeliveryPage: FC = function () {
  const [openModal, setOpenModal] = useState(false);
  const initialValues: Values = { name: "", discount: 0, infomation: "" };

  const validateSchema = Yup.object({
    name: Yup.string()
      .max(255, "Must be 255 characters or less")
      .required("Tên nhà cung cấp không thể bỏ trống"),
    discount: Yup.number().required("Phải điền chiết khấu nhận được"),
    infomation: Yup.string().required(
      "Thêm một tí thông tin gì đó cho nhà cung cấp này"
    ),
  });

  return (
    <div>
      <NavbarSidebarLayout isFooter={false}>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Suppier Management
              </h1>
            </div>
            <div className="sm:flex sm:justify-between">
              <div className="hidden mb-3 items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100 justify-between">
                <div className="flex space-x-[300px]">
                  <div className="flex space-x-5">
                    <div className="max-w-md flex items-center space-x-2">
                      <div className="mb-2 block">
                        <Label htmlFor="countries" value="Status:" />
                      </div>
                      <Select id="countries" required>
                        <option>All</option>
                        <option>还有联系</option>
                        <option>Stopped</option>
                      </Select>
                    </div>
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
                  <div className="">
                    <Button.Group>
                      <Button
                        color="gray"
                        onClick={() => {
                          setOpenModal(true);
                        }}
                      >
                        <IoAddCircle className="mr-3 h-4 w-4" />
                        Add
                      </Button>
                      <Button color="gray">
                        <RxUpdate className="mr-3 h-4 w-4" />
                        Update
                      </Button>
                      <Button color="gray">
                        <MdDeleteForever className="mr-3 h-4 w-4" />
                        Remove
                      </Button>
                    </Button.Group>
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
                <AllDeliveryTable />
              </div>
            </div>
          </div>
        </div>
      </NavbarSidebarLayout>
      <Modal
        show={openModal}
        position="center"
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>Add Supplier</Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validateSchema}
            onSubmit={(values, actions) => {
              alert(JSON.stringify(values, null, 2));
              console.log(values);
              actions.setSubmitting(false);
            }}
          >
            <Form>
              <div className="mb-5 flex items-center">
                <label htmlFor="name">Name: </label>
                <Field
                  id="name"
                  name="name"
                  placeholder="Name"
                  className="ml-3"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div className="mb-10 flex items-center">
                <label htmlFor="discount">Discount (%):</label>
                <Field
                  id="discount"
                  name="discount"
                  placeholder="discount"
                  className="ml-3"
                />
                <ErrorMessage
                  name="discount"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div className="mb-10 flex ">
                <label htmlFor="infomation">Infomation</label>
                <Field
                  as="textarea"
                  id="infomation"
                  name="infomation"
                  placeholder="infomation"
                  className="ml-3 w-[300px]"
                />
                <ErrorMessage
                  name="infomation"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div>
                <Button onClick={() => setOpenModal(false)} type="submit">
                  Submit
                </Button>
                <Button color="gray" onClick={() => setOpenModal(false)}>
                  Decline
                </Button>
              </div>
            </Form>
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

type Suppier = {
  name: string;
  discount: number;
  description: string;
  status: string;
};

const AllDeliveryTable: FC = function () {
  const [suppliers, setSuppliers] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await axios.get("http://localhost:3006/api/v2/company");
        if (result) {
          setSuppliers(result.data);
        }
      } catch (error) {}
    };
    fetch();
  }, []);
  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Name Supplier</Table.HeadCell>
          <Table.HeadCell>Discount</Table.HeadCell>
          <Table.HeadCell>Infomation</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {suppliers.map((suppier: Suppier) => (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {suppier.name}
              </Table.Cell>
              <Table.Cell>{suppier.discount}</Table.Cell>
              <Table.Cell>{suppier.description}</Table.Cell>
              <Table.Cell>{suppier.status}</Table.Cell>
            </Table.Row>
          ))}
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

export default CompanyDeliveryPage;
