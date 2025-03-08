const UserAuthor = require("../models/userAuthorModel");

async function createUserOrAuthor(req, res) {
    try {
        const newUserAuthor = req.body; // Correct variable name

        // Find user by email
        const userInDb = await UserAuthor.findOne({ email: newUserAuthor.email });

        // If user or author exists
        if (userInDb !== null) {
            if (newUserAuthor.role === userInDb.role) {
                return res.status(200).send({ message: newUserAuthor.role, payload: userInDb });
            } else {
                return res.status(400).send({ message: "Invalid role" }); // Changed status to 400
            }
        }

        // Create new user
        let newUser = new UserAuthor(newUserAuthor);
        let newUserOrAuthorDoc = await newUser.save();
        return res.status(201).send({ message: newUserOrAuthorDoc.role, payload: newUserOrAuthorDoc });

    } catch (error) {
        console.error("Error in createUserOrAuthor:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = createUserOrAuthor;
