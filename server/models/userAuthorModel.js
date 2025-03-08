const mongoose = require("mongoose");

const userAuthorSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
      //  required: true,
    },
    email: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    "strict": "throw" // Allow additional fields to be saved
});

// Create model for user author schema
const UserAuthor = mongoose.model('userauthor', userAuthorSchema);

// Export
module.exports = UserAuthor;
