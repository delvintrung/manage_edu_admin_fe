import { Badge, Table, useTheme, Accordion } from "flowbite-react";
import { FaUsersViewfinder } from "react-icons/fa6";
import { MdAdsClick } from "react-icons/md";
import { FaCartPlus } from "react-icons/fa";
import { IoIosCash } from "react-icons/io";
import { useState, useEffect } from "react";
import axios from "axios";
import type { FC } from "react";
import Chart from "react-apexcharts";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";

const DashboardPage: FC = function () {
  return (
    <NavbarSidebarLayout>
      <div className="px-4 pt-6">
        <SalesThisWeek />
        <div className="my-6">
          <LatestTransactions />
        </div>
        <LatestCustomers />
        <div className="my-6">
          <AcquisitionOverview />
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

const SalesThisWeek: FC = function () {
  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="shrink-0">
          <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
            $45,385
          </span>
          <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">
            Sales this week
          </h3>
        </div>
        <div className="flex flex-1 items-center justify-end text-base font-bold text-green-600 dark:text-green-400">
          12.5%
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <SalesChart />
      <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
        <div className="shrink-0">
          <a
            href="#"
            className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
          >
            Sales Report
            <svg
              className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

const SalesChart: FC = function () {
  const { mode } = useTheme();
  const isDarkTheme = mode === "dark";

  const borderColor = isDarkTheme ? "#374151" : "#F3F4F6";
  const labelColor = isDarkTheme ? "#93ACAF" : "#6B7280";
  const opacityFrom = isDarkTheme ? 0 : 1;
  const opacityTo = isDarkTheme ? 0 : 1;

  function getRecentDays() {
    const today = new Date();
    const recentDays = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");

      const formattedDate = `${day} ${getMonthName(date.getMonth())}`;
      recentDays.push(formattedDate);
    }

    return recentDays;
  }

  function getMonthName(monthIndex: number) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthIndex];
  }

  const options: ApexCharts.ApexOptions = {
    stroke: {
      curve: "smooth",
    },
    chart: {
      type: "area",
      fontFamily: "Inter, sans-serif",
      foreColor: labelColor,
      toolbar: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom,
        opacityTo,
        type: "vertical",
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
      },
    },
    grid: {
      show: true,
      borderColor: borderColor,
      strokeDashArray: 1,
      padding: {
        left: 35,
        bottom: 15,
      },
    },
    markers: {
      size: 5,
      strokeColors: "#ffffff",
      hover: {
        size: undefined,
        sizeOffset: 3,
      },
    },
    xaxis: {
      categories: getRecentDays(),
      labels: {
        style: {
          colors: [labelColor],
          fontSize: "14px",
          fontWeight: 500,
        },
      },
      axisBorder: {
        color: borderColor,
      },
      axisTicks: {
        color: borderColor,
      },
      crosshairs: {
        show: true,
        position: "back",
        stroke: {
          color: borderColor,
          width: 1,
          dashArray: 10,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: [labelColor],
          fontSize: "14px",
          fontWeight: 500,
        },
        formatter: function (value) {
          return "$" + value;
        },
      },
    },
    legend: {
      fontSize: "14px",
      fontWeight: 500,
      fontFamily: "Inter, sans-serif",
      labels: {
        colors: [labelColor],
      },
      itemMargin: {
        horizontal: 10,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          xaxis: {
            labels: {
              show: false,
            },
          },
        },
      },
    ],
  };
  const series = [
    {
      name: "Doanh số",
      data: [100, 110, 120, 150, 100, 170, 70],
      color: "#1A56DB",
    },
  ];

  return <Chart height={420} options={options} series={series} type="area" />;
};

