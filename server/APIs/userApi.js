const exp = require('express');
const userApp = exp.Router();
const UserAuthor=require("../models/userAuthorModel")
const expressAsyncHandler=require("express-async-handler");
const createUserOrAuthor=require("./createUserOrAuthor");
const Article=require("../models/articleModel")
// API: Get all users


//post comments
userApp.put('/comment/:articleId',expressAsyncHandler(async(req,res)=>{
    //get comment obj
    const commentObj=req.body;
    const articleWithComments=await Article.findOneAndUpdate(
        {articleId:req.params.articleId},
        {$push:{comments:commentObj}},
        {returnOriginal:false})

        res.send({message:"comment added",payload:articleWithComments})



}))
userApp.post("/user",expressAsyncHandler(createUserOrAuthor))
module.exports = userApp;
