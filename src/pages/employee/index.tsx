/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Breadcrumb,
  Button,
  Label,
  Modal,
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
  HiOutlineExclamationCircle,
  HiOutlinePencilAlt,
  HiPlus,
  HiTrash,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

interface Employee {
  id: number;
  role_name: string;
  address: string;
  fullName: string;
  phone_number: string;
  email: string;
  status: number;
}

type Role = {
  id: number;
  name: string;
};

type VoidFunction = () => void;

const EmployeeListPage: FC = function () {
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
              <Breadcrumb.Item href="/users/list">Users</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All users
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
                    placeholder="Search for users"
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
            <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
              <AddEmployeeModal />
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

const AddEmployeeModal: FC = function () {
  const Schema = Yup.object().shape({
    fullname: Yup.string()
      .trim()
      .min(2, "Quá ngắn!")
      .max(70, "Quá dài!")
      .required("Không được bỏ trống"),
    email: Yup.string()
      .trim()
      .email("Email không hợp lệ")
      .required("Email không được bỏ trống"),
    password: Yup.string().required("Password không được bỏ trống"),
    phone_number: Yup.string()
      .trim()
      .required("Số điện thoại không được bỏ trống"),
    address: Yup.string().required("Địa chỉ không được bỏ trống"),
  });
  const [isOpen, setOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [roleValue, setRoleValue] = useState("");
  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("http://localhost:3006/api/v2/role");
      if (res) {
        setRoles(res.data);
      } else {
        console.log("co loi khi dung useEffect get role");
      }
    };
    fetch();
  }, []);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Add Employee
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add new employee</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Formik
              initialValues={{
                fullname: "",
                email: "",
                password: "",
                phone_number: "",
                address: "",
              }}
              validationSchema={Schema}
              onSubmit={(values) => {
                axios
                  .post("http://localhost:3006/api/v2/employee", {
                    value: { ...values, role: roleValue },
                  })
                  .then(() => {
                    console.log("OK");
                  })
                  .catch((error) => {
                    console.error(error);
                  })
                  .finally(() => {
                    setOpen(false);
                  });
              }}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="flex space-x-5 mb-5">
                    <div>
                      <Label htmlFor="fullname">Full Name</Label>
                      <Field
                        name="fullname"
                        placeholder="..."
                        className="pr-2"
                        type="text"
                      />
                      {errors.fullname && touched.fullname ? (
                        <div className="text-red-400 text-sm">
                          {errors.fullname}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Field name="email" type="text" />
                      {errors.email && touched.email ? (
                        <div className="text-red-400 text-sm">
                          {errors.email}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex space-x-5 mb-5">
                    <div>
                      <Label htmlFor="phone_number">Phone</Label>
                      <Field name="phone_number" type="text" />
                      {errors.phone_number && touched.phone_number ? (
                        <div className="text-red-400 text-sm">
                          {errors.phone_number}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Field name="address" type="text" />
                      {errors.address && touched.address ? (
                        <div className="text-red-400 text-sm">
                          {errors.address}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex space-x-3 mb-5">
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <div className="mt-1">
                        <select
                          name="role"
                          id="role"
                          className="w-[230px]"
                          onChange={(e) => {
                            setRoleValue(e.target.value);
                          }}
                        >
                          {roles.map((role: Role) => (
                            <option value={role.id}>{role.name}</option>
                          ))}
                        </select>
                        <div className="text-sm text-red-400">
                          ban khong du quyen de
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Field name="password" type="text" />
                      {errors.password && touched.password ? (
                        <div className="text-red-400 text-sm">
                          {errors.password}
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                  <Button type="submit" color="primary">
                    Add employee
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

const AllUsersTable: FC = function () {
  const [allUsers, setAllUsers] = useState([]);
  const [productIdSelected, setProductIdSelected] = useState<number | null>(
    null
  );
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const openEditModal = (id: number) => {
    setProductIdSelected(id);
    setIsOpenEditModal(true);
  };

  const closeEditModal = () => {
    setProductIdSelected(null);
    setIsOpenEditModal(false);
  };
  useEffect(() => {
    const getAllUsers = async () => {
      const res = await axios.get("http://localhost:3006/api/v2/employee");
      setAllUsers(res.data);
    };
    getAllUsers();
  }, []);

  return (
    <div>
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <Table.Head className="bg-gray-100 dark:bg-gray-700">
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Role</Table.HeadCell>
          <Table.HeadCell>Phone</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {allUsers.map((employee: Employee) => (
            <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src="/images/users/neil-sims.png"
                  alt="Neil Sims avatar"
                />

                <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  <div className="text-base font-semibold text-gray-900 dark:text-white max-w-[200px]">
                    {employee.fullName}
                  </div>
                  <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {employee.email}
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                {employee.role_name}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                {employee.phone_number}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
                {employee.status == 1 ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
                    Active
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="mr-2 h-2.5 w-2.5 rounded-full bg-red-500"></div>{" "}
                    Offline
                  </div>
                )}
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-x-3 whitespace-nowrap">
                  <Button
                    onClick={() => {
                      openEditModal(employee.id);
                    }}
                  >
                    Edit
                  </Button>
                  <Button>Delete</Button>
                  <DeleteUserModal id={employee.id} />
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {isOpenEditModal && (
        <EditUserModal productId={productIdSelected} onClose={closeEditModal} />
      )}
    </div>
  );
};

const EditUserModal: FC<{ productId: number | null; onClose: VoidFunction }> =
  function (props): JSX.Element {
    const [isOpen, setOpen] = useState(true);
    const [initialValues, setInitialValues] = useState({
      fullname: "",
      email: "",
      password: "",
      phone_number: "",
      address: "",
      roleId: "",
    });
    const [infoRole, setInfoRole] = useState(0);
    const [roles, setRoles] = useState([]);
    const [roleValue, setRoleValue] = useState("");
    const Schema = Yup.object().shape({
      fullname: Yup.string()
        .trim()
        .min(2, "Quá ngắn!")
        .max(70, "Quá dài!")
        .required("Không được bỏ trống"),
      email: Yup.string()
        .trim()
        .email("Email không hợp lệ")
        .required("Email không được bỏ trống"),
      password: Yup.string().required("Password không được bỏ trống"),
      phone_number: Yup.string()
        .trim()
        .required("Số điện thoại không được bỏ trống"),
      address: Yup.string().required("Địa chỉ không được bỏ trống"),
    });

    useEffect(() => {
      const fetch = async () => {
        const res = await axios.get(
          `http://localhost:3006/api/v2/employee-current?id=${props.productId}`
        );
        const role = await axios.get("http://localhost:3006/api/v2/role");
        if (res.data) {
          setInitialValues({
            fullname: res.data[0].fullname,
            email: res.data[0].email,
            password: res.data[0].password,
            phone_number: res.data[0].phone_number,
            address: res.data[0].address,
            roleId: res.data[0].role_id,
          });
          setRoles(role.data);
        }
      };
      if (props.productId) {
        fetch();
      }
    }, [props.productId]);

    return (
      <>
        <Modal onClose={props.onClose} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Edit employee</strong>
          </Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Formik
                enableReinitiallize
                initialValues={initialValues}
                validationSchema={Schema}
                onSubmit={(values) => {
                  axios
                    .put("http://localhost:3006/api/v2/employee", {
                      values,
                    })
                    .then(() => {
                      console.log("OK");
                    })
                    .catch((error) => {
                      console.error(error);
                    })
                    .finally(() => {
                      setOpen(false);
                    });
                }}
              >
                {({ errors, touched }) => (
                  <Form>
                    <div className="flex space-x-5 mb-5">
                      <div>
                        <Label htmlFor="fullname">Full Name</Label>
                        <Field
                          name="fullname"
                          placeholder=""
                          className="pr-2"
                          type="text"
                          value={initialValues.fullname}
                        />
                        {errors.fullname && touched.fullname ? (
                          <div className="text-red-400 text-sm">
                            {errors.fullname}
                          </div>
                        ) : null}
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Field
                          name="email"
                          type="text"
                          value={initialValues.email}
                        />
                        {errors.email && touched.email ? (
                          <div className="text-red-400 text-sm">
                            {errors.email}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex space-x-5 mb-5">
                      <div>
                        <Label htmlFor="phone_number">Phone</Label>
                        <Field
                          name="phone_number"
                          type="number"
                          value={initialValues.phone_number}
                        />
                        {errors.phone_number && touched.phone_number ? (
                          <div className="text-red-400 text-sm">
                            {errors.phone_number}
                          </div>
                        ) : null}
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Field
                          name="address"
                          type="text"
                          value={initialValues.address}
                        />
                        {errors.address && touched.address ? (
                          <div className="text-red-400 text-sm">
                            {errors.address}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex space-x-3 mb-5">
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <div className="mt-1">
                          <select
                            name="role"
                            id="role"
                            className="w-[230px]"
                            onChange={(e) => {
                              setRoleValue(e.target.value);
                            }}
                          >
                            {roles.map((role: Role) => (
                              <option
                                value={role.id}
                                selected={role.id == infoRole ? true : false}
                              >
                                {role.name}
                              </option>
                            ))}
                          </select>
                          <div className="text-sm text-red-400">
                            ban khong du quyen de
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Field
                          name="password"
                          type="text"
                          value={initialValues.password}
                        />
                        {errors.password && touched.password ? (
                          <div className="text-red-400 text-sm">
                            {errors.password}
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                    <Button type="submit" color="primary">
                      Add employee
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  };

const DeleteUserModal: FC<{
  id: number;
}> = function (props): JSX.Element {
  const [isOpen, setOpen] = useState(false);
  const handleDeleteUser = (userId: number) => {
    const sendRequest = async () => {
      const res = await axios.put(
        `http://localhost:3006/api/v2/employee?id=${userId}`
      );
      console.log(res.data);
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

export default EmployeeListPage;
