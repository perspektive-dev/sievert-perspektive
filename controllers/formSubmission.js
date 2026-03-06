const auth = require("../configs/auth");
const { google } = require("googleapis");
const { formConfig } = require("../configs/formConfig");
const { sendMailNotifReferral } = require("../configs/mailer");

const formSubmit = async function (req, res) {
	try {
		if (req.body.formType == "") {
			return res.status(400).json({
				message: "Form type is required",
			});
		}

		if (formConfig[req.body.formType] == undefined) {
			return res.status(400).json({
				message: "Form type is not supported",
			});
		}

		if (!req.body?.data) {
			return res.status(400).json({
				message: "Data is required",
			});
		}

		const authClient = await auth.getClient();
		google.options({ auth: authClient });

		const configForm = formConfig[req.body.formType];
		const data = [];

		for (let index = 0; index < configForm.field.length; index++) {
			const fieldName = configForm.field[index];
			if (req.body?.data[fieldName] == undefined || req.body?.data[fieldName] == null) {
				req.body.data[fieldName] = "-";
			}
			if (req.body.data[fieldName].length > 2000) {
				return res.status(400).json({
					message: "Data is too long",
				});
			}
			data.push(req.body.data[fieldName].trim());
		}

		// insert date
		const googleSheetsEpoch = new Date("1899-12-30T00:00:00.000Z");
		const date = new Date();
		const utc = date.getTime() + date.getTimezoneOffset() * 60000;
		const offset = 8; // UTC+8
		const diffTime = Math.abs((utc + 3600000 * offset)- googleSheetsEpoch.getTime());
		const googleSheetsSerial = diffTime / 86400000;

		data.push(googleSheetsSerial);

		const sheets = google.sheets({
			version: "v4",
		});

		// check duplicate value
		const checkDuplicate = await sheets.spreadsheets.values.get({
			spreadsheetId: configForm.sheetId,
			range: configForm.sheetRange,
			valueRenderOption: "UNFORMATTED_VALUE",
			majorDimension: "ROWS",
		});

		if (checkDuplicate?.data?.values) {
			for (let index = 0; index < checkDuplicate?.data?.values?.length; index++) {
				const row = checkDuplicate.data.values[index];
				if (row[1] == req.body.data.email && row[0] == req.body.data.referral_type) {
					const sheetName = configForm.sheetRange.split("!")[0];
					const newRange = `${sheetName}!R${index + 2}C1:R${index + 2}C3`;
					await sheets.spreadsheets.values.update({
						spreadsheetId: configForm.sheetId,
						range: newRange,
						valueInputOption: "USER_ENTERED",
						requestBody: {
							majorDimension: "ROWS",
							range: newRange,
							values: [data],
						},
					});
					return res.status(200).send("Successfully inserted data");
				}
			}
		}

		await sheets.spreadsheets.values.append({
			spreadsheetId: configForm.sheetId,
			range: configForm.sheetRange,
			valueInputOption: "USER_ENTERED",
			resource: {
				values: [data],
			},
		});

		console.log(data);
		// send email
		await sendMailNotifReferral({
			fullLink: configForm.fullLinkSheet,
			...req.body.data,
		});

		return res.status(200).send("Successfully inserted data");
	} catch (error) {
		console.log(error);
		console.log(error.response?.data?.error);
		console.log(Object.keys(error));
		return res.status(500).send("Error inserting data");
	}
};

module.exports = { formSubmit };
