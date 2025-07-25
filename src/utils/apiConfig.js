import CryptoJS from "crypto-js";

// Secret key for encryption - in production, this should be more secure
const SECRET_KEY = "mogchs_api_secret_key";
const SESSION_KEY = "mogchs_encrypted_api_url";

/**
 * Set the encrypted API URL in session storage
 * @param {string} apiUrl - The API URL to encrypt and store
 */
export const setEncryptedApiUrl = (apiUrl) => {
	try {
		const encrypted = CryptoJS.AES.encrypt(apiUrl, SECRET_KEY).toString();
		sessionStorage.setItem(SESSION_KEY, encrypted);
		console.log("API URL encrypted and stored in session storage");
	} catch (error) {
		console.error("Error encrypting API URL:", error);
	}
};

/**
 * Get the decrypted API URL from session storage
 * @returns {string|null} - The decrypted API URL or null if not found/invalid
 */
export const getDecryptedApiUrl = () => {
	try {
		const encrypted = sessionStorage.getItem(SESSION_KEY);
		if (!encrypted) {
			return null;
		}

		const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
		const decrypted = bytes.toString(CryptoJS.enc.Utf8);

		if (!decrypted) {
			console.error("Failed to decrypt API URL");
			return null;
		}

		return decrypted;
	} catch (error) {
		console.error("Error decrypting API URL:", error);
		return null;
	}
};

/**
 * Remove the encrypted API URL from session storage
 */
export const removeEncryptedApiUrl = () => {
	try {
		sessionStorage.removeItem(SESSION_KEY);
		console.log("Encrypted API URL removed from session storage");
	} catch (error) {
		console.error("Error removing encrypted API URL:", error);
	}
};

/**
 * Initialize the API URL in session storage (call this once when the app starts)
 */
export const initializeApiUrl = () => {
	const apiUrl = "http://localhost/mogchs/backend";
	setEncryptedApiUrl(apiUrl);
};
