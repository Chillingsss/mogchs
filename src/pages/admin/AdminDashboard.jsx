import React, { useState } from "react";
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
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const navigate = useNavigate();

	const navItems = [
		{ icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
		{ icon: <Users className="w-5 h-5" />, label: "Users" },
		{ icon: <FileText className="w-5 h-5" />, label: "Reports" },
		{ icon: <Settings className="w-5 h-5" />, label: "Settings" },
	];

	const logout = () => {
		Cookies.remove("mogchs_user");
		navigate("/");
	};

	return (
		<div className="flex min-h-screen bg-slate-50">
			{/* Sidebar */}
			<aside
				className={`flex flex-col p-4 space-y-6 bg-slate-900 text-white transition-all duration-300 ${
					sidebarOpen ? "w-64" : "w-20"
				}`}
			>
				{/* Toggle button */}
				<button
					className="flex justify-center items-center mb-4 w-10 h-10 rounded hover:bg-slate-800 focus:outline-none"
					onClick={() => setSidebarOpen((open) => !open)}
				>
					<Menu className="w-6 h-6" />
				</button>
				{/* Logo Centered */}
				<div
					className={`flex justify-center items-center mb-8 w-full transition-all`}
				>
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
							className="flex gap-3 items-center px-3 py-2 rounded transition-colors hover:bg-slate-800"
						>
							{item.icon}
							<span
								className={`transition-all duration-200 origin-left ${
									sidebarOpen
										? "ml-2 opacity-100"
										: "overflow-hidden ml-0 w-0 opacity-0"
								}`}
							>
								{item.label}
							</span>
						</a>
					))}
				</nav>
				<div className="mt-auto">
					<Button
						className="flex gap-2 items-center w-full bg-blue-600 hover:bg-blue-700"
						onClick={logout}
					>
						<LogOut className="w-5 h-5" />
						{sidebarOpen && <span>Logout</span>}
					</Button>
				</div>
			</aside>
			{/* Main Content */}
			<main className="flex-1 p-8">
				{/* Header */}
				<header className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
					<Button className="bg-blue-600 hover:bg-blue-700">New Report</Button>
				</header>
				{/* Stats Cards */}
				<div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
					<Card>
						<CardContent className="p-6">
							<div className="text-sm text-slate-500">Total Users</div>
							<div className="mt-2 text-2xl font-bold text-slate-900">
								1,234
							</div>
							<div className="mt-1 text-xs text-green-600">+5% this month</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="text-sm text-slate-500">Active Sessions</div>
							<div className="mt-2 text-2xl font-bold text-slate-900">87</div>
							<div className="mt-1 text-xs text-green-600">+12% this week</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="text-sm text-slate-500">Reports Generated</div>
							<div className="mt-2 text-2xl font-bold text-slate-900">56</div>
							<div className="mt-1 text-xs text-red-600">-2% this week</div>
						</CardContent>
					</Card>
				</div>
				{/* Recent Activity */}
				<Card>
					<CardContent className="p-6">
						<div className="mb-4 text-lg font-semibold text-slate-900">
							Recent Activity
						</div>
						<ul className="space-y-2 text-sm text-slate-700">
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
