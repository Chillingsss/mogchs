import React, { useState, useEffect } from "react";
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
	Filter,
	Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { getAllRequests, getRequestStats } from "@/utils/registrar";
import toast, { Toaster } from "react-hot-toast";
import ProcessedRequest from "./modal/ProcessedRequest";

export default function RegistrarDashboard() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [recentRequests, setRecentRequests] = useState([]);
	const [filteredRequests, setFilteredRequests] = useState([]);
	const [requestStats, setRequestStats] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedRequest, setSelectedRequest] = useState(null);
	const [showProcessModal, setShowProcessModal] = useState(false);
	const [activeFilter, setActiveFilter] = useState("today");
	const [customDate, setCustomDate] = useState("");
	const navigate = useNavigate();

	const navItems = [
		{ icon: <FileText className="w-5 h-5" />, label: "Requests" },
		{ icon: <Users className="w-5 h-5" />, label: "Students" },
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

	// Fetch data on component mount
	useEffect(() => {
		fetchData();
	}, []);

	// Apply filters when data or filter changes
	useEffect(() => {
		applyFilters();
	}, [recentRequests, activeFilter, customDate]);

	const fetchData = async () => {
		setLoading(true);
		try {
			const [requestsData, statsData] = await Promise.all([
				getAllRequests(),
				getRequestStats(),
			]);

			setRecentRequests(Array.isArray(requestsData) ? requestsData : []);
			setRequestStats(Array.isArray(statsData) ? statsData : []);
		} catch (error) {
			console.error("Failed to fetch data:", error);
			toast.error("Failed to load dashboard data");
		} finally {
			setLoading(false);
		}
	};

	// Filter functions
	const applyFilters = () => {
		let filtered = [...recentRequests];
		const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

		switch (activeFilter) {
			case "today":
				filtered = filtered.filter((req) => req.dateRequested === today);
				break;
			case "week":
				const weekAgo = new Date();
				weekAgo.setDate(weekAgo.getDate() - 7);
				const weekAgoStr = weekAgo.toISOString().split("T")[0];
				filtered = filtered.filter((req) => req.dateRequested >= weekAgoStr);
				break;
			case "month":
				const monthAgo = new Date();
				monthAgo.setMonth(monthAgo.getMonth() - 1);
				const monthAgoStr = monthAgo.toISOString().split("T")[0];
				filtered = filtered.filter((req) => req.dateRequested >= monthAgoStr);
				break;
			case "custom":
				if (customDate) {
					filtered = filtered.filter((req) => req.dateRequested === customDate);
				}
				break;
			case "all":
			default:
				// No filtering, show all
				break;
		}

		setFilteredRequests(filtered);
	};

	const handleFilterChange = (filterType) => {
		setActiveFilter(filterType);
		if (filterType !== "custom") {
			setCustomDate("");
		}
	};

	const handleCustomDateChange = (date) => {
		setCustomDate(date);
		if (date) {
			setActiveFilter("custom");
		}
	};

	// Helper function to get stat by status name
	const getStatByStatus = (statusName) => {
		const stat = requestStats.find((s) => s.status === statusName);
		return stat || { count: 0, todayCount: 0 };
	};

	// Helper function to get filtered stats based on active filter
	const getFilteredStatByStatus = (statusName) => {
		const today = new Date().toISOString().split("T")[0];
		let filteredData = [...recentRequests];

		// Apply the same filter logic as the table
		switch (activeFilter) {
			case "today":
				filteredData = filteredData.filter(
					(req) => req.dateRequested === today
				);
				break;
			case "week":
				const weekAgo = new Date();
				weekAgo.setDate(weekAgo.getDate() - 7);
				const weekAgoStr = weekAgo.toISOString().split("T")[0];
				filteredData = filteredData.filter(
					(req) => req.dateRequested >= weekAgoStr
				);
				break;
			case "month":
				const monthAgo = new Date();
				monthAgo.setMonth(monthAgo.getMonth() - 1);
				const monthAgoStr = monthAgo.toISOString().split("T")[0];
				filteredData = filteredData.filter(
					(req) => req.dateRequested >= monthAgoStr
				);
				break;
			case "custom":
				if (customDate) {
					filteredData = filteredData.filter(
						(req) => req.dateRequested === customDate
					);
				}
				break;
			case "all":
			default:
				// Use original stats for "all"
				return getStatByStatus(statusName);
		}

		// Count filtered requests by status
		const filteredCount = filteredData.filter(
			(req) => req.status === statusName
		).length;
		const todayCount = filteredData.filter(
			(req) => req.status === statusName && req.dateRequested === today
		).length;

		return { count: filteredCount, todayCount };
	};

	// Helper function to get the appropriate time period label
	const getTimePeriodLabel = () => {
		switch (activeFilter) {
			case "today":
				return "today";
			case "week":
				return "this week";
			case "month":
				return "this month";
			case "custom":
				return customDate ? `on ${customDate}` : "selected date";
			case "all":
			default:
				return "today";
		}
	};

	// Handle row click to open modal
	const handleRequestClick = (request) => {
		setSelectedRequest(request);
		setShowProcessModal(true);
	};

	// Handle modal close
	const handleModalClose = () => {
		setShowProcessModal(false);
		setSelectedRequest(null);
	};

	// Handle successful processing
	const handleProcessSuccess = () => {
		fetchData(); // Refresh the data
	};

	const logout = () => {
		Cookies.remove("mogchs_user");
		navigate("/");
	};

	return (
		<div className="flex min-h-screen bg-slate-50">
			<Toaster position="top-right" />
			{/* Mobile Overlay */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 z-20 bg-black/50 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed lg:relative z-30 flex flex-col bg-slate-900 dark:bg-slate-900 text-white dark:text-white transition-all duration-300 h-full lg:h-screen ${
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
						className="flex justify-center items-center mb-4 w-10 h-10 text-white bg-gray-600 rounded hover:bg-blue-700 dark:hover:bg-slate-800 focus:outline-none"
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
								className="flex gap-3 items-center px-3 py-2 text-white rounded transition-colors hover:bg-slate-800 dark:hover:bg-slate-800 dark:text-white"
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
						className="flex gap-2 items-center px-4 py-2 w-full text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
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
					<h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
				</div>

				{/* Desktop Header */}
				<header className="hidden justify-between items-center mb-8 lg:flex">
					<h1 className="text-3xl font-bold text-slate-900">
						Registrar Dashboard
					</h1>
					<Button className="flex gap-2 items-center text-white bg-blue-600 hover:bg-blue-700">
						<FilePlus className="w-4 h-4" /> New Request
					</Button>
				</header>
				{/* Stats Cards */}
				<div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6 lg:mb-8">
					<Card>
						<CardContent className="p-4 lg:p-6">
							<div className="flex gap-2 items-center text-xs lg:text-sm text-slate-500">
								<FileText className="w-4 h-4" />
								<span className="truncate">Pending</span>
							</div>
							<div className="mt-2 text-xl font-bold lg:text-2xl text-slate-900">
								{getFilteredStatByStatus("Pending").count}
							</div>
							<div className="mt-1 text-xs text-yellow-600">
								{activeFilter === "all"
									? `+${getFilteredStatByStatus("Pending").todayCount} today`
									: `${
											getFilteredStatByStatus("Pending").count
									  } ${getTimePeriodLabel()}`}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 lg:p-6">
							<div className="flex gap-2 items-center text-xs lg:text-sm text-slate-500">
								<CheckCircle2 className="w-4 h-4" />
								<span className="truncate">Processed</span>
							</div>
							<div className="mt-2 text-xl font-bold lg:text-2xl text-slate-900">
								{getFilteredStatByStatus("Processed").count}
							</div>
							<div className="mt-1 text-xs text-green-600">
								{activeFilter === "all"
									? `+${getFilteredStatByStatus("Processed").todayCount} today`
									: `${
											getFilteredStatByStatus("Processed").count
									  } ${getTimePeriodLabel()}`}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 lg:p-6">
							<div className="flex gap-2 items-center text-xs lg:text-sm text-slate-500">
								<Users className="w-4 h-4" />
								<span className="truncate">Signatory</span>
							</div>
							<div className="mt-2 text-xl font-bold lg:text-2xl text-slate-900">
								{getFilteredStatByStatus("Signatory").count}
							</div>
							<div className="mt-1 text-xs text-blue-600">
								{activeFilter === "all"
									? `+${getFilteredStatByStatus("Signatory").todayCount} today`
									: `${
											getFilteredStatByStatus("Signatory").count
									  } ${getTimePeriodLabel()}`}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 lg:p-6">
							<div className="flex gap-2 items-center text-xs lg:text-sm text-slate-500">
								<XCircle className="w-4 h-4" />
								<span className="truncate">Release</span>
							</div>
							<div className="mt-2 text-xl font-bold lg:text-2xl text-slate-900">
								{getFilteredStatByStatus("Release").count}
							</div>
							<div className="mt-1 text-xs text-purple-600">
								{activeFilter === "all"
									? `+${getFilteredStatByStatus("Release").todayCount} today`
									: `${
											getFilteredStatByStatus("Release").count
									  } ${getTimePeriodLabel()}`}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 lg:p-6">
							<div className="flex gap-2 items-center text-xs lg:text-sm text-slate-500">
								<XCircle className="w-4 h-4" />
								<span className="truncate">Released</span>
							</div>
							<div className="mt-2 text-xl font-bold lg:text-2xl text-slate-900">
								{getFilteredStatByStatus("Released").count}
							</div>
							<div className="mt-1 text-xs text-purple-600">
								{activeFilter === "all"
									? `+${getFilteredStatByStatus("released").todayCount} today`
									: `${
											getFilteredStatByStatus("Released").count
									  } ${getTimePeriodLabel()}`}
							</div>
						</CardContent>
					</Card>
				</div>
				{/* Recent Requests Table */}
				<Card>
					<CardContent className="p-4 lg:p-6">
						<div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
							<div className="text-lg font-semibold text-slate-900">
								Recent Document Requests
							</div>

							{/* Filter Controls */}
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
								{/* Filter Buttons */}
								<div className="flex gap-2 items-center">
									<Filter className="w-4 h-4 text-slate-500" />
									<div className="flex gap-1">
										<Button
											size="sm"
											variant={activeFilter === "today" ? "default" : "outline"}
											onClick={() => handleFilterChange("today")}
											className="text-xs"
										>
											Today
										</Button>
										<Button
											size="sm"
											variant={activeFilter === "week" ? "default" : "outline"}
											onClick={() => handleFilterChange("week")}
											className="text-xs"
										>
											This Week
										</Button>
										<Button
											size="sm"
											variant={activeFilter === "month" ? "default" : "outline"}
											onClick={() => handleFilterChange("month")}
											className="text-xs"
										>
											This Month
										</Button>
										<Button
											size="sm"
											variant={activeFilter === "all" ? "default" : "outline"}
											onClick={() => handleFilterChange("all")}
											className="text-xs"
										>
											All
										</Button>
									</div>
								</div>

								{/* Custom Date Input */}
								<div className="flex gap-2 items-center">
									<Calendar className="w-4 h-4 text-slate-500" />
									<input
										type="date"
										value={customDate}
										onChange={(e) => handleCustomDateChange(e.target.value)}
										className="px-3 py-1 text-xs text-black bg-white rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:filter-none [&::-webkit-calendar-picker-indicator]:cursor-pointer"
										style={{
											colorScheme: "light",
										}}
										placeholder="Custom date"
									/>
								</div>
							</div>
						</div>

						{/* Results Count */}
						<div className="mb-3 text-xs lg:mb-4 lg:text-sm text-slate-600">
							Showing {filteredRequests.length} of {recentRequests.length}{" "}
							requests
							{activeFilter === "today" && " (Today)"}
							{activeFilter === "week" && " (This Week)"}
							{activeFilter === "month" && " (This Month)"}
							{activeFilter === "custom" && customDate && ` (${customDate})`}
						</div>

						{loading ? (
							<div className="py-6 text-center lg:py-8">
								<p className="text-sm text-slate-500 lg:text-base">
									Loading requests...
								</p>
							</div>
						) : filteredRequests.length === 0 ? (
							<div className="py-6 text-center lg:py-8">
								<p className="text-sm text-slate-500 lg:text-base">
									No document requests found.
								</p>
							</div>
						) : (
							<div className="overflow-x-auto -mx-4 lg:mx-0">
								<table className="min-w-full text-xs lg:text-sm text-slate-700">
									<thead>
										<tr className="border-b border-slate-200">
											<th className="px-3 py-2 font-semibold text-left lg:px-4">
												Student
											</th>
											<th className="px-3 py-2 font-semibold text-left lg:px-4">
												Document
											</th>
											<th className="hidden px-3 py-2 font-semibold text-left lg:px-4 sm:table-cell">
												Date
											</th>
											<th className="px-3 py-2 font-semibold text-left lg:px-4">
												Status
											</th>
										</tr>
									</thead>
									<tbody>
										{filteredRequests.map((req) => (
											<tr
												key={req.id}
												className="border-b transition-colors cursor-pointer border-slate-100 hover:bg-slate-50 active:bg-slate-100"
												onClick={() => handleRequestClick(req)}
											>
												<td className="px-3 py-3 lg:px-4 lg:py-2">
													<div className="font-medium">{req.student}</div>
													<div className="text-xs text-slate-500 sm:hidden">
														{req.dateRequested}
													</div>
												</td>
												<td className="px-3 py-3 lg:px-4 lg:py-2">
													<div className="truncate max-w-[120px] lg:max-w-none">
														{req.document}
													</div>
												</td>
												<td className="hidden px-3 py-3 lg:px-4 lg:py-2 sm:table-cell">
													{req.dateRequested}
												</td>
												<td className="px-3 py-3 lg:px-4 lg:py-2">
													{req.status === "Pending" && (
														<span className="inline-flex px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
															Pending
														</span>
													)}
													{req.status === "Processed" && (
														<span className="inline-flex px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
															Processed
														</span>
													)}
													{req.status === "Signatory" && (
														<span className="inline-flex px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
															Signatory
														</span>
													)}
													{req.status === "Release" && (
														<span className="inline-flex px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 rounded-full">
															Release
														</span>
													)}
													{req.status === "Released" && (
														<span className="inline-flex px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
															Released
														</span>
													)}
													{req.status === "Rejected" && (
														<span className="inline-flex px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
															Rejected
														</span>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</CardContent>
				</Card>
				<ProcessedRequest
					isOpen={showProcessModal}
					onClose={handleModalClose}
					request={selectedRequest}
					onSuccess={handleProcessSuccess}
				/>
			</main>
		</div>
	);
}
