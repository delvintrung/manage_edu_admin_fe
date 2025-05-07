import { Button, Label, Table, Modal, TextInput, Select } from "flowbite-react";
import type { FC } from "react";
import { IoIosSearch } from "react-icons/io";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { MdDeleteForever } from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";
import { RxUpdate } from "react-icons/rx";
import { useEffect, useState } from "react";
import axios from "../../config/axios";
import { v4 as uuidv4 } from "uuid";

interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

interface TableProps {
  users: User[];
}

const UserPage: FC = function () {
  const [users, setUsers] = useState<User[]>([]);
  const [openModal, setOpenModal] = useState<"add" | "edit" | "delete" | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await axios.get("/api/user");
        setUsers(result.data);
      } catch (error) {
        alert("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  // Handle search (client-side filtering)
  const handleSearch = async () => {
    try {
      const result = await axios.get("/api/user");
      const allUsers = result.data;
      if (!searchValue) {
        setUsers(allUsers);
        return;
      }
      const filteredUsers = allUsers.filter((user: User) =>
        user.username.toLowerCase().includes(searchValue.toLowerCase())
      );
      setUsers(filteredUsers);
      if (filteredUsers.length === 0) {
        alert("No users found");
      }
    } catch (error) {
      alert("Failed to fetch users");
    }
  };

  // Handle form submission for add/edit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const user: User = {
      id: openModal === "add" ? uuidv4() : selectedUser!.id,
      email: form["email"].value,
      username: form["username"].value,
      password: form["password"].value,
      role: "USER",
    };

    try {
      if (openModal === "add") {
        const result = await axios.post("/api/user", user);
        setUsers([...users, result.data]);
        alert("User created successfully");
      } else {
        const result = await axios.put(`/api/user/${user.id}`, user);
        setUsers(users.map((u) => (u.id === user.id ? result.data : u)));
        alert("User updated successfully");
      }
      setOpenModal(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Operation failed");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/user/${selectedUser!.id}`);
      setUsers(users.filter((u) => u.id !== selectedUser!.id));
      alert("User deleted successfully");
      setOpenModal(null);
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  return (
    <div>
      <NavbarSidebarLayout isFooter={false}>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                User Management
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
                        placeholder="Search for user by username"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                      />
                      <IoIosSearch
                        className="w-8 h-8 absolute top-1 right-2 hover:cursor-pointer"
                        onClick={handleSearch}
                      />
                    </div>
                  </div>
                  <div>
                    <Button color="gray" onClick={() => setOpenModal("add")}>
                      <IoAddCircle className="mr-3 h-4 w-4" />
                      Add User
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
                <UserTable
                  users={users}
                  setOpenModal={setOpenModal}
                  setSelectedUser={setSelectedUser}
                />
              </div>
            </div>
          </div>
        </div>
      </NavbarSidebarLayout>

      {/* Add/Edit Modal */}
      {(openModal === "add" || openModal === "edit") && (
        <Modal show={true} position="center" onClose={() => setOpenModal(null)}>
          <Modal.Header>
            {openModal === "add" ? "Add User" : "Edit User"}
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <Label htmlFor="email">Email</Label>
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={openModal === "edit" ? selectedUser?.email : ""}
                  required
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="username">Username</Label>
                <TextInput
                  id="username"
                  name="username"
                  defaultValue={
                    openModal === "edit" ? selectedUser?.username : ""
                  }
                  required
                  maxLength={20}
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="password">Password</Label>
                <TextInput
                  id="password"
                  name="password"
                  type="password"
                  defaultValue={
                    openModal === "edit" ? selectedUser?.password : ""
                  }
                  required
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="role">Role</Label>
                <Select
                  id="role"
                  name="role"
                  defaultValue={
                    openModal === "edit" ? selectedUser?.role : "USER"
                  }
                  required
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option disabled value="GIANGVIEN">
                    Giảng viên
                  </option>
                </Select>
              </div>
              <div className="flex">
                <Button type="submit">Submit</Button>
                <Button
                  color="gray"
                  onClick={() => setOpenModal(null)}
                  className="ml-2"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}

      {/* Delete Modal */}
      {openModal === "delete" && (
        <Modal show={true} position="center" onClose={() => setOpenModal(null)}>
          <Modal.Header>Delete User</Modal.Header>
          <Modal.Body>
            <p className="text-lg">
              Are you sure you want to delete this user?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleDelete}>Confirm</Button>
            <Button color="gray" onClick={() => setOpenModal(null)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

const UserTable: FC<
  TableProps & {
    setOpenModal: (modal: "edit" | "delete" | null) => void;
    setSelectedUser: (user: User) => void;
  }
> = function ({ users, setOpenModal, setSelectedUser }) {
  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell>ID</Table.HeadCell>
        <Table.HeadCell>Email</Table.HeadCell>
        <Table.HeadCell>Username</Table.HeadCell>
        <Table.HeadCell>Role</Table.HeadCell>
        <Table.HeadCell>Actions</Table.HeadCell>
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
            <Table.Cell>{user.role}</Table.Cell>
            <Table.Cell>
              <Button.Group>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedUser(user);
                    setOpenModal("edit");
                  }}
                >
                  <RxUpdate className="mr-3 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setSelectedUser(user);
                    setOpenModal("delete");
                  }}
                >
                  <MdDeleteForever className="mr-3 h-4 w-4" />
                  Delete
                </Button>
              </Button.Group>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default UserPage;
