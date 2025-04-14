/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Label, Table, Modal, TextInput } from "flowbite-react";
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
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { showToast } from "../../Slice/toast";
import { FaDropbox } from "react-icons/fa";
import ToastComponent from "../../components/toast";
import { convertDate } from "../../function/convertDate";
import { formatPrice } from "../../function/formatPrice";
import { reloadSide } from "../../function/reloadSide";
import Select from "react-select";

interface User {
  id?: number;
  email: string;
  username: string;
  password: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TableProps {
  users: User[];
}

const DiscountPage: FC = function () {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await axios.get("/api/users");
        if (result) {
          setUsers(result.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);
  const [openModal, setOpenModal] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const dispatch = useDispatch();
  const initialValues = {
    coupon_code: "",
    discount_value: 0,
    value_apply: 10000,
    max_apply: 200000,
    expiration_date: "",
  };

  const handleSearch = async () => {
    if (searchValue === "") {
      const result = await axios.get("/api/v2/discount");
      if (result) {
        setUsers(result.data.data);
      }
      dispatch(
        showToast({ type: "error", message: "Vui lòng thêm giá trị tìm kiếm" })
      );
    } else {
      axios
        .get(`/api/v2/discount-search?search=${searchValue}`)
        .then((res) => {
          if (res.data.code) {
            setUsers(res.data.data);
          } else {
            dispatch(showToast({ type: "error", message: res.data.message }));
          }
        })
        .catch((err) => {
          dispatch(
            showToast({ type: "error", message: "Something went wrong" })
          );
        })
        .finally(() => {
          setSearchValue("");
        });
    }
  };

  const validateSchema = Yup.object({
    username: Yup.string()
      .max(20, "Mã giảm giá không được quá 20 ký tự")
      .required("Phải điền mã giảm giá"),
    email: Yup.string().email().required("Email không hợp lệ"),

    password: Yup.string().required("Phải điền mật khẩu"),
    role: Yup.string()
      .required("Phải điền giá trị áp dụng tối thiểu")
      .oneOf(["Admin", "User"])
      .label("Selected Country"),
  });

  const role_options = [
    { label: "user", value: "USER" },
    { label: "Admin", value: "ADMIN" },
  ];

  return (
    <div>
      <NavbarSidebarLayout isFooter={false}>
        <ToastComponent />
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Trang nguoi dung
              </h1>
            </div>
            <div className="flex">
              <div className="mb-3 dark:divide-gray-700 sm:mb-0 flex sm:divide-x w-full sm:divide-gray-100">
                <div className="flex items-center justify-between w-full">
                  <div className="lg:pr-3">
                    <Label htmlFor="users-search" className="sr-only">
                      Search
                    </Label>
                    <div className="relative mt-1 lg:w-64 xl:w-96">
                      <TextInput
                        id="users-search"
                        name="users-search"
                        placeholder="Search for discount"
                        onChange={(e) => setSearchValue(e.target.value)}
                      />
                      <IoIosSearch
                        className="w-8 h-8 absolute top-1 right-2 hover:cursor-pointer"
                        onClick={handleSearch}
                      />
                    </div>
                  </div>
                  <div>
                    <Button
                      color="gray"
                      onClick={() => {
                        setOpenModal(true);
                      }}
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
                <AllCouponTable users={users} />
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
        <Modal.Header>Them nguoi dung</Modal.Header>
        <Modal.Body className="w-[900px]">
          <Formik
            initialValues={initialValues}
            validationSchema={validateSchema}
            onSubmit={(values, actions) => {
              axios
                .post("/api/users", values)
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
              <div className="mb-5">
                <div className="flex items-center">
                  <label htmlFor="coupon_code">Email: </label>
                  <Field
                    id="email"
                    name="email"
                    placeholder="Code"
                    className="ml-3"
                  />
                </div>

                <ErrorMessage
                  name="coupon_code"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div className="mb-1r mb-5">
                <div className="flex items-center">
                  <label htmlFor="username">username:</label>
                  <Field
                    id="username"
                    name="username"
                    placeholder="discount"
                    className="ml-3"
                  />
                </div>

                <ErrorMessage
                  name="username"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div className="mb-1r mb-5">
                <div className="flex items-center">
                  <label htmlFor="password">Password:</label>
                  <Field
                    id="password"
                    name="password"
                    placeholder="Pass"
                    className="ml-3"
                  />
                </div>

                <ErrorMessage
                  name="password"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div className="mb-1r mb-5">
                <div className="flex items-center">
                  <label htmlFor="max_apply">Role:</label>
                  <Select options={role_options} className="" name="role" />
                </div>

                <ErrorMessage
                  name="max_apply"
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

const AllCouponTable = function ({ users }: TableProps): JSX.Element {
  const [selectDelete, setSelectDelete] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();

  return (
    <>
      <div className="overflow-x-auto">
        <ToastComponent />
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Password</Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {users.map((user) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={user.id}
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {user.id}
                </Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.password}</Table.Cell>
                <Table.Cell>
                  <Button.Group>
                    <EditModal user={user} />
                    <Button
                      color="gray"
                      onClick={() => {
                        // setSelectDelete(user.id);
                        setOpenModal(true);
                      }}
                    >
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
      <Modal
        show={openModal}
        position="center"
        onClose={() => {
          setSelectDelete(null);
          setOpenModal(false);
        }}
      >
        <Modal.Header>Delete Coupon</Modal.Header>
        <Modal.Body className="w-[900px]">
          <ToastComponent />
          <p className="text-lg "> Do you want to delete this?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              axios
                .put(`/api/v2/discount/delete`, {
                  discount_id: selectDelete,
                })
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
                .catch((err) => {
                  dispatch(
                    showToast({
                      type: "error",
                      message: "Something went wrong",
                    })
                  );
                })
                .finally(() => {
                  setOpenModal(false);
                  reloadSide();
                });
            }}
          >
            Confirm
          </Button>
          <Button
            color="gray"
            onClick={() => {
              setSelectDelete(null);
              setOpenModal(false);
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const EditModal: FC<{ user: User }> = function (props): JSX.Element {
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const initialValues = {
    coupon_code: "",
    discount_value: 0,
    value_apply: 10000,
    max_apply: 200000,
    expiration_date: "",
  };

  const validateSchema = Yup.object({
    coupon_code: Yup.string()
      .max(20, "Mã giảm giá không được quá 20 ký tự")
      .required("Phải điền mã giảm giá"),
    discount_value: Yup.number()
      .max(100, "100% là giá trị tối đa")
      .required("Phải điền chiết khấu nhận được"),
    value_apply: Yup.number()
      .min(10000, "Giá trị áp dụng phải lớn hơn hoặc bằng 10000")
      .required("Phải điền giá trị áp dụng cho mã giảm giá")
      .test(
        "is-less-than-max-apply",
        "Giá trị áp dụng phải nhỏ hơn giá trị tối đa",
        function (value) {
          return value < this.parent.max_apply;
        }
      ),
    max_apply: Yup.number()
      .min(50000, "Giá trị áp dụng tối đa phải lớn hơn hoặc bằng 50000")
      .required("Phải điền giá trị áp dụng tối thiểu"),
    expiration_date: Yup.date().required("Phải chọn ngày hết hạn"),
  });
  return (
    <>
      <Button onClick={() => setOpenModal(true)} color="gray">
        <RxUpdate className="mr-3 h-4 w-4" />
        Update
      </Button>
      <Modal
        show={openModal}
        position="center"
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>Edit Coupon</Modal.Header>
        <Modal.Body className="w-[900px]">
          <ToastComponent />
          <Formik
            initialValues={initialValues}
            validationSchema={validateSchema}
            onSubmit={(values, actions) => {
              axios
                .put("/api/v2/discount", {
                  ...values,
                })
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
              <div className="mb-5">
                <div className="flex items-center">
                  <label htmlFor="coupon_code">Discount Code: </label>
                  <Field
                    id="coupon_code"
                    name="coupon_code"
                    placeholder="Code"
                    className="ml-3"
                  />
                </div>

                <ErrorMessage
                  name="coupon_code"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div className="mb-1r mb-5">
                <div className="flex items-center">
                  <label htmlFor="discount_value">Discount (%):</label>
                  <Field
                    id="discount_value"
                    name="discount_value"
                    placeholder="discount"
                    className="ml-3"
                  />
                </div>

                <ErrorMessage
                  name="discount_value"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div className="mb-1r mb-5">
                <div className="flex items-center">
                  <label htmlFor="value_apply">Value Apply:</label>
                  <Field
                    id="value_apply"
                    name="value_apply"
                    placeholder="Value Apply"
                    className="ml-3"
                  />
                </div>

                <ErrorMessage
                  name="value_apply"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div className="mb-1r mb-5">
                <div className="flex items-center">
                  <label htmlFor="max_apply">Max Value Apply:</label>
                  <Field
                    id="max_apply"
                    name="max_apply"
                    placeholder="Max Value Apply"
                    className="ml-3"
                  />
                </div>

                <ErrorMessage
                  name="max_apply"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div className="mb-1r mb-5">
                <div className="flex items-center">
                  <label htmlFor="expiration_date">Expiration Date:</label>

                  <Field
                    id="expiration_date"
                    name="expiration_date"
                    type="date"
                    className="ml-3"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <ErrorMessage
                  name="expiration_date"
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
    </>
  );
};

export default DiscountPage;
