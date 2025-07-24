import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import {
	Menu,
	FileText,
	Clock,
	CheckCircle2,
	XCircle,
	LogOut,
	Plus,
	User,
} from "lucide-react";
import {
	getDocuments,
	addRequestDocument,
	getUserRequests,
} from "@/utils/student";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import toast, { Toaster } from "react-hot-toast";

export default function StudentDashboard() {
	const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
	const [sidebarMobile, setSidebarMobile] = useState(false);
	const [showRequestForm, setShowRequestForm] = useState(false);
	const [selectedDocument, setSelectedDocument] = useState("");
	const [purpose, setPurpose] = useState("");
	const [documents, setDocuments] = useState([]);
	const [loadingDocs, setLoadingDocs] = useState(false);
	const [userRequests, setUserRequests] = useState([]);
	const [loadingRequests, setLoadingRequests] = useState(false);

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
	// console.log("userId", userId);

	// Fetch documents when modal opens
	React.useEffect(() => {
		if (showRequestForm) {
			setLoadingDocs(true);
			getDocuments()
				.then((data) => {
					setDocuments(Array.isArray(data) ? data : []);
				})
				.finally(() => setLoadingDocs(false));
		}
	}, [showRequestForm]);

	// Fetch user requests on component mount
	React.useEffect(() => {
		if (userId) {
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
		}
	}, [userId]);

	const navItems = [
		{ icon: <FileText className="w-5 h-5" />, label: "My Requests" },
		{ icon: <User className="w-5 h-5" />, label: "Profile" },
	];

	const documentTypes = [
		"Form 137 (Permanent Record)",
		"Form 138 (Report Card)",
		"Certificate of Good Moral Character",
		"Transcript of Records",
		"Diploma Copy",
		"Certificate of Enrollment",
	];

	const handleRequestSubmit = async (e) => {
		e.preventDefault();
		if (!selectedDocument || !purpose) return;
		const datetime = new Date().toISOString().slice(0, 19).replace("T", " ");
		try {
			await addRequestDocument({
				userId,
				documentId: selectedDocument,
				purpose,
				datetime,
			});
			toast.success("Request submitted successfully!");
			setShowRequestForm(false);
			setSelectedDocument("");
			setPurpose("");
			// Refresh user requests after successful submission
			if (userId) {
				setLoadingRequests(true);
				getUserRequests(userId)
					.then((data) => {
						setUserRequests(Array.isArray(data) ? data : []);
					})
					.catch((err) => {
						console.error(
							"Failed to fetch user requests after submission:",
							err
						);
						toast.error("Failed to load your requests after submission.");
					})
					.finally(() => setLoadingRequests(false));
			}
		} catch (err) {
			toast.error("Failed to submit request");
		}
	};

	React.useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 768) {
				setSidebarOpen(false);
			} else {
				setSidebarOpen(true);
			}
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="flex h-screen bg-gray-50">
			<Toaster position="top-right" />
			{/* Sidebar for desktop, overlay for mobile */}
			{(sidebarOpen || sidebarMobile) && (
				<div
					className={`${
						sidebarMobile ? "fixed inset-0 z-40 bg-black/40" : ""} md:relative md:z-auto`}
					onClick={() => setSidebarMobile(false)}
				>
					<aside
						className={`flex flex-col h-full p-4 space-y-6 bg-slate-900 text-white transition-all duration-300 w-64 ${
							sidebarMobile
								? "fixed top-0 bottom-0 left-0 translate-x-0"
								: "hidden md:flex"
						}`}
						onClick={(e) => e.stopPropagation()}
					>
						{/* Close button for mobile */}
						{sidebarMobile && (
							<button
								className="absolute top-4 right-4 text-white"
								onClick={() => setSidebarMobile(false)}
							>
								<XCircle className="w-7 h-7" />
							</button>
						)}
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
									<span className="ml-2 opacity-100">{item.label}</span>
								</a>
							))}
						</nav>
						<div className="mt-auto">
							<Button className="flex gap-2 items-center w-full bg-blue-600 hover:bg-blue-700">
								<LogOut className="w-5 h-5" />
								<span className="ml-2 opacity-100">Logout</span>
							</Button>
						</div>
					</aside>
				</div>
			)}
			{/* Hamburger for mobile */}
			{!sidebarOpen && !sidebarMobile && (
				<button
					className="fixed top-4 left-4 z-50 p-2 text-white rounded-full shadow-lg md:hidden bg-slate-900"
					onClick={() => setSidebarMobile(true)}
				>
					<Menu className="w-6 h-6" />
				</button>
			)}
			{/* Main Content */}
			<main className="overflow-auto flex-1 p-2 pt-16 md:pt-8 md:p-8">
				{/* Header */}
				<header className="flex flex-col gap-4 mb-8 md:flex-row md:justify-between md:items-center md:gap-0">
					<div>
						<h1 className="text-2xl font-bold md:text-3xl text-slate-900">
							Student Portal
						</h1>
						<p className="text-sm text-slate-600 md:text-base">
							Request and track your documents
						</p>
					</div>
					<Button
						className="flex gap-2 items-center w-full bg-blue-600 hover:bg-blue-700 md:w-auto"
						onClick={() => setShowRequestForm(true)}
					>
						<Plus className="w-4 h-4" /> Request Document
					</Button>
				</header>
				{/* Stats Cards */}
				<div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
					<Card>
						<CardContent className="p-6">
							<div className="flex gap-2 items-center text-sm text-slate-500">
								<Clock className="w-4 h-4" />
								Pending Requests
							</div>
							<div className="mt-2 text-2xl font-bold text-slate-900">
								{userRequests.filter((req) => req.status === "Pending").length}
							</div>
							<div className="mt-1 text-xs text-yellow-600">
								Awaiting processing
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex gap-2 items-center text-sm text-slate-500">
								<CheckCircle2 className="w-4 h-4" />
								Approved
							</div>
							<div className="mt-2 text-2xl font-bold text-slate-900">
								{userRequests.filter((req) => req.status === "Approved").length}
							</div>
							<div className="mt-1 text-xs text-green-600">
								Ready for pickup
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex gap-2 items-center text-sm text-slate-500">
								<FileText className="w-4 h-4" />
								Total Requests
							</div>
							<div className="mt-2 text-2xl font-bold text-slate-900">
								{userRequests.length}
							</div>
							<div className="mt-1 text-xs text-slate-600">All time</div>
						</CardContent>
					</Card>
				</div>
				{/* Request Form Modal */}
				{showRequestForm && (
					<div className="flex fixed inset-0 z-50 justify-center items-center backdrop-blur-sm bg-black/40">
						<div className="relative mx-2 w-full max-w-xs bg-white rounded-2xl border shadow-2xl md:max-w-md border-slate-200">
							{/* Title Bar */}
							<div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl border-b border-slate-100">
								<h3 className="text-lg font-semibold text-slate-900">
									Request Document
								</h3>
								<button
									onClick={() => setShowRequestForm(false)}
									className="p-1 rounded-full transition-colors text-slate-400 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
									aria-label="Close"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-5 h-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>
							<form
								onSubmit={handleRequestSubmit}
								className="px-6 py-6 space-y-5"
							>
								<div>
									<Label
										htmlFor="document-type"
										className="block mb-1 text-sm font-medium text-slate-700"
									>
										Document Type
									</Label>
									<select
										id="document-type"
										value={selectedDocument}
										onChange={(e) => setSelectedDocument(e.target.value)}
										className="block px-3 py-2 w-full rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50 text-slate-900"
										required
										disabled={loadingDocs}
									>
										<option value="">
											{loadingDocs ? "Loading..." : "Select a document"}
										</option>
										{documents.map((doc) => (
											<option key={doc.id} value={doc.id}>
												{doc.name}
											</option>
										))}
									</select>
								</div>
								<div>
									<Label
										htmlFor="purpose"
										className="block mb-1 text-sm font-medium text-slate-700"
									>
										Purpose
									</Label>
									<Input
										id="purpose"
										placeholder="e.g., College application, Employment"
										className="px-3 py-2 w-full rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50 text-slate-900"
										value={purpose}
										onChange={(e) => setPurpose(e.target.value)}
										required
									/>
								</div>
								<div className="flex gap-3 pt-2">
									<Button
										type="submit"
										className="flex-1 h-11 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700"
									>
										Submit Request
									</Button>
									<Button
										type="button"
										variant="outline"
										className="flex-1 h-11 text-base font-semibold bg-gradient-to-r from-red-600 to-red-600 rounded-lg shadow-md border-slate-300 hover:from-red-700 hover:to-indigo-700"
										onClick={() => setShowRequestForm(false)}
									>
										Cancel
									</Button>
								</div>
							</form>
						</div>
					</div>
				)}
				{/* My Requests Table */}
				<Card>
					<CardContent className="p-2 md:p-6">
						<div className="mb-4 text-lg font-semibold text-slate-900">
							My Document Requests
						</div>
						{loadingRequests ? (
							<div className="py-8 text-center">
								<p className="text-slate-500">Loading your requests...</p>
							</div>
						) : userRequests.length === 0 ? (
							<div className="py-8 text-center">
								<p className="text-slate-500">No document requests yet.</p>
							</div>
						) : (
							<div className="overflow-x-auto">
								<table className="min-w-full text-xs md:text-sm text-slate-700">
									<thead>
										<tr className="border-b border-slate-200">
											<th className="px-2 py-2 font-semibold text-left md:px-4">
												Document
											</th>
											<th className="px-2 py-2 font-semibold text-left md:px-4">
												Date Requested
											</th>
											<th className="px-2 py-2 font-semibold text-left md:px-4">
												Status
											</th>
										</tr>
									</thead>
									<tbody>
										{userRequests.map((req) => (
											<tr key={req.id} className="border-b border-slate-100">
												<td className="px-4 py-2">{req.document}</td>
												<td className="px-4 py-2">{req.dateRequested}</td>
												<td className="px-4 py-2">
													{req.status === "Pending" && (
														<span className="flex gap-1 items-center font-medium text-yellow-600">
															<Clock className="w-4 h-4" />
															Pending
														</span>
													)}
													{req.status === "Approved" && (
														<span className="flex gap-1 items-center font-medium text-green-600">
															<CheckCircle2 className="w-4 h-4" />
															Approved
														</span>
													)}
													{req.status === "Processing" && (
														<span className="flex gap-1 items-center font-medium text-blue-600">
															<FileText className="w-4 h-4" />
															Processing
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
