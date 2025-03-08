const exp = require('express');
const adminApp = exp.Router();

// API
adminApp.get("/", (req, res) => {
    res.send({ message: "from admin api" }); // Corrected syntax: send an object
});

module.exports = adminApp;