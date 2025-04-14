import { Footer } from "flowbite-react";
import type { FC, PropsWithChildren } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { MdFacebook } from "react-icons/md";
import { FaDribbble, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";
import Notify from "../components/notification";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import checkActionValid from "../function/checkActionValid";

interface NavbarSidebarLayoutProps {
  isFooter?: boolean;
}

const NavbarSidebarLayout: FC<PropsWithChildren<NavbarSidebarLayoutProps>> =
  function ({ children, isFooter = true }) {
    const role = useSelector(
      (state: RootState) => state.role.currentAction.list
    );
    return (
      <div className="relative">
        <div className=" sticky top-0">
          <Navbar />
        </div>
        <div className="flex items-start ">
          <Sidebar />
          <MainContent isFooter={isFooter}>{children}</MainContent>
        </div>
        {!checkActionValid(role, "orders", "view") ? (
          <div className="fixed top-[20px] right-[80px]">
            <Notify />
          </div>
        ) : null}
      </div>
    );
  };

const MainContent: FC<PropsWithChildren<NavbarSidebarLayoutProps>> = function ({
  children,
  isFooter,
}) {
  return (
    <main className="relative h-full w-full overflow-y-auto bg-gray-50 dark:bg-gray-900 lg:ml-64">
      {children}
      {isFooter && (
        <div className="mx-4 mt-4">
          <MainContentFooter />
        </div>
      )}
    </main>
  );
};

const MainContentFooter: FC = function () {
  return (
    <>
      <Footer container>
        <p>Project2</p>
      </Footer>
    </>
  );
};

export default NavbarSidebarLayout;
