import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Menu,
	LayoutDashboard,
	Users,
	FileText,
	Settings,
	LogOut,
} from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const navigate = useNavigate();

	const navItems = [
		{ icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
		{ icon: <Users className="w-5 h-5" />, label: "Users" },
		{ icon: <FileText className="w-5 h-5" />, label: "Reports" },
		{ icon: <Settings className="w-5 h-5" />, label: "Settings" },
	];

	// Initialize sidebar state based on screen size
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) {
				// Desktop - sidebar should be open by default
				setSidebarOpen(true);
			}
		};

		// Set initial state
		handleResize();

		// Add event listener
		window.addEventListener("resize", handleResize);

		// Cleanup
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const logout = () => {
		Cookies.remove("mogchs_user");
		navigate("/");
	};

	return (
		<div className="flex min-h-screen bg-slate-50">
			{/* Mobile Overlay */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 z-20 bg-black/50 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed lg:relative z-30 flex flex-col bg-slate-900 text-white transition-all duration-300 h-full lg:h-screen ${
					sidebarOpen
						? "w-64 translate-x-0"
						: "w-64 -translate-x-full lg:translate-x-0"
				} ${sidebarOpen ? "lg:w-64" : "lg:w-20"}`}
				style={{ backgroundColor: "#0f172a", color: "white" }}
			>
				{/* Top Section */}
				<div className="flex flex-col p-4 space-y-6">
					{/* Toggle button */}
					<button
						className="flex justify-center items-center mb-4 w-10 h-10 text-white bg-gray-600 rounded hover:bg-blue-700 focus:outline-none"
						style={{ color: "white" }}
						onClick={() => setSidebarOpen((open) => !open)}
					>
						<Menu className="w-6 h-6" />
					</button>

					{/* Logo Centered */}
					<div className="flex justify-center items-center mb-8 w-full transition-all">
						<img
							src="/images/mogchs.jpg"
							alt="MOGCHS Logo"
							className={`transition-all duration-300 rounded-full bg-white object-cover ${
								sidebarOpen ? "h-20 w-22" : "w-12 h-12"
							}`}
						/>
					</div>

					{/* Nav */}
					<nav className="flex flex-col gap-2">
						{navItems.map((item, idx) => (
							<a
								href="#"
								key={item.label}
								className="flex gap-3 items-center px-3 py-2 text-white rounded transition-colors hover:bg-slate-800"
								style={{ color: "white" }}
							>
								{item.icon}
								<span
									className={`transition-all duration-200 origin-left ${
										sidebarOpen
											? "ml-2 opacity-100"
											: "overflow-hidden ml-0 w-0 opacity-0"
									}`}
									style={{ color: "white" }}
								>
									{item.label}
								</span>
							</a>
						))}
					</nav>
				</div>

				{/* Bottom Section - Logout Button */}
				<div className="p-4 mt-auto">
					<button
						className="flex gap-2 items-center px-4 py-2 w-full text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700"
						style={{ backgroundColor: "#2563eb", color: "white" }}
						onClick={logout}
					>
						<LogOut className="w-5 h-5" />
						<span
							className={`transition-all duration-200 origin-left ${
								sidebarOpen
									? "ml-2 opacity-100"
									: "overflow-hidden ml-0 w-0 opacity-0"
							}`}
							style={{ color: "white" }}
						>
							Logout
						</span>
					</button>
				</div>
			</aside>

			{/* Main Content */}
			<main className="flex-1 p-4 w-full min-w-0 lg:p-8">
				{/* Mobile Menu Button */}
				<div className="flex justify-between items-center mb-4 lg:hidden">
					<button
						onClick={() => setSidebarOpen(true)}
						className="p-2 bg-white rounded-lg border shadow-sm text-slate-600 border-slate-200"
					>
						<Menu className="w-5 h-5" />
					</button>
					<h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
				</div>

				{/* Desktop Header */}
				<header className="hidden justify-between items-center mb-8 lg:flex">
					<h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
					<Button className="bg-blue-600 hover:bg-blue-700">New Report</Button>
				</header>

				{/* Mobile Header */}
				<header className="flex flex-col gap-4 mb-6 lg:hidden">
					<Button className="flex gap-2 items-center w-full bg-blue-600 hover:bg-blue-700">
						New Report
					</Button>
				</header>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 lg:mb-8">
					<Card>
						<CardContent className="p-4 lg:p-6">
							<div className="text-xs lg:text-sm text-slate-500">
								Total Users
							</div>
							<div className="mt-2 text-xl font-bold lg:text-2xl text-slate-900">
								1,234
							</div>
							<div className="mt-1 text-xs text-green-600">+5% this month</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 lg:p-6">
							<div className="text-xs lg:text-sm text-slate-500">
								Active Sessions
							</div>
							<div className="mt-2 text-xl font-bold lg:text-2xl text-slate-900">
								87
							</div>
							<div className="mt-1 text-xs text-green-600">+12% this week</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 lg:p-6">
							<div className="text-xs lg:text-sm text-slate-500">
								Reports Generated
							</div>
							<div className="mt-2 text-xl font-bold lg:text-2xl text-slate-900">
								56
							</div>
							<div className="mt-1 text-xs text-red-600">-2% this week</div>
						</CardContent>
					</Card>
				</div>
				{/* Recent Activity */}
				<Card>
					<CardContent className="p-4 lg:p-6">
						<div className="mb-4 text-base font-semibold lg:text-lg text-slate-900">
							Recent Activity
						</div>
						<ul className="space-y-2 text-xs lg:text-sm text-slate-700">
							<li>
								User <span className="font-bold">john_doe</span> created a
								report.
							</li>
							<li>
								User <span className="font-bold">jane_admin</span> updated
								settings.
							</li>
							<li>
								New user <span className="font-bold">alice</span> registered.
							</li>
						</ul>
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
