import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, FileText, User, Calendar, MessageSquare } from "lucide-react";
import {
	processRequest,
	getRequestAttachments,
	getStudentDocuments,
} from "@/utils/registrar";
import toast from "react-hot-toast";
import StudentDocumentsSection from "./components/StudentDocumentsSection";
import AttachmentsSection from "./components/AttachmentsSection";
import ImageZoomModal from "./components/ImageZoomModal";

export default function ProcessedRequest({
	request,
	isOpen,
	onClose,
	onSuccess,
}) {
	const [processing, setProcessing] = useState(false);
	const [attachments, setAttachments] = useState([]);
	const [studentDocuments, setStudentDocuments] = useState([]);
	const [selectedImage, setSelectedImage] = useState(null);
	const [imageZoom, setImageZoom] = useState(1);
	const [groupByType, setGroupByType] = useState(false);

	// Function to get file extension
	const getFileExtension = (filename) => {
		return filename.split(".").pop().toLowerCase();
	};

	// Function to check if file is an image
	const isImageFile = (filename) => {
		const imageExtensions = ["jpg", "jpeg", "png", "gif"];
		return imageExtensions.includes(getFileExtension(filename));
	};

	// Function to check if file is a PDF
	const isPdfFile = (filename) => {
		return getFileExtension(filename) === "pdf";
	};

	// Image zoom handlers - updated to work with attachment objects
	const openImageZoom = (attachment) => {
		setSelectedImage(attachment);
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
						// Store the full attachment objects with requirement types
						setAttachments(attachmentsData);
					}
				} catch (error) {
					console.error("Failed to fetch attachments:", error);
					// Fallback to single attachment if available
					if (request.attachment) {
						setAttachments([
							{ filepath: request.attachment, requirementType: "Unknown" },
						]);
					}
				}
			};

			const fetchStudentDocuments = async () => {
				try {
					const documentsData = await getStudentDocuments(request.id);
					if (Array.isArray(documentsData)) {
						setStudentDocuments(documentsData);
					}
				} catch (error) {
					console.error("Failed to fetch student documents:", error);
					setStudentDocuments([]);
				}
			};

			fetchAttachments();
			fetchStudentDocuments();
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

		// Check if student documents are required and available for pending status
		const hasRequiredDocuments =
			statusName !== "pending" || studentDocuments.length > 0;

		switch (statusName) {
			case "pending":
				return {
					text: processing ? "Processing..." : "Mark as Processed",
					bgColor: hasRequiredDocuments
						? "bg-green-600 hover:bg-green-700"
						: "bg-gray-400",
					disabled: !hasRequiredDocuments || processing,
				};
			case "processed":
				return {
					text: processing ? "Processing..." : "Proceed to Signatory",
					bgColor: "bg-blue-600 hover:bg-blue-700",
					disabled: processing,
				};
			case "signatory":
				return {
					text: processing ? "Processing..." : "Release Document",
					bgColor: "bg-green-600 hover:bg-green-700",
					disabled: processing,
				};
			case "release":
				return {
					text: processing ? "Processing..." : "Mark as Released",
					bgColor: "bg-orange-600 hover:bg-orange-700",
					disabled: processing,
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
					bgColor: hasRequiredDocuments
						? "bg-green-600 hover:bg-green-700"
						: "bg-gray-400",
					disabled: !hasRequiredDocuments || processing,
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
					<div className="flex justify-between items-center px-4 py-3 text-white bg-[#5409DA] sm:px-6 sm:py-4">
						<div className="flex gap-2 items-center sm:gap-3">
							<FileText className="w-5 h-5 sm:w-6 sm:h-6" />
							<h2 className="text-base font-semibold sm:text-xl">
								Document Request Details
							</h2>
						</div>
						<button
							onClick={onClose}
							className="p-1.5 sm:p-2 text-white hover:text-gray-200 rounded-full transition-colors"
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

							{/* Student Documents */}
							<StudentDocumentsSection
								studentDocuments={studentDocuments}
								request={request}
							/>

							{/* Attachments */}
							<AttachmentsSection
								attachments={attachments}
								groupByType={groupByType}
								setGroupByType={setGroupByType}
								openImageZoom={openImageZoom}
								isImageFile={isImageFile}
							/>
						</div>
					</div>

					{/* Actions Footer */}
					<div className="flex flex-col gap-3 px-4 py-4 border-t sm:flex-row sm:px-6 bg-slate-50 border-slate-200">
						{/* Warning message when documents are missing */}
						{buttonConfig.reason && (
							<div className="flex items-center gap-2 p-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg">
								<span className="text-amber-600">⚠️</span>
								<span>{buttonConfig.reason}</span>
							</div>
						)}

						<div className="flex flex-col gap-3 sm:flex-row w-full">
							<Button
								onClick={handleProcess}
								disabled={buttonConfig.disabled}
								className={`w-full sm:flex-1 py-3 text-base font-medium text-white ${
									buttonConfig.bgColor
								} ${
									buttonConfig.disabled ? "cursor-not-allowed opacity-75" : ""
								}`}
								title={buttonConfig.reason || ""}
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
			</div>

			{/* Image Zoom Modal */}
			{selectedImage && (
				<ImageZoomModal
					selectedImage={selectedImage}
					imageZoom={imageZoom}
					zoomIn={zoomIn}
					zoomOut={zoomOut}
					resetZoom={resetZoom}
					closeImageZoom={closeImageZoom}
				/>
			)}
		</>
	);
}
