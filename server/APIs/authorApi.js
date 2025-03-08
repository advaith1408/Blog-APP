const express = require('express');
const expressAsyncHandler = require('express-async-handler'); // Import expressAsyncHandler
const authorApp = express.Router();
const createUserOrAuthor = require("./createUserOrAuthor");
const Article=require("../models/articleModel")
const {requireAuth,clerkMiddleware}=require("@clerk/express")
require('dotenv').config()
// API
authorApp.post("/author", expressAsyncHandler(createUserOrAuthor));


//create new article
authorApp.post("/article",expressAsyncHandler(async(req,res)=>{
    const newArticleObj=req.body;
    const newArticle=new Article(newArticleObj);
    const articleObj=await newArticle.save();
    res.status(201).send({message:"article published",payload:articleObj})
}))
//read all articles
authorApp.get('/articles',requireAuth({signInUrl:"unauthorized"}) ,expressAsyncHandler(async (req, res) => {
    //read all articles from db
    const listOfArticles = await Article.find({ isArticleActive: true });
    res.status(200).send({ message: "articles", payload: listOfArticles })
}))

authorApp.get('/unauthorized',(req,res)=>{
    res.send({message:"Unauthorized request"})
})
//update article
authorApp.put('/article/:articleId',requireAuth({signInUrl:"unauthorized"}) ,expressAsyncHandler(async(req,res)=>{

    const modifiedArticle=req.body;
    const dbRes=await Article.findByIdAndUpdate(modifiedArticle._id,{...modifiedArticle},{returnOriginal:false})
    res.status(200).send({message:"article modified",payload:dbRes})

}))
//delete article
authorApp.put('/articles/:articleId', expressAsyncHandler(async (req, res) => {
    
    //get modified article
    const modifiedArticle = req.body;
    //update article by article id
    const dbRes= await Article.findByIdAndUpdate(modifiedArticle._id,
        { ...modifiedArticle },
        { returnOriginal: false })
    //send res
    res.status(200).send({ message: "article deleted or restored", payload: dbRes })
}))


module.exports = authorApp;
