import axios from "axios";

export async function getDocuments() {
	const formData = new FormData();
	formData.append("operation", "GetDocuments");

	try {
		const response = await axios.post(
			"http://localhost/mogchs/backend/registrar.php",
			formData,
			{
				headers: { "Content-Type": "multipart/form-data" },
			}
		);
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
		const response = await axios.post(
			"http://localhost/mogchs/backend/registrar.php",
			formData,
			{
				headers: { "Content-Type": "multipart/form-data" },
			}
		);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function getAllRequests() {
	const formData = new FormData();
	formData.append("operation", "getAllRequests");

	try {
		const response = await axios.post(
			"http://localhost/mogchs/backend/registrar.php",
			formData,
			{
				headers: { "Content-Type": "multipart/form-data" },
			}
		);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function getRequestStats() {
	const formData = new FormData();
	formData.append("operation", "getRequestStats");

	try {
		const response = await axios.post(
			"http://localhost/mogchs/backend/registrar.php",
			formData,
			{
				headers: { "Content-Type": "multipart/form-data" },
			}
		);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function processRequest(requestId) {
	const formData = new FormData();
	formData.append("operation", "processRequest");
	formData.append("json", JSON.stringify({ requestId }));

	try {
		const response = await axios.post(
			"http://localhost/mogchs/backend/registrar.php",
			formData,
			{
				headers: { "Content-Type": "multipart/form-data" },
			}
		);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function getRequestAttachments(requestId) {
	const formData = new FormData();
	formData.append("operation", "getRequestAttachments");
	formData.append("json", JSON.stringify({ requestId }));

	try {
		const response = await axios.post(
			"http://localhost/mogchs/backend/registrar.php",
			formData,
			{
				headers: { "Content-Type": "multipart/form-data" },
			}
		);
		return response.data;
	} catch (error) {
		throw error;
	}
}
