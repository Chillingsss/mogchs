import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	X,
	FileText,
	User,
	Calendar,
	MessageSquare,
	Paperclip,
	ZoomIn,
	ZoomOut,
	RotateCcw,
} from "lucide-react";
import { processRequest, getRequestAttachments } from "@/utils/registrar";
import toast from "react-hot-toast";

export default function ProcessedRequest({
	request,
	isOpen,
	onClose,
	onSuccess,
}) {
	const [processing, setProcessing] = useState(false);
	const [attachments, setAttachments] = useState([]);
	const [selectedImage, setSelectedImage] = useState(null);
	const [imageZoom, setImageZoom] = useState(1);

	// Function to get file extension
	const getFileExtension = (filename) => {
		return filename.split(".").pop().toLowerCase();
	};

	// Function to check if file is an image
	const isImageFile = (filename) => {
		const imageExtensions = ["jpg", "jpeg", "png", "gif"];
		return imageExtensions.includes(getFileExtension(filename));
	};

	// Image zoom handlers
	const openImageZoom = (filename) => {
		setSelectedImage(filename);
		setImageZoom(1);
	};

	const closeImageZoom = () => {
		setSelectedImage(null);
		setImageZoom(1);
	};

	const zoomIn = () => {
		setImageZoom((prev) => Math.min(prev + 0.25, 3));
	};

	const zoomOut = () => {
		setImageZoom((prev) => Math.max(prev - 0.25, 0.5));
	};

	const resetZoom = () => {
		setImageZoom(1);
	};

	// Fetch attachments when modal opens
	useEffect(() => {
		if (isOpen && request) {
			const fetchAttachments = async () => {
				try {
					const attachmentsData = await getRequestAttachments(request.id);
					if (Array.isArray(attachmentsData)) {
						// Extract filepath from each attachment object
						const filenames = attachmentsData.map((att) => att.filepath);
						setAttachments(filenames);
					}
				} catch (error) {
					console.error("Failed to fetch attachments:", error);
					// Fallback to single attachment if available
					if (request.attachment) {
						setAttachments([request.attachment]);
					}
				}
			};

			fetchAttachments();
		}
	}, [isOpen, request]);

	const handleProcess = async () => {
		setProcessing(true);
		try {
			const response = await processRequest(request.id);
			if (response.success) {
				toast.success(response.message);
				onSuccess(); // Refresh the data
				onClose(); // Close modal
			} else {
				toast.error(response.error || "Failed to process request");
			}
		} catch (error) {
			console.error("Failed to process request:", error);
			toast.error("Failed to process request");
		} finally {
			setProcessing(false);
		}
	};

	// Function to get button text and color based on status
	const getButtonConfig = () => {
		if (!request || !request.status) {
			return {
				text: processing ? "Processing..." : "Process Request",
				bgColor: "bg-green-600 hover:bg-green-700",
				disabled: false,
			};
		}

		const statusName = request.status.toLowerCase();

		switch (statusName) {
			case "pending":
				return {
					text: processing ? "Processing..." : "Mark as Processed",
					bgColor: "bg-green-600 hover:bg-green-700",
					disabled: false,
				};
			case "processed":
				return {
					text: processing ? "Processing..." : "Proceed to Signatory",
					bgColor: "bg-blue-600 hover:bg-blue-700",
					disabled: false,
				};
			case "signatory":
				return {
					text: processing ? "Processing..." : "Release Document",
					bgColor: "bg-green-600 hover:bg-green-700",
					disabled: false,
				};
			case "release":
				return {
					text: processing ? "Processing..." : "Mark as Released",
					bgColor: "bg-orange-600 hover:bg-orange-700",
					disabled: false,
				};
			case "released":
				return {
					text: "Document Released",
					bgColor: "bg-gray-400",
					disabled: true,
				};
			default:
				return {
					text: processing ? "Processing..." : "Process Request",
					bgColor: "bg-green-600 hover:bg-green-700",
					disabled: false,
				};
		}
	};

	const buttonConfig = getButtonConfig();

	// Function to get status styling based on status
	const getStatusStyling = () => {
		if (!request || !request.status) {
			return {
				bgColor: "bg-gray-50",
				borderColor: "border-gray-200",
				dotColor: "bg-gray-500",
				textColor: "text-gray-700",
				titleColor: "text-gray-800",
			};
		}

		const statusName = request.status.toLowerCase();

		switch (statusName) {
			case "pending":
				return {
					bgColor: "bg-yellow-50",
					borderColor: "border-yellow-200",
					dotColor: "bg-yellow-500",
					textColor: "text-yellow-700",
					titleColor: "text-yellow-800",
				};
			case "processed":
				return {
					bgColor: "bg-green-50",
					borderColor: "border-green-200",
					dotColor: "bg-green-500",
					textColor: "text-green-700",
					titleColor: "text-green-800",
				};
			case "signatory":
				return {
					bgColor: "bg-blue-50",
					borderColor: "border-blue-200",
					dotColor: "bg-blue-500",
					textColor: "text-blue-700",
					titleColor: "text-blue-800",
				};
			case "release":
			case "released":
				return {
					bgColor: "bg-purple-50",
					borderColor: "border-purple-200",
					dotColor: "bg-purple-500",
					textColor: "text-purple-700",
					titleColor: "text-purple-800",
				};
			default:
				return {
					bgColor: "bg-gray-50",
					borderColor: "border-gray-200",
					dotColor: "bg-gray-500",
					textColor: "text-gray-700",
					titleColor: "text-gray-800",
				};
		}
	};

	if (!isOpen || !request) return null;

	return (
		<>
			<div className="flex fixed inset-0 z-50 justify-center items-center p-1 backdrop-blur-sm bg-black/50 sm:p-4">
				<div className="relative w-full max-w-md sm:max-w-2xl lg:max-w-4xl bg-white rounded-lg sm:rounded-xl shadow-2xl max-h-[98vh] sm:max-h-[90vh] overflow-hidden">
					{/* Header */}
					<div className="flex justify-between items-center px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 sm:px-6 sm:py-4">
						<div className="flex gap-2 items-center sm:gap-3">
							<FileText className="w-5 h-5 sm:w-6 sm:h-6" />
							<h2 className="text-base font-semibold sm:text-xl">
								Document Request Details
							</h2>
						</div>
						<button
							onClick={onClose}
							className="p-1.5 sm:p-2 text-black hover:text-gray-200 rounded-full transition-colors"
							aria-label="Close"
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					{/* Scrollable Content */}
					<div className="overflow-y-auto max-h-[calc(98vh-120px)] sm:max-h-[calc(90vh-140px)]">
						<div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
							{/* Request Information */}
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								{/* Student Info */}
								<div className="p-4 rounded-lg bg-slate-50">
									<div className="flex gap-3 items-center mb-3">
										<User className="w-5 h-5 text-blue-600" />
										<span className="text-sm font-medium text-slate-600">
											Student
										</span>
									</div>
									<p className="text-lg font-semibold break-words text-slate-900">
										{request.student}
									</p>
								</div>

								{/* Document Info */}
								<div className="p-4 rounded-lg bg-slate-50">
									<div className="flex gap-3 items-center mb-3">
										<FileText className="w-5 h-5 text-blue-600" />
										<span className="text-sm font-medium text-slate-600">
											Document
										</span>
									</div>
									<p className="text-lg font-semibold break-words text-slate-900">
										{request.document}
									</p>
								</div>

								{/* Date Requested */}
								<div className="p-4 rounded-lg bg-slate-50">
									<div className="flex gap-3 items-center mb-3">
										<Calendar className="w-5 h-5 text-blue-600" />
										<span className="text-sm font-medium text-slate-600">
											Date Requested
										</span>
									</div>
									<p className="text-lg font-semibold text-slate-900">
										{request.dateRequested}
									</p>
								</div>

								{/* Current Status */}
								<div
									className={`rounded-lg p-4 border ${
										getStatusStyling().bgColor
									} ${getStatusStyling().borderColor}`}
								>
									<div className="flex gap-3 items-center mb-3">
										<div
											className={`w-3 h-3 rounded-full ${
												getStatusStyling().dotColor
											}`}
										></div>
										<span
											className={`text-sm font-medium ${
												getStatusStyling().textColor
											}`}
										>
											Current Status
										</span>
									</div>
									<p
										className={`text-lg font-semibold ${
											getStatusStyling().titleColor
										}`}
									>
										{request.status}
									</p>
								</div>
							</div>

							{/* Purpose */}
							{request?.purpose && (
								<div className="p-4 rounded-lg bg-slate-50">
									<div className="flex gap-3 items-center mb-3">
										<MessageSquare className="w-5 h-5 text-blue-600" />
										<span className="text-sm font-medium text-slate-600">
											Purpose
										</span>
									</div>
									<p className="text-base leading-relaxed break-words text-slate-900">
										{request.purpose}
									</p>
								</div>
							)}

							{/* Attachments */}
							{attachments.length > 0 && (
								<div className="p-4 rounded-lg bg-slate-50">
									<div className="flex gap-3 items-center mb-4">
										<Paperclip className="w-5 h-5 text-blue-600" />
										<span className="text-sm font-medium text-slate-600">
											Attachments ({attachments.length})
										</span>
									</div>
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										{attachments.map((filename, index) => (
											<div
												key={index}
												className="overflow-hidden bg-white rounded-lg border border-slate-200"
											>
												{isImageFile(filename) ? (
													<div>
														<div
															className="flex overflow-hidden justify-center items-center transition-colors cursor-pointer aspect-video bg-slate-100 hover:bg-slate-200"
															onClick={() => openImageZoom(filename)}
															title="Click to zoom"
														>
															<img
																src={`http://localhost/mogchs/backend/requirements/${filename}`}
																alt={filename}
																className="object-cover w-full h-full"
																onError={(e) => {
																	e.target.style.display = "none";
																	e.target.parentElement.innerHTML = `
																	<div class="flex flex-col justify-center items-center p-4 text-slate-500">
																		<FileText class="mb-2 w-8 h-8" />
																		<span class="text-sm">Failed to load image</span>
																	</div>
																`;
																}}
															/>
														</div>
														<div className="p-3">
															<p className="text-sm font-medium truncate text-slate-700">
																{filename}
															</p>
															<button
																onClick={() => openImageZoom(filename)}
																className="mt-1 text-xs text-blue-600 hover:text-blue-800"
															>
																Click to Zoom
															</button>
														</div>
													</div>
												) : (
													<div className="flex gap-3 items-center p-4">
														<FileText className="flex-shrink-0 w-8 h-8 text-slate-500" />
														<div className="flex-1 min-w-0">
															<p className="text-sm font-medium truncate text-slate-700">
																{filename}
															</p>
															<a
																href={`http://localhost/mogchs/backend/requirements/${filename}`}
																target="_blank"
																rel="noopener noreferrer"
																className="block mt-1 text-xs text-blue-600 hover:text-blue-800"
															>
																Open Document
															</a>
														</div>
													</div>
												)}
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Actions Footer */}
					<div className="flex flex-col gap-3 px-4 py-4 border-t sm:flex-row sm:px-6 bg-slate-50 border-slate-200">
						<Button
							onClick={handleProcess}
							disabled={buttonConfig.disabled}
							className={`w-full sm:flex-1 py-3 text-base font-medium text-white ${buttonConfig.bgColor}`}
						>
							{buttonConfig.text}
						</Button>
						<Button
							onClick={onClose}
							variant="outline"
							className="py-3 w-full text-base font-medium sm:flex-1"
						>
							Cancel
						</Button>
					</div>
				</div>
			</div>

			{/* Image Zoom Modal */}
			{selectedImage && (
				<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm">
					<div className="flex relative justify-center items-center p-2 w-full h-full sm:p-4">
						{/* Zoom Controls */}
						<div className="flex absolute top-2 right-2 z-10 gap-1 sm:top-4 sm:right-4 sm:gap-2">
							<button
								onClick={zoomOut}
								className="p-2 rounded-full shadow-lg transition-colors bg-white/90 hover:bg-white"
								title="Zoom Out"
							>
								<ZoomOut className="w-5 h-5 text-slate-700" />
							</button>
							<button
								onClick={resetZoom}
								className="p-2 rounded-full shadow-lg transition-colors bg-white/90 hover:bg-white"
								title="Reset Zoom"
							>
								<RotateCcw className="w-5 h-5 text-slate-700" />
							</button>
							<button
								onClick={zoomIn}
								className="p-2 rounded-full shadow-lg transition-colors bg-white/90 hover:bg-white"
								title="Zoom In"
							>
								<ZoomIn className="w-5 h-5 text-slate-700" />
							</button>
							<button
								onClick={closeImageZoom}
								className="p-2 rounded-full shadow-lg transition-colors bg-white/90 hover:bg-white"
								title="Close"
							>
								<X className="w-5 h-5 text-slate-700" />
							</button>
						</div>

						{/* Zoom Level Indicator */}
						<div className="absolute top-2 left-2 px-3 py-1 rounded-full shadow-lg sm:top-4 sm:left-4 bg-white/90">
							<span className="text-sm font-medium text-slate-700">
								{Math.round(imageZoom * 100)}%
							</span>
						</div>

						{/* Image Container */}
						<div className="overflow-auto max-w-full max-h-full touch-pan-x touch-pan-y">
							<img
								src={`http://localhost/mogchs/backend/requirements/${selectedImage}`}
								alt={selectedImage}
								className="max-w-none transition-transform duration-200"
								style={{
									transform: `scale(${imageZoom})`,
									cursor: imageZoom > 1 ? "grab" : "default",
									minWidth: "100px",
									minHeight: "100px",
								}}
								onError={(e) => {
									e.target.style.display = "none";
								}}
							/>
						</div>

						{/* Image Name */}
						<div className="absolute bottom-2 sm:bottom-4 left-1/2 px-3 py-2 rounded-full shadow-lg transform -translate-x-1/2 bg-white/90 max-w-[90%]">
							<span className="block text-sm font-medium truncate text-slate-700">
								{selectedImage}
							</span>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
