import axios from "axios";
import { getDecryptedApiUrl } from "./apiConfig";

// Get the encrypted API URL from session storage
const apiUrl = getDecryptedApiUrl();
if (!apiUrl) {
	throw new Error("API URL not found or could not be decrypted");
}

export async function getDocuments() {
	const formData = new FormData();
	formData.append("operation", "GetDocuments");

	try {
		const response = await axios.post(`${apiUrl}/student.php`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function getRequirementsType() {
	const formData = new FormData();
	formData.append("operation", "getRequirementsType");

	try {
		const response = await axios.post(`${apiUrl}/student.php`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function addRequestDocument({
	userId,
	documentId,
	purpose,
	attachments = [],
	typeIds = [],
}) {
	const formData = new FormData();
	formData.append("operation", "addRequestDocument");
	formData.append(
		"json",
		JSON.stringify({ userId, documentId, purpose, typeIds })
	);

	// Add multiple file attachments if provided
	if (attachments && attachments.length > 0) {
		attachments.forEach((file, index) => {
			formData.append(`attachments[${index}]`, file);
		});
	}

	try {
		const response = await axios.post(`${apiUrl}/student.php`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		console.log("response", response.data);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function getUserRequests(userId) {
	const formData = new FormData();
	formData.append("operation", "getUserRequests");
	formData.append("json", JSON.stringify({ userId }));

	try {
		const response = await axios.post(`${apiUrl}/student.php`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}
