import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Menu,
	FileText,
	Clock,
	CheckCircle2,
	LogOut,
	Plus,
	User,
} from "lucide-react";
import { getUserRequests } from "@/utils/student";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import RequestDocuments from "./modal/RequestDocuments";

export default function StudentDashboard() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [showRequestForm, setShowRequestForm] = useState(false);
	const [userRequests, setUserRequests] = useState([]);
	const [loadingRequests, setLoadingRequests] = useState(false);
	const navigate = useNavigate();

	// Get userId from cookie
	const COOKIE_KEY = "mogchs_user";
	const SECRET_KEY = "mogchs_secret_key";
	let userId = "";
	const encrypted = Cookies.get(COOKIE_KEY);
	if (encrypted) {
		try {
			const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
			const user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
			userId = user?.id;
		} catch {}
	}

	// Fetch user requests on component mount
	React.useEffect(() => {
		if (userId) {
			fetchUserRequests();
		}
	}, [userId]);

	const fetchUserRequests = () => {
		setLoadingRequests(true);
		getUserRequests(userId)
			.then((data) => {
				setUserRequests(Array.isArray(data) ? data : []);
			})
			.catch((err) => {
				console.error("Failed to fetch user requests:", err);
				toast.error("Failed to load your requests.");
			})
			.finally(() => setLoadingRequests(false));
	};

	const navItems = [
		{ icon: <FileText className="w-5 h-5" />, label: "My Requests" },
		{ icon: <User className="w-5 h-5" />, label: "Profile" },
	];

	// Initialize sidebar state based on screen size
	React.useEffect(() => {
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

	const handleRequestSuccess = () => {
		// Refresh user requests after successful submission
		fetchUserRequests();
	};

	return (
		<div className="flex min-h-screen bg-gray-50">
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
					<h1 className="text-xl font-bold text-slate-900">Student Portal</h1>
				</div>

				{/* Desktop Header */}
				<header className="hidden justify-between items-center mb-8 lg:flex">
					<div>
						<h1 className="text-3xl font-bold text-slate-900">
							Student Portal
						</h1>
						<p className="text-base text-slate-600">
							Request and track your documents
						</p>
					</div>
					<Button
						className="flex gap-2 items-center text-white bg-blue-600 hover:bg-blue-700"
						onClick={() => setShowRequestForm(true)}
					>
						<Plus className="w-4 h-4" /> Request Document
					</Button>
				</header>

				{/* Mobile Header */}
				<header className="flex flex-col gap-4 mb-6 lg:hidden">
					<div>
						<p className="text-sm text-slate-600">
							Request and track your documents
						</p>
					</div>
					<Button
						className="flex gap-2 items-center w-full bg-blue-600 hover:bg-blue-700"
						onClick={() => setShowRequestForm(true)}
					>
						<Plus className="w-4 h-4" /> Request Document
					</Button>
				</header>
				{/* Stats Cards */}
				<div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3 lg:gap-6 lg:mb-8">
					<Card>
						<CardContent className="p-4 lg:p-6">
							<div className="flex gap-2 items-center text-xs lg:text-sm text-slate-500">
								<Clock className="w-4 h-4" />
								<span className="truncate">Pending</span>
							</div>
							<div className="mt-2 text-xl font-bold lg:text-2xl text-slate-900">
								{userRequests.filter((req) => req.status === "Pending").length}
							</div>
							<div className="mt-1 text-xs text-yellow-600">
								Awaiting processing
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 lg:p-6">
							<div className="flex gap-2 items-center text-xs lg:text-sm text-slate-500">
								<CheckCircle2 className="w-4 h-4" />
								<span className="truncate">Release</span>
							</div>
							<div className="mt-2 text-xl font-bold lg:text-2xl text-slate-900">
								{userRequests.filter((req) => req.status === "Release").length}
							</div>
							<div className="mt-1 text-xs text-green-600">
								Ready for pickup
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 lg:p-6">
							<div className="flex gap-2 items-center text-xs lg:text-sm text-slate-500">
								<FileText className="w-4 h-4" />
								<span className="truncate">Total</span>
							</div>
							<div className="mt-2 text-xl font-bold lg:text-2xl text-slate-900">
								{userRequests.length}
							</div>
							<div className="mt-1 text-xs text-slate-600">All time</div>
						</CardContent>
					</Card>
				</div>
				{/* Request Form Modal */}
				{showRequestForm && (
					<RequestDocuments
						isOpen={showRequestForm}
						onClose={() => setShowRequestForm(false)}
						userId={userId}
						onSuccess={handleRequestSuccess}
					/>
				)}
				{/* My Requests Table */}
				<Card>
					<CardContent className="p-4 lg:p-6">
						<div className="mb-4 text-lg font-semibold lg:text-xl text-slate-900">
							My Document Requests
						</div>
						{loadingRequests ? (
							<div className="py-6 text-center lg:py-8">
								<p className="text-sm text-slate-500 lg:text-base">
									Loading your requests...
								</p>
							</div>
						) : userRequests.length === 0 ? (
							<div className="py-6 text-center lg:py-8">
								<p className="text-sm text-slate-500 lg:text-base">
									No document requests yet.
								</p>
							</div>
						) : (
							<div className="overflow-x-auto -mx-4 lg:mx-0">
								<table className="min-w-full text-xs lg:text-sm text-slate-700">
									<thead>
										<tr className="border-b border-slate-200">
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
										{userRequests.map((req) => (
											<tr
												key={req.id}
												className="border-b border-slate-100 hover:bg-slate-50"
											>
												<td className="px-3 py-3 lg:px-4 lg:py-2">
													<div className="font-medium">{req.document}</div>
													<div className="text-xs text-slate-500 sm:hidden">
														{req.dateRequested}
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
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
