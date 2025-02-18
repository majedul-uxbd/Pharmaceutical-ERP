"use client";

import {
  BriefcaseBusiness,
  LayoutDashboard,
  MenuIcon,
  Presentation,
  Speech,
  Users2Icon,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CSSObject, Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import { SidebarFooter } from "../ui/sidebar";
import { NavUser } from "./nav-user";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarPageProps {
  session: any;
}

const SidebarPage = ({ session }: SidebarPageProps) => {
  const [collapsed, setCollapsed] = useState<boolean | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname(); // Get the current path

  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth <= 780;
      setIsMobile(isSmallScreen);

      if (isSmallScreen) {
        setCollapsed(true); // Always collapse on mobile
      } else {
        const savedState = localStorage.getItem("sidebarCollapsed");
        setCollapsed(savedState === "true");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) return;

    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  if (collapsed === null) return null;

  const headerHeight = "57px";
  const footerHeight = "57px";
  const sidebarWidth = collapsed ? "80px" : "240px";

  const sidebarStyles: CSSObject = {
    backgroundColor: "hsl(var(--background))",
    borderRight: "1px solid hsl(var(--border))",
    transition: "all 0.3s ease-in-out",
    boxShadow: "none",
    position: "fixed",
    top: headerHeight,
    bottom: footerHeight,
    width: sidebarWidth,
    height: `calc(100% - ${headerHeight})`,
    "&:hover": {
      backgroundColor: "hsl(var(--background))",
    },
  };

  const containerStyles: React.CSSProperties = {
    marginLeft: sidebarWidth,
    transition: "margin-left 0.3s ease-in-out",
  };

  const isActiveRoute = (route: string) => pathname === route; // Check if route is active

  return (
    <div className="z-50">
      <Sidebar
        backgroundColor="bg-background"
        collapsed={collapsed}
        toggled={!collapsed}
        rootStyles={sidebarStyles}
      >
        <div className="flex flex-col h-full justify-around">
          <Menu className="h-full">
            <MenuItem onClick={toggleSidebar} className="hidden md:block">
              <MenuIcon className="ml-2 size-6" />
            </MenuItem>

            {["system_admin", "exhibitor_admin", "exhibitor"].includes(session?.role) && (
              <MenuItem
                component={<Link href="/dashboard" />}
                className={cn(isActiveRoute("/dashboard") && "bg-slate-100")}
                icon={
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <LayoutDashboard className="size-5" />
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        align="center"
                        className="ml-8 text-black bg-white border p-2"
                      >
                        Dashboard
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                }
              >
                Dashboard
              </MenuItem>
            )}

            {["system_admin", "exhibitor_admin", "exhibitor", "visitor"].includes(session?.role) && (
              <MenuItem
                component={<Link href="/exhibition" />}
                className={cn(isActiveRoute("/exhibition") && "bg-slate-100")}
                icon={
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Presentation className="size-5" />
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        align="center"
                        className="ml-8 text-black bg-white border p-2"
                      >
                        Exhibitions
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                }
              >
                Exhibitions
              </MenuItem>
            )}

            {["system_admin", "exhibitor_admin", "exhibitor"].includes(session?.role) && (
              <MenuItem
                component={<Link href="/exhibitors" />}
                className={cn(isActiveRoute("/exhibitors") && "bg-slate-100")}
                icon={
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Users2Icon className="size-5" />
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        align="center"
                        className="ml-8 text-black bg-white border p-2"
                      >
                        Exhibitors
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                }
              >
                Exhibitors
              </MenuItem>
            )}

            {["system_admin"].includes(session?.role) && (
              <MenuItem
                component={<Link href="/company" />}
                className={cn(isActiveRoute("/company") && "bg-slate-100")}
                icon={
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <BriefcaseBusiness className="size-5" />
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        align="center"
                        className="ml-8 text-black bg-white border p-2"
                      >
                        Company
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                }
              >
                Company
              </MenuItem>
            )}

            {["system_admin"].includes(session?.role) && (
              <MenuItem
                component={<Link href="/volunteer" />}
                className={cn(isActiveRoute("/volunteer") && "bg-slate-100")}
                icon={
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Speech className="size-5" />
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        align="center"
                        className="ml-8 text-black bg-white border p-2"
                      >
                        Volunteers
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                }
              >
                Volunteers
              </MenuItem>
            )}
          </Menu>

          <SidebarFooter className="mb-2">
            <NavUser session={session} />
          </SidebarFooter>
        </div>
      </Sidebar>

      <div style={containerStyles}></div>
    </div>
  );
};

export default SidebarPage;
