const mongoose = require("mongoose");

const authorDataSchema = mongoose.Schema({
    nameOfAuthor: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String
    }
});

const userCommentSchema = new mongoose.Schema({
    nameOfUser: {
        type: String,
        required: true  // Fixed here
    },
    comment: {
        type: String,
        required: true  // Fixed here
    }
}, { "strict": "throw" });

const articleSchema = new mongoose.Schema({
    authorData: {
        type: authorDataSchema
    },
    articleId: {
        type: String,
        required: true  // Fixed here
    },
    title: {
        type: String,
        required: true  // Fixed here
    },
    category: {
        type: String,
        required: true  // Fixed here
    },
    content: {
        type: String,
        required: true  // Fixed here
    },
    dateOfCreation: {
        type: String,
        required: true  // Fixed here
    },
    dateOfModification: {  // Fixed key name (camelCase consistency)
        type: String,
        required: true  // Fixed here
    },
    comments: [userCommentSchema],
    isArticleActive: {
        type: Boolean,
        required: true  // Fixed here
    }
}, { "strict": "throw" });

const Article = mongoose.model("article", articleSchema);

module.exports = Article;
