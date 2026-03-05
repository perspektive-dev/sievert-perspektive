const auth = require("../configs/auth");
const { google } = require("googleapis");
const { formConfig } = require("../configs/formConfig");

const formSubmit = async function (req, res) {
	try {
		if (req.body.formType == "") {
			return res.status(400).json({
				message : "Form type is required",
			});
		}

		if (formConfig[req.body.formType] == undefined) {
			return res.status(400).json({
				message : "Form type is not supported",
			});
		}

		if (!req.body?.data) {
			return res.status(400).json({
				message : "Data is required",
			});
		}

		const authClient = await auth.getClient();
		google.options({ auth: authClient });

		const configForm = formConfig[req.body.formType];
		const data = [];

		for (let index = 0; index < configForm.field.length; index++) {
			const fieldName = configForm.field[index];
			if (req.body?.data[fieldName] == undefined || req.body.data[fieldName] == null) {
				req.body.data[fieldName] = "-";
			}
			if (req.body.data[fieldName].length > 2000) {
				return res.status(400).json({
					message : "Data is too long",
				});
			}
			data.push([req.body.data[fieldName].trim()]);
		}

		const sheets = google.sheets({
			version: "v4",
		});

		await sheets.spreadsheets.values.append({
			spreadsheetId: configForm.sheetId,
			range: configForm.sheetRange,
			valueInputOption: "USER_ENTERED",
			resource: {
				values: data,
			},
		});

		return res.status(200).send("Successfully inserted data");
	} catch (error) {
		// console.log(error);
		console.log(error.response.data.error);
		console.log(Object.keys(error));
		return res.status(500).send("Error inserting data");
	}
};

module.exports = { formSubmit };
