const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
app.use(express.json({ extended: true }));


const formSubmission = require("./controllers/formSubmission");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/v1/form-submission", formSubmission.formSubmit);

app.listen(process.env.PORT || 3000, () => {
	console.log("Server is running on port 3000");
});


