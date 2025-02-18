"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CodepenIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import React from "react";


const navLinks: { name: string; href: string }[] = [
	{ name: "Home", href: "/" },
	{ name: "About", href: "/about" },
	{ name: "Contact Us", href: "/contact" },
	{ name: "Join Us", href: "/register" },
];

const Header = ({ session }: { session: any }) => {
	const currentPath = usePathname();

	return (
		<header className="h-14 border-b bg-background px-4 md:px-8">
			<div className="flex h-full items-center justify-between">
				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center gap-x-4">
					<div className="flex flex-row items-center gap-x-4">
						<CodepenIcon className="h-8 w-8" />
						<span className="text-lg font-semibold">EMS</span>
					</div>
				</nav>

				{/* Mobile Navigation */}
				<div className="flex md:hidden items-center">
					<div className="flex items-center gap-x-2">
						<CodepenIcon className="h-6 w-6" />
						<span className="text-lg font-semibold">EMS</span>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
