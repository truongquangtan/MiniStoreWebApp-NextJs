/* eslint-disable */
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import DashIcon from "components/icons/DashIcon";
// chakra imports

export function SidebarLinks(props) {
  // Chakra color mode
  const router = useRouter();

  const { routes } = props;
  const [routesValue, setRoutesValue] = useState([])

  useEffect(() => {
    setRoutesValue(routes)
    const path = router.pathname
    const newValue = routes.map(v => {
      const fullPath = `${v.layout}/${v.path}`
      if(fullPath === path){
        v.isActive = true
      } else {
        v.isActive = false
      }
      return v
    })
    setRoutesValue([... newValue])
  }, [routes, router.pathname])

  // verifies if routeName is the one active (in browser input)
  const activeRoute = useCallback((routeName) => {    
    return router.pathname.includes(routeName);
  }, []);

  const createLinks = (routes) => {
    return routesValue.map((route, index) => {
      return (
        <Link key={route.path} href={route.layout + "/" + route.path}>
          <div className="relative mb-3 flex hover:cursor-pointer">
            <li
              className="my-[3px] flex cursor-pointer items-center px-8"
              key={route.path}
            >
              <span
                className={`${route.isActive === true
                    ? "font-bold text-brand-500 dark:text-white"
                    : "font-medium text-gray-600"
                  }`}
              >
                {route.icon ? route.icon : <DashIcon />}{" "}
              </span>
              <p
                className={`leading-1 ml-4 flex ${route.isActive === true
                    ? "font-bold text-navy-700 dark:text-white"
                    : "font-medium text-gray-600"
                  }`}
              >
                {route.name}
              </p>
            </li>
            {route.isActive ? (
              <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
            ) : null}
          </div>
        </Link>
      );
    }
    );
  };
  // BRAND
  return createLinks(routes);
}

export default SidebarLinks;
