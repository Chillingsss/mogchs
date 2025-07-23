import axios from "axios";

export async function loginUser(username, password) {
	const formData = new FormData();
	formData.append("operation", "login");
	formData.append("json", JSON.stringify({ username: username, password }));

	try {
		const response = await axios.post(
			"http://localhost/mogchs/backend/admin.php",
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
