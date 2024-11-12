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
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import checkActionValid from "../../function/checkActionValid";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { showToast } from "../../Slice/toast";
import { FaDropbox } from "react-icons/fa";
import ToastComponent from "../../components/toast";

type Values = {
  name: string;
  discount: number;
  infomation: string;
};
const DiscountPage: FC = function () {
  const [openModal, setOpenModal] = useState(false);
  const role = useSelector((state: RootState) => state.role.currentAction.list);
  const dispatch = useDispatch();
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
        <ToastComponent />
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Suppier Management
              </h1>
            </div>
            <div className="sm:flex sm:justify-between">
              <div className="hidden mb-3 items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100 justify-between">
                <div className="flex space-x-[560px]">
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
                    <Button
                      color="gray"
                      onClick={() => {
                        setOpenModal(true);
                      }}
                      disabled={checkActionValid(role, "company", "create")}
                    >
                      <IoAddCircle className="mr-3 h-4 w-4" />
                      Add
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
                <AllCouponTable />
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
        <Modal.Header>Add Coupon</Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validateSchema}
            onSubmit={(values, actions) => {
              axios
                .post("/api/v2/discount", values)
                .then((res) => {
                  if (res.data.code) {
                    dispatch(
                      showToast({ type: "success", message: res.data.message })
                    );
                  } else {
                    dispatch(
                      showToast({ type: "error", message: res.data.message })
                    );
                  }
                })
                .finally(() => {
                  actions.setSubmitting(false);
                  setOpenModal(false);
                });
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
              <div className="flex">
                <Button type="submit">Submit</Button>
              </div>
            </Form>
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

type Discount = {
  id: number;
  coupon_code: string;
  discount_value: number;
  expiration_date: string;
  value_apply: string;
};

const AllCouponTable: FC = function () {
  const [discounts, setDiscounts] = useState([]);
  const role = useSelector((state: RootState) => state.role.currentAction.list);
  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await axios.get("/api/v2/discount");
        if (result) {
          setDiscounts(result.data.data);
        }
      } catch (error) {}
    };
    fetch();
  }, []);
  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Code</Table.HeadCell>
          <Table.HeadCell>Discount Value</Table.HeadCell>
          <Table.HeadCell>Value Apply</Table.HeadCell>
          <Table.HeadCell>Expiry Date</Table.HeadCell>
          <Table.HeadCell>Drop</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {discounts.map((discount: Discount) => (
            <Table.Row
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
              key={discount.id}
            >
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {discount.coupon_code}
              </Table.Cell>
              <Table.Cell>{discount.discount_value}</Table.Cell>
              <Table.Cell>{discount.value_apply}</Table.Cell>
              <Table.Cell>{discount.expiration_date}</Table.Cell>
              <Table.Cell>
                {
                  <Button color="gray">
                    <FaDropbox className="mr-3 h-4 w-4" />
                    Give Discount
                  </Button>
                }
              </Table.Cell>
              <Table.Cell>
                <Button.Group>
                  <Button
                    color="gray"
                    disabled={checkActionValid(role, "company", "update")}
                  >
                    <RxUpdate className="mr-3 h-4 w-4" />
                    Update
                  </Button>
                  <Button color="gray">
                    <MdDeleteForever className="mr-3 h-4 w-4" />
                    Remove
                  </Button>
                </Button.Group>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

const DropBox: FC = function () {
  const [openModal, setOpenModal] = useState(true);
  return (
    <div>
      <Button onClick={() => setOpenModal(true)}>Toggle modal</Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Terms of Service</Modal.Header>
        <Modal.Body>
          <div className="space-y-6"></div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>I accept</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DiscountPage;
