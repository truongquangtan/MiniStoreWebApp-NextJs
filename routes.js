import React from "react";

// Icon Imports
import {
  MdHome,
  MdCategory,
  MdOutlineAttachMoney,
  MdShoppingCart,
  MdViewTimeline,
  MdSell,
  MdPermIdentity,
  MdAddCard
} from "react-icons/md";

const routes = {
  manager: [
    {
      name: "Main Dashboard",
      layout: "/manager",
      path: "default",
      icon: <MdHome className="h-6 w-6" />,
      isActive: false,
    },
    {
      name: "Users",
      layout: "/manager",
      path: "users",
      icon: <MdPermIdentity className="h-6 w-6" />,
      isActive: false,
    },
    {
      name: "Products and Categories",
      layout: "/manager",
      path: "product",
      icon: <MdCategory className="h-6 w-6" />,
      isActive: false,
    },
    {
      name: "Salary",
      layout: "/manager",
      path: "salary",
      icon: <MdOutlineAttachMoney className="h-6 w-6" />,
      isActive: false,
    },
    {
      name: "Orders",
      layout: "/manager",
      path: "orders",
      icon: <MdShoppingCart className="h-6 w-6" />,
      isActive: false,
    },
    {
      name: "Worksheets",
      layout: "/manager",
      path: "worksheet",
      icon: <MdViewTimeline className="h-6 w-6" />,
      isActive: false,
    },
    {
      name: "Vouchers",
      layout: "/manager",
      path: "voucher",
      icon: <MdSell className="h-6 w-6" />,
      isActive: false,
    }
  ],
  sales: [
    {
      name: "Worksheets",
      layout: "/sales",
      path: "worksheet",
      icon: <MdViewTimeline className="h-6 w-6" />,
      isActive: false,
    },
    {
      name: "Worksheets Register",
      layout: "/sales",
      path: "worksheet-register",
      icon: <MdAddCard className="h-6 w-6" />,
      isActive: false,
    },
    {
      name: "Orders",
      layout: "/sales",
      path: "orders",
      icon: <MdShoppingCart className="h-6 w-6" />,
      isActive: false,
    },
  ],
  guard: [
    {
      name: "Worksheets",
      layout: "/guard",
      path: "worksheet",
      icon: <MdViewTimeline className="h-6 w-6" />,
      isActive: false,
    },
    {
      name: "Worksheets Register",
      layout: "/guard",
      path: "worksheet-register",
      icon: <MdAddCard className="h-6 w-6" />,
      isActive: false,
    }
  ]
}
export default routes;
