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
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [showRequestForm, setShowRequestForm] = useState(false);
	const [selectedDocument, setSelectedDocument] = useState("");
	const [purpose, setPurpose] = useState("");
	const [documents, setDocuments] = useState([]);
	const [loadingDocs, setLoadingDocs] = useState(false);
	const [userRequests, setUserRequests] = useState([]);
	const [loadingRequests, setLoadingRequests] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState([]);
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

	const handleFileChange = (e) => {
		const files = Array.from(e.target.files);
		if (files.length > 0) {
			// Validate file type
			const allowedTypes = [
				"image/jpeg",
				"image/jpg",
				"image/png",
				"image/gif",
				"application/pdf",
			];
			const invalidFiles = files.filter(
				(file) => !allowedTypes.includes(file.type)
			);
			if (invalidFiles.length > 0) {
				toast.error(
					"Invalid file type. Only JPG, PNG, GIF, and PDF files are allowed."
				);
				e.target.value = "";
				return;
			}

			// Validate file size (5MB max)
			const largeFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
			if (largeFiles.length > 0) {
				toast.error("File size too large. Maximum size is 5MB.");
				e.target.value = "";
				return;
			}

			setSelectedFiles(files);
		}
	};

	const handleAddMoreFiles = (e) => {
		const newFiles = Array.from(e.target.files);
		if (newFiles.length > 0) {
			// Validate file type
			const allowedTypes = [
				"image/jpeg",
				"image/jpg",
				"image/png",
				"image/gif",
				"application/pdf",
			];
			const invalidFiles = newFiles.filter(
				(file) => !allowedTypes.includes(file.type)
			);
			if (invalidFiles.length > 0) {
				toast.error(
					"Invalid file type. Only JPG, PNG, GIF, and PDF files are allowed."
				);
				e.target.value = "";
				return;
			}

			// Validate file size (5MB max)
			const largeFiles = newFiles.filter((file) => file.size > 5 * 1024 * 1024);
			if (largeFiles.length > 0) {
				toast.error("File size too large. Maximum size is 5MB.");
				e.target.value = "";
				return;
			}

			// Check for duplicate files by name
			const existingFileNames = selectedFiles.map((file) => file.name);
			const duplicateFiles = newFiles.filter((file) =>
				existingFileNames.includes(file.name)
			);

			if (duplicateFiles.length > 0) {
				toast.warning(
					`Duplicate files detected: ${duplicateFiles
						.map((f) => f.name)
						.join(", ")}`
				);
			}

			// Filter out duplicates and add new files
			const uniqueNewFiles = newFiles.filter(
				(file) => !existingFileNames.includes(file.name)
			);
			setSelectedFiles((prev) => [...prev, ...uniqueNewFiles]);

			// Clear the input
			e.target.value = "";
		}
	};

	const removeFile = (indexToRemove) => {
		setSelectedFiles((prev) =>
			prev.filter((_, index) => index !== indexToRemove)
		);
	};

	const handleRequestSubmit = async (e) => {
		e.preventDefault();
		if (!selectedDocument || !purpose) return;
		try {
			await addRequestDocument({
				userId,
				documentId: selectedDocument,
				purpose,
				attachments: selectedFiles,
			});
			toast.success("Request submitted successfully!");
			setShowRequestForm(false);
			setSelectedDocument("");
			setPurpose("");
			setSelectedFiles([]);
			// Reset file inputs
			const fileInput = document.getElementById("file-upload");
			const addMoreInput = document.getElementById("add-more-files");
			if (fileInput) fileInput.value = "";
			if (addMoreInput) addMoreInput.value = "";

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
								<div>
									<Label
										htmlFor="file-upload"
										className="block mb-1 text-sm font-medium text-slate-700"
									>
										Document Attachments (Optional)
									</Label>
									<Input
										type="file"
										id="file-upload"
										accept=".jpg, .jpeg, .png, .gif, .pdf"
										onChange={handleFileChange}
										className="block w-full text-sm rounded-lg border cursor-pointer text-slate-900 border-slate-300 bg-slate-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
										multiple
									/>
									<p className="mt-1 text-xs text-slate-500">
										You can select multiple files (JPG, PNG, GIF, PDF). Max 5MB
										per file.
									</p>

									{/* Hidden input for adding more files */}
									<input
										type="file"
										id="add-more-files"
										accept=".jpg, .jpeg, .png, .gif, .pdf"
										onChange={handleAddMoreFiles}
										className="hidden"
										multiple
									/>

									{selectedFiles.length > 0 && (
										<div className="mt-3">
											<div className="flex justify-between items-center mb-2">
												<p className="text-xs font-medium text-slate-600">
													Selected files ({selectedFiles.length}):
												</p>
												<button
													type="button"
													onClick={() =>
														document.getElementById("add-more-files").click()
													}
													className="text-xs font-medium text-blue-600 hover:text-blue-800"
												>
													+ Add More Files
												</button>
											</div>
											<div className="overflow-y-auto p-2 max-h-32 rounded-lg border border-slate-200 bg-slate-50">
												{selectedFiles.map((file, index) => (
													<div
														key={index}
														className="flex justify-between items-center px-2 py-1 rounded hover:bg-slate-100"
													>
														<div className="flex-1 min-w-0">
															<p className="text-xs font-medium truncate text-slate-700">
																{file.name}
															</p>
															<p className="text-xs text-slate-500">
																{(file.size / 1024 / 1024).toFixed(2)} MB
															</p>
														</div>
														<button
															type="button"
															onClick={() => removeFile(index)}
															className="ml-2 text-xs text-red-500 hover:text-red-700"
															title="Remove file"
														>
															✕
														</button>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
								<div className="flex gap-3 pt-2">
									<Button
										type="submit"
										className="flex-1 h-11 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700"
									>
										Submit Request
									</Button>
									<Button
										type="button"
										variant="outline"
										className="flex-1 h-11 text-base font-semibold text-white bg-gradient-to-r from-red-600 to-red-600 rounded-lg shadow-md border-slate-300 hover:from-red-700 hover:to-red-700"
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
