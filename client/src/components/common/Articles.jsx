import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {useAuth} from '@clerk/clerk-react'
import '../styling/Articles.css';
function Articles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {getToken}=useAuth();
  const { email } = useParams(); // Get user email from URL params
 
  // Fetch all articles
  async function getArticles() {
    try {
      const token=await getToken()
      //make authentication req
      let res = await axios.get('http://localhost:3000/author-api/articles',{
        headers:{
        Authorization:`Bearer ${token}`
      }
      });

      if (res.data.message === 'articles') {
        setArticles(res.data.payload);
      } else {
        setError(res.data.message);
      }
    } catch (error) {
      setError('Failed to fetch articles');
      console.error(error);
    }
  }

  // Navigate to specific article (Fixed Absolute Path)
  function gotoArticleById(articleObj) {
    navigate(`/author-profile/${email}/article/${articleObj.articleId}`,{state:articleObj});
  }

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <div className='container mt-4'>
      {error && <p className="alert alert-danger">{error}</p>}
      <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3'>
        {articles.length > 0 ? (
          articles.map((articleObj) => (
            <div className='col mb-4' key={articleObj.articleId}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="author-details text-end">
                    <img
                      src={articleObj.authorData.profileImageUrl}
                      width='40px'
                      className='rounded-circle'
                      alt="Author"
                    />
                    <p>
                      <small className='text-secondary'>
                        {articleObj.authorData.nameOfAuthor}
                      </small>
                    </p>
                  </div>
                  <h5 className='card-title'>{articleObj.title}</h5>
                  <p className='card-text'>
                    {articleObj.content.substring(0, 80) + "..."}
                  </p>
                  <button
                    className='btn btn-primary'
                    onClick={() => gotoArticleById(articleObj)}
                  >
                    Read More
                  </button>
                </div>
                <div className="card-footer">
                  <small className="text-body-secondary">
                    Last Updated on {articleObj.dateOfModification}
                  </small>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No articles found.</p>
        )}
      </div>
    </div>
  );
}

export default Articles;
