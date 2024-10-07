/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Breadcrumb,
  Checkbox,
  Label,
  Table,
  TextInput,
  Button,
  Modal,
} from "flowbite-react";
import type { FC } from "react";
import { useState, useEffect } from "react";
import { HiHome } from "react-icons/hi";
import { IoSearchSharp } from "react-icons/io5";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import axios from "axios";

const PermissionPage: FC = function () {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const handleSearchEmployee = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      console.log(search);
    }
  };
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
              <Breadcrumb.Item href="/orders/list">Employees</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All employees
            </h1>
          </div>
          <div className="sm:flex md:justify-between">
            <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              <form className="lg:pr-3">
                <Label htmlFor="users-search" className="sr-only">
                  Search
                </Label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <TextInput
                    id="users-search"
                    name="users-search"
                    placeholder="Search for employees"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => handleSearchEmployee(e)}
                  />
                </div>
              </form>
              <div className="mt-3 flex space-x-1 pl-0 sm:mt-0 sm:pl-2">
                <a
                  href="#"
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Search</span>
                  <IoSearchSharp className="text-2xl" />
                </a>
              </div>
            </div>
            <div>
              <Button color="success" onClick={() => setOpenModal(true)}>
                Save Change
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <AllEmployeesTable />
            </div>
          </div>
        </div>
        <Modal
          show={openModal}
          size="md"
          onClose={() => setOpenModal(false)}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this product?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={() => setOpenModal(false)}>
                  {"Yes, I'm sure"}
                </Button>
                <Button color="gray" onClick={() => setOpenModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </NavbarSidebarLayout>
  );
};

const AllEmployeesTable: FC = function () {
  type PermissionItem = {
    id: number;
    name: string;
    action_code: string;
    check_action: number;
  };

  type Permission = {
    action_code: string;
    check_action: number;
  };

  type Role = {
    role_id: number;
    role_name: string;
    permissions: Permission[];
  };

  const [status, setStatus] = useState(1);
  const [allEmployee, setAllEmployee] = useState([]);
  useEffect(() => {
    const getAllUsers = async () => {
      const res = await axios.get("http://localhost:3006/api/v2/permissions");

      const rawValue = res.data.reduce((acc: Role[], cur: PermissionItem) => {
        let role = acc.find((item) => {
          return item.role_id === cur.id;
        });
        if (role) {
          role.permissions.push({
            action_code: cur.action_code,
            check_action: cur.check_action,
          });
        } else {
          acc.push({
            role_id: cur.id,
            role_name: cur.name,
            permissions: [
              { action_code: cur.action_code, check_action: cur.check_action },
            ],
          });
        }
        return acc;
      }, []);
      setAllEmployee(rawValue);
    };
    getAllUsers();
  }, []);

  interface Employee {
    id: string;
    email: string;
    name: string;
  }

  const handleChangeStatus = (us: string) => {
    const changeStatus = async (us: string) => {
      if (status === 0) {
        return;
      }
      const res = await axios.post(
        "http://localhost/WriteResfulAPIPHP/admin/permission/changeRole.php",
        {
          email: us,
          role_id: status,
        }
      );
      console.log(res.data);
    };
    changeStatus(us);
  };

  return (
    <Table
      striped
      className="min-w-full divide-y divide-gray-200 dark:divide-gray-600"
    >
      <Table.Head className="bg-gray-50 dark:bg-gray-700">
        <Table.HeadCell className="w-[250px]">
          <div>Role</div>
        </Table.HeadCell>
        <Table.HeadCell className="text-center">Permission</Table.HeadCell>
      </Table.Head>

      <Table.Body className="bg-white dark:bg-gray-800">
        {allEmployee.map((employee: Role) => (
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {employee.role_name}
            </Table.Cell>
            <Table.Cell className="font-bold">
              <div className="flex justify-evenly">
                {employee.permissions.map((permission: Permission) => (
                  <div className="flex space-x-1 items-center">
                    <p>{permission.action_code}</p>
                    <Checkbox
                      id={`${permission.action_code}`}
                      defaultChecked={
                        permission.check_action === 1 ? true : false
                      }
                    />
                  </div>
                ))}
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default PermissionPage;