const LatestCustomers: FC = function () {
  interface info {
    success: boolean;
    total_revenue: string;
    total_orders: number;
  }
  const [selectDay, setSelectDay] = useState(1);
  const [fromDay, setFromDay] = useState("");
  const [toDay, setToDay] = useState("");
  const [report, setReport] = useState<info>({
    success: true,
    total_revenue: "0",
    total_orders: 0,
  });

  useEffect(() => {
    const handleReport = async function () {
      if (fromDay != "" && toDay != "") {
        const res = await axios.post(
          "http://localhost/WriteResfulAPIPHP/admin/order/totalDtoD.php",
          {
            startDate: fromDay,
            endDate: toDay,
          }
        );

        setReport(res.data);
      }
    };
    handleReport();
  }, [fromDay, toDay]);
  console.log(report);

  useEffect(() => {
    const getInfo = async (selectDay: number) => {
      if (selectDay == 1) {
        const res = await axios.get(
          "http://localhost/WriteResfulAPIPHP/admin/order/total1D.php"
        );
        setReport(res.data);
      } else if (selectDay == 2) {
        const res = await axios.get(
          "http://localhost/WriteResfulAPIPHP/admin/order/total3D.php"
        );
        setReport(res.data);
      } else if (selectDay == 3) {
        const res = await axios.get(
          "http://localhost/WriteResfulAPIPHP/admin/order/total7D.php"
        );
        setReport(res.data);
      } else {
        const res = await axios.get(
          "http://localhost/WriteResfulAPIPHP/admin/order/total30D.php"
        );
        setReport(res.data);
      }
    };
    getInfo(selectDay);
  }, [selectDay]);

  function convertToCurrencyFormat(amount: number) {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  return (
    <div className="mb-4 h-full rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          Thống kê chi tiết
        </h3>
        <a
          href="#"
          className="inline-flex items-center rounded-lg p-2 text-sm font-medium text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700"
        >
          View all
        </a>
      </div>
      <div className="flow-root">
        <div className="flex justify-between items-center mb-5">
          <div className="w-[200px] h-[80px] bg-red-600 text-white rounded p-4">
            <div className="flex items-center gap-2">
              <FaUsersViewfinder />
              <p className="text-sm"> Lượt khách tiếp cận</p>
            </div>
            <p className="text-center">888</p>
          </div>
          <div className="w-[200px] h-[80px] bg-yellow-600 text-white rounded p-4">
            <div className="flex items-center gap-2">
              <MdAdsClick />
              <p className="text-sm">Click xem sản phẩm</p>
            </div>
            <p className="text-center">6000</p>
          </div>
          <div className="w-[200px] h-[80px] bg-green-600 text-white rounded p-4">
            <div className="flex items-center gap-2">
              <FaCartPlus />
              <p className="text-sm">Đơn hàng mới</p>
            </div>
            <p className="text-center">{report.total_orders}</p>
          </div>
          <div className="w-[200px] h-[80px] bg-blue-600 text-white rounded p-4">
            <div className="flex items-center gap-2">
              <IoIosCash />
              <p className="text-sm">Doanh số</p>
            </div>
            <p className="text-center">
              {convertToCurrencyFormat(parseFloat(report.total_revenue))}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
        <div className="shrink-0">
          <div className="flex">
            <div className="mr-10">
              <select
                name=""
                id=""
                className="bring-0 rounded"
                onChange={(e) => {
                  setSelectDay(parseInt(e.target.value));
                }}
              >
                <option value="1" selected>
                  Hôm nay
                </option>
                <option value="2">3 ngày gần nhất</option>
                <option value="3">7 ngày gần nhất</option>
                <option value="4">30 ngày gần nhất</option>
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <label htmlFor="">Từ</label>
                <input
                  type="date"
                  name=""
                  id=""
                  className="bring-0 rounded"
                  onChange={(e) => {
                    console.log(e.target.value);
                    setFromDay(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-center gap-1">
                <label htmlFor="">Đến</label>
                <input
                  type="date"
                  name=""
                  id=""
                  className="bring-0 rounded"
                  onChange={(e) => {
                    setToDay(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AcquisitionOverview: FC = function () {
  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <h3 className="mb-6 text-xl font-bold leading-none text-gray-900 dark:text-white">
        Doanh số theo ngày
      </h3>
      <div className="flex flex-col">
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow sm:rounded-lg">
              <Table className="min-w-full table-fixed">
                <Table.Head>
                  <Table.HeadCell className="whitespace-nowrap rounded-l border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                    Top Channels
                  </Table.HeadCell>
                  <Table.HeadCell className="whitespace-nowrap border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                    Users
                  </Table.HeadCell>
                  <Table.HeadCell className="min-w-[140px] whitespace-nowrap rounded-r border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                    Acquisition
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-gray-100 dark:divide-gray-700">
                  <Table.Row className="text-gray-500 dark:text-gray-400">
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
                      Organic Search
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                      5,649
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs">
                      <div className="flex items-center">
                        <span className="mr-2 text-xs font-medium">30%</span>
                        <div className="relative w-full">
                          <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-sm bg-primary-700"
                              style={{ width: "30%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="text-gray-500 dark:text-gray-400">
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
                      Referral
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                      4,025
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs">
                      <div className="flex items-center">
                        <span className="mr-2 text-xs font-medium">24%</span>
                        <div className="relative w-full">
                          <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-sm bg-orange-300"
                              style={{ width: "24%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="text-gray-500 dark:text-gray-400">
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
                      Direct
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                      3,105
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs">
                      <div className="flex items-center">
                        <span className="mr-2 text-xs font-medium">18%</span>
                        <div className="relative w-full">
                          <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-sm bg-teal-400"
                              style={{ width: "18%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="text-gray-500 dark:text-gray-400">
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
                      Social
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                      1251
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs">
                      <div className="flex items-center">
                        <span className="mr-2 text-xs font-medium">12%</span>
                        <div className="relative w-full">
                          <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-sm bg-pink-600"
                              style={{ width: "12%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="text-gray-500 dark:text-gray-400">
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
                      Other
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                      734
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs">
                      <div className="flex items-center">
                        <span className="mr-2 text-xs font-medium">9%</span>
                        <div className="relative w-full">
                          <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-sm bg-indigo-600"
                              style={{ width: "9%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="text-gray-500 dark:text-gray-400">
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
                      Email
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                      456
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs">
                      <div className="flex items-center">
                        <span className="mr-2 text-xs font-medium">7%</span>
                        <div className="relative w-full">
                          <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-sm bg-purple-500"
                              style={{ width: "7%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
        <div className="shrink-0">
          <a
            href="#"
            className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
          >
            Acquisition Report
            <svg
              className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

const LatestTransactions: FC = function () {
  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            Đơn hàng gần đây
          </h3>
          <span className="text-base font-normal text-gray-600 dark:text-gray-400">
            Đây là những đơn hàng mới nhất
          </span>
        </div>
        <div className="shrink-0">
          <a
            href="#"
            className="rounded-lg p-2 text-sm font-medium text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700"
          >
            View all
          </a>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow sm:rounded-lg">
              <Table
                striped
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-600"
              >
                <Table.Head className="bg-gray-50 dark:bg-gray-700">
                  <Table.HeadCell className="flex justify-between">
                    <div>Mã đơn</div> <div>Tên sản phẩm</div>{" "}
                    <div>Ngày đặt</div> <div>Tổng</div>
                    <div>Trạng thái</div>
                    <div></div>
                  </Table.HeadCell>
                </Table.Head>

                <Table.Body className="bg-white dark:bg-gray-800">
                  <Accordion>
                    <Accordion.Panel>
                      <Accordion.Title>
                        <div className="flex justify-between gap-x-[130px]">
                          <div className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                            1
                          </div>
                          <div className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                            Truuện kỳ tích
                          </div>
                          <div className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                            20/05/2024
                          </div>
                          <div className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                            900000
                          </div>
                          <div className="flex whitespace-nowrap p-4">
                            <Badge color="success">Completed</Badge>
                          </div>
                        </div>
                      </Accordion.Title>

                      <Accordion.Content>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                          Flowbite is an open-source library of interactive
                          components built on top of Tailwind CSS including
                          buttons, dropdowns, modals, navbars, and more.
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          Check out this guide to learn how to&nbsp;
                          <a
                            href="https://flowbite.com/docs/getting-started/introduction/"
                            className="text-cyan-600 hover:underline dark:text-cyan-500"
                          >
                            get started&nbsp;
                          </a>
                          and start developing websites even faster with
                          components on top of Tailwind CSS.
                        </p>
                      </Accordion.Content>
                    </Accordion.Panel>
                    <Accordion.Panel>
                      <Accordion.Title>
                        <div className="flex justify-between gap-x-[130px]">
                          <div className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                            1
                          </div>
                          <div className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                            Truuện kỳ tích
                          </div>
                          <div className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                            20/05/2024
                          </div>
                          <div className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                            900000
                          </div>
                          <div className="flex whitespace-nowrap p-4">
                            <Badge color="success">Completed</Badge>
                          </div>
                        </div>
                      </Accordion.Title>

                      <Accordion.Content>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                          Flowbite is an open-source library of interactive
                          components built on top of Tailwind CSS including
                          buttons, dropdowns, modals, navbars, and more.
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          Check out this guide to learn how to&nbsp;
                          <a
                            href="https://flowbite.com/docs/getting-started/introduction/"
                            className="text-cyan-600 hover:underline dark:text-cyan-500"
                          >
                            get started&nbsp;
                          </a>
                          and start developing websites even faster with
                          components on top of Tailwind CSS.
                        </p>
                      </Accordion.Content>
                    </Accordion.Panel>
                  </Accordion>
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 sm:pt-6">
        <div className="shrink-0">
          <a
            href="#"
            className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
          >
            Transactions Report
            <svg
              className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
