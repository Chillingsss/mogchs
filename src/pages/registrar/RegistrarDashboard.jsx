import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Menu,
	FileText,
	Users,
	CheckCircle2,
	XCircle,
	LogOut,
	FilePlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function RegistrarDashboard() {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const navigate = useNavigate();

	const navItems = [
		{ icon: <FileText className="w-5 h-5" />, label: "Requests" },
		{ icon: <Users className="w-5 h-5" />, label: "Students" },
	];

	// Example data for recent requests
	const recentRequests = [
		{ id: 1, student: "Juan Dela Cruz", doc: "Transcript", status: "Pending" },
		{ id: 2, student: "Maria Santos", doc: "Good Moral", status: "Approved" },
		{ id: 3, student: "Jose Rizal", doc: "Form 137", status: "Rejected" },
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
						<span
							className={`transition-all duration-200 origin-left ${
								sidebarOpen
									? "ml-2 opacity-100"
									: "overflow-hidden ml-0 w-0 opacity-0"
							}`}
						>
							Logout
						</span>
					</Button>
				</div>
			</aside>
			{/* Main Content */}
			<main className="flex-1 p-8">
				{/* Header */}
				<header className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-slate-900">
						Registrar Dashboard
					</h1>
					<Button className="flex gap-2 items-center bg-blue-600 hover:bg-blue-700">
						<FilePlus className="w-4 h-4" /> New Request
					</Button>
				</header>
				{/* Stats Cards */}
				<div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
					<Card>
						<CardContent className="p-6">
							<div className="flex gap-2 items-center text-sm text-slate-500">
								<FileText className="w-4 h-4" />
								Pending Requests
							</div>
							<div className="mt-2 text-2xl font-bold text-slate-900">8</div>
							<div className="mt-1 text-xs text-yellow-600">+2 today</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex gap-2 items-center text-sm text-slate-500">
								<CheckCircle2 className="w-4 h-4" />
								Approved
							</div>
							<div className="mt-2 text-2xl font-bold text-slate-900">15</div>
							<div className="mt-1 text-xs text-green-600">+1 today</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex gap-2 items-center text-sm text-slate-500">
								<XCircle className="w-4 h-4" />
								Rejected
							</div>
							<div className="mt-2 text-2xl font-bold text-slate-900">3</div>
							<div className="mt-1 text-xs text-red-600">0 today</div>
						</CardContent>
					</Card>
				</div>
				{/* Recent Requests Table */}
				<Card>
					<CardContent className="p-6">
						<div className="mb-4 text-lg font-semibold text-slate-900">
							Recent Document Requests
						</div>
						<div className="overflow-x-auto">
							<table className="min-w-full text-sm text-slate-700">
								<thead>
									<tr className="border-b border-slate-200">
										<th className="px-4 py-2 font-semibold text-left">
											Student
										</th>
										<th className="px-4 py-2 font-semibold text-left">
											Document
										</th>
										<th className="px-4 py-2 font-semibold text-left">
											Status
										</th>
									</tr>
								</thead>
								<tbody>
									{recentRequests.map((req) => (
										<tr key={req.id} className="border-b border-slate-100">
											<td className="px-4 py-2">{req.student}</td>
											<td className="px-4 py-2">{req.doc}</td>
											<td className="px-4 py-2">
												{req.status === "Pending" && (
													<span className="font-medium text-yellow-600">
														Pending
													</span>
												)}
												{req.status === "Approved" && (
													<span className="font-medium text-green-600">
														Approved
													</span>
												)}
												{req.status === "Rejected" && (
													<span className="font-medium text-red-600">
														Rejected
													</span>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
