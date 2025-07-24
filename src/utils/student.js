import axios from "axios";

export async function getDocuments() {
	const formData = new FormData();
	formData.append("operation", "GetDocuments");

	try {
		const response = await axios.post(
			"http://localhost/mogchs/backend/student.php",
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

export async function addRequestDocument({
	userId,
	documentId,
	purpose,
	attachments = [],
}) {
	const formData = new FormData();
	formData.append("operation", "addRequestDocument");
	formData.append("json", JSON.stringify({ userId, documentId, purpose }));

	// Add multiple file attachments if provided
	if (attachments && attachments.length > 0) {
		attachments.forEach((file, index) => {
			formData.append(`attachments[${index}]`, file);
		});
	}

	try {
		const response = await axios.post(
			"http://localhost/mogchs/backend/student.php",
			formData,
			{
				headers: { "Content-Type": "multipart/form-data" },
			}
		);
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
		const response = await axios.post(
			"http://localhost/mogchs/backend/student.php",
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
