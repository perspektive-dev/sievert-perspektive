const formConfig = {
	standard: {
		sheetRange: "Sheet1!R2C1:R3000C3",
		sheetId: "1QFWDdH0U3fzJs8f5y96Va3TxnlA0Cinw8px8b7TA1ek",
		field: ["referral_type", "email"],
		fullLinkSheet : "https://docs.google.com/spreadsheets/d/1QFWDdH0U3fzJs8f5y96Va3TxnlA0Cinw8px8b7TA1ek/edit?usp=sharing"
	},
	development: {
		sheetRange: "Sheet1!R2C1:R3000C3",
		sheetId: "1IcU21WiMBG9ZNPJc9pcsI-i4ghsGCIP8Jx8uylvjAlo",
		field: ["referral_type", "email"],
		fullLinkSheet : "https://docs.google.com/spreadsheets/d/1IcU21WiMBG9ZNPJc9pcsI-i4ghsGCIP8Jx8uylvjAlo/edit?usp=sharing"
	},
};

module.exports = { formConfig };