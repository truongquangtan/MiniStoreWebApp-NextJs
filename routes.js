import React from "react";

// Icon Imports
import {
  MdHome,
  MdCategory,
  MdOutlineAttachMoney,
  MdShoppingCart,
  MdViewTimeline,
  MdSell,
  MdPermIdentity
} from "react-icons/md";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
  },
  {
    name: "Users",
    layout: "/admin",
    path: "users",
    icon: <MdPermIdentity className="h-6 w-6" />,
  },
  {
    name: "Products and Categories",
    layout: "/admin",
    path: "product",
    icon: <MdCategory className="h-6 w-6" />,
  },
  {
    name: "Salary",
    layout: "/admin",
    path: "salary",
    icon: <MdOutlineAttachMoney className="h-6 w-6" />,
  },
  {
    name: "Orders",
    layout: "/admin",
    path: "orders",
    icon: <MdShoppingCart className="h-6 w-6" />,
  },
  {
    name: "Worksheets",
    layout: "/admin",
    path: "worksheet",
    icon: <MdViewTimeline className="h-6 w-6" />,
  },
  {
    name: "Vouchers",
    layout: "/admin",
    path: "voucher",
    icon: <MdSell className="h-6 w-6" />,
  }
];
export default routes;
