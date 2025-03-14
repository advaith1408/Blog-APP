import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userAuthorContextObj } from '../../contexts/userAuthorContext';
import { FaEdit } from 'react-icons/fa';
import { MdDelete, MdRestore } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import '../styling/ArticleByID.css';

function ArticleByID() {
  const { state } = useLocation();
  const { currentUser } = useContext(userAuthorContextObj);
  const [editArticleStatus, setEditArticleStatus] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [currentArticle,setCurrentArticle]=useState(state)
  const [commentStatus,setCommentStatus]=useState('')
  //edit article
  function enableEdit() {
    setEditArticleStatus(true);
  }

  async function onSave(modifiedArticle) {
    try {
      const articleAfterChanges = { ...state, ...modifiedArticle };
      const token = await getToken();
      const currentDate = new Date();
      articleAfterChanges.dateOfModification = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()} ${currentDate.toLocaleTimeString("en-US", { hour12: true })}`;

      const res = await axios.put(
        `http://localhost:3000/author-api/article/${articleAfterChanges.articleId}`,
        articleAfterChanges,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.message === 'article modified') {
        setEditArticleStatus(false);
       // navigate(`/author-profile/${email}/article/${articleObj.articleId}`,{state:articleObj});
      }
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Failed to update the article. Please try again.');
    }
  }

  if (!state) {
    return <p className="alert alert-danger">No article found!</p>;
  }

   //delete article
  async function deleteArticle(){
 state.isArticleActive=false;
 let res=await axios.put(`http://localhost:3000/author-api/articles/${state.articleId}`,state)
 if(res.data.message==='article deleted or restored'){
   setCurrentArticle(res.data.payload)
 }
   }

   //restore article
  async function restoreArticle(){
 state.isArticleActive=true;
 let res=await axios.put(`http://localhost:3000/author-api/articles/${state.articleId}`,state)
 if(res.data.message==='article deleted or restored'){
  setCurrentArticle(res.data.payload)
 }
   }

//add comment
async function addComment(commentObj){
  //add name of user to comment
  commentObj.nameOfUser=currentUser.firstName;
  console.log(commentObj);
  //http put
  let res=await axios.put(`http://localhost:3000/user-api/comment/${currentArticle.articleId}`,commentObj)
  if(res.data.message==='comment added'){
    setCommentStatus(res.data.message)
  }
}
  return (
    <div className="container mt-4">
      {editArticleStatus ? (
        <form className="card p-4 shadow-sm" onSubmit={handleSubmit(onSave)}>
          <h2 className="text-center text-warning">Edit Article</h2>
          <div className="mb-3">
            <label className="form-label fw-bold">Title</label>
            <input type="text" className="form-control" defaultValue={state.title} {...register("title")} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Category</label>
            <input type="text" className="form-control" defaultValue={state.category} {...register("category")} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Content</label>
            <textarea className="form-control" rows="5" defaultValue={state.content} {...register("content")} />
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-success px-4">Save</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditArticleStatus(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
        <div className="article-title-card">
  <h1 className="article-title">{state.title}</h1>
</div>

<div className="article-date-card">
  <p className="article-date">📅 Created: {state.dateOfCreation}</p>
  <p className="article-date">📝 Modified: {state.dateOfModification}</p>
</div>



          {/* <div className="d-flex justify-content-between align-items-center mb-3">
            <h1>{state.title}</h1>
            <span className="text-secondary">
              <small>Created on: {state.dateOfCreation}</small> <br />
              <small>Modified on: {state.dateOfModification}</small>
            </span>
          </div> */}
          <div className="text-center mb-4">
            <img src={state.authorData.profileImageUrl} width="60px" className="rounded-circle" alt="Author" />
            <p className="mt-2 text-secondary">{state.authorData.nameOfAuthor}</p>
          </div>
          {currentUser && currentUser.role === 'author' && currentUser.email === state.authorData.email && (
       <div className="d-flex mb-3">
          <button className="me-2 btn btn-light" onClick={enableEdit}>
            <FaEdit className="text-warning" />
              </button>
              {state.isArticleActive ? (
                <button className="me-2 btn btn-light" onClick={deleteArticle}>
                <MdDelete className="text-danger" />
                </button>
               ) : (
               <button className="me-2 btn btn-light" onClick={restoreArticle}>
               <MdRestore className="text-info" />
               </button>
               )}
        </div>
              )}

          <div className="card p-4 shadow-sm">
            <p className="lead">{state.content}</p>
          </div>
          <div className="comments my-4">
            {state.comments?.length === 0 ? (
              <p className="alert alert-warning text-center">No comments yet.</p>
            ) : (
              state.comments.map((commentObj) => (
                <div key={commentObj._id} className="comment-box border rounded p-2 my-2">
                  <p className="fw-bold">{commentObj?.nameOfUser}</p>
                  <p className="text-muted">{commentObj?.comment}</p>
                </div>
              ))
            )}
          </div>
          {/**comment form */}
          <h6>Comment added</h6>
          {currentUser.role === 'user' && (
         <form onSubmit={handleSubmit(addComment)}>
         <input type="text" {...register("comment")} className="form-control mb-4" />
         <button className="btn btn-success">
         Add a comment
        </button>
        </form>
            )}

        </>
      )}
    </div>
  );
}

export default ArticleByID;
