"use client";

import {
	BriefcaseBusiness,
	ChevronRight,
	LayoutDashboard,
	Map,
	MapPin,
	MenuIcon,
	Presentation,
	Settings2,
	StoreIcon,
	UsersRound,
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ModuleInfo } from "@/utilities/module.enum";

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
					<Menu className="h-full" menuItemStyles={{
						button: {
							'&:hover': {
								backgroundColor: 'transparent', // removes hover color
							},
						},
					}}>
						<MenuItem onClick={toggleSidebar} className="hidden md:block">
							<MenuIcon className="ml-2 size-6" />
						</MenuItem>

						{(session?.module_id === ModuleInfo[2].value) && (
							<>
								{/* Dashboard Menu Item */}
								<MenuItem
									component={<Link href="/hrm-module" />}
									className={cn(isActiveRoute("/hrm-module") && "bg-accent")}
									icon={
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<LayoutDashboard className="size-4" />
												</TooltipTrigger>
												<TooltipContent
													side="right"
													align="center"
													className="border p-2"
												>
													Dashboard
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									}
								>
									<p className="text-[14px]">
										Dashboard
									</p>
								</MenuItem>

								<DropdownMenu >
									<DropdownMenuTrigger asChild>
										<MenuItem
											className="cursor-pointer"
											icon={
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger asChild>
															<Settings2 className="size-4" />
														</TooltipTrigger>
														<TooltipContent
															side="right"
															align="center"
															className="border p-2"
														>
															Setup
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											}
										>
											<div className="flex w-full text-[14px] justify-between items-center">
												<span>Setup</span>
												<ChevronRight className="size-4 text-muted-foreground" />
											</div>
										</MenuItem>
									</DropdownMenuTrigger>

									<DropdownMenuContent
										className="w-40  border shadow-md rounded-md overflow-hidden"
										align="start"
										side="right" // Opens from the right side
									>
										<div>
											<DropdownMenuItem asChild>
												<Link
													className={cn(
														isActiveRoute("/hrm-module/department") && "bg-accent cursor-pointer",
														"flex items-center text-[13px] gap-2"
													)}
													href="/hrm-module/department"
												>
													<BriefcaseBusiness className="size-4" /> Department
												</Link>
											</DropdownMenuItem>
											<DropdownMenuSeparator />

											<DropdownMenuItem asChild>
												<Link
													className={cn(
														isActiveRoute("/hrm-module/designation") && "bg-accent cursor-pointer",
														"flex items-center text-[13px] gap-2"
													)}
													href="/hrm-module/designation"
												>
													<Presentation className="size-4" /> Designation
												</Link>
											</DropdownMenuItem>
											<DropdownMenuSeparator />

											<DropdownMenuItem asChild>
												<Link
													className={cn(
														isActiveRoute("/hrm-module/zone") && "bg-accent cursor-pointer",
														"flex items-center text-[13px] gap-2"
													)}
													href="/hrm-module/zone"
												>
													<MapPin className="size-4" /> Zone
												</Link>
											</DropdownMenuItem>
											<DropdownMenuSeparator />

											<DropdownMenuItem asChild>
												<Link
													className={cn(
														isActiveRoute("/hrm-module/region") && "bg-accent cursor-pointer",
														"flex items-center text-[13px] gap-2"
													)}
													href="/hrm-module/region"
												>
													<Map className="size-4" /> Region
												</Link>
											</DropdownMenuItem>
											<DropdownMenuSeparator />

											<DropdownMenuItem asChild>
												<Link
													className={cn(
														isActiveRoute("/hrm-module/market") && "bg-accent cursor-pointer",
														"flex items-center text-[13px] gap-2"
													)}
													href="/hrm-module/market"
												>
													<StoreIcon className="size-4" /> Market
												</Link>
											</DropdownMenuItem>
										</div>
									</DropdownMenuContent>
								</DropdownMenu>

								{/* Employees Menu Item */}
								<MenuItem
									component={<Link href="/hrm-module/employees" />}
									className={cn(isActiveRoute("/hrm-module/employees") && "bg-accent")}
									icon={
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<UsersRound className="size-4" />
												</TooltipTrigger>
												<TooltipContent
													side="right"
													align="center"
													className="border p-2"
												>
													Employees
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									}
								>
									<p className="text-[14px]">
										Employees
									</p>
								</MenuItem>
							</>
						)}
					</Menu>

					<SidebarFooter className="mb-2">
						<NavUser session={session} />
					</SidebarFooter>
				</div>
			</Sidebar >

			<div style={containerStyles}></div>
		</div >
	);
};

export default SidebarPage;
