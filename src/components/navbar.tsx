import type { FC } from "react";
import { DarkThemeToggle, Navbar } from "flowbite-react";

const ExampleNavbar: FC = function () {
  return (
    <Navbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3 top-0">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center">
            <Navbar.Brand href="/">
              <img
                alt=""
                src="/images/vector-education-logo.avif"
                className="mx-[50%] h-20"
              />
            </Navbar.Brand>
          </div>
          <div className="flex items-center gap-3">
            <DarkThemeToggle />
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default ExampleNavbar;
