const { GoogleAuth } = require("google-auth-library");

const auth = new GoogleAuth({
	keyFile: process.env.GCP_KEYFILE_PATH || "./auth-key.json",
	scopes: [
		"https://www.googleapis.com/auth/spreadsheets"
	],
});

module.exports = auth;