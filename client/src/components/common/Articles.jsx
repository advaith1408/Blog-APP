import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import '../styling/Articles.css';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { email } = useParams();

  async function getArticles() {
    try {
      const token = await getToken();
      let res = await axios.get('http://localhost:3000/author-api/articles', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.message === 'articles') {
        setArticles(res.data.payload);
        setFilteredArticles(res.data.payload);

        // Extract unique categories and authors
        const uniqueCategories = [...new Set(res.data.payload.map(article => article.category))];
        const uniqueAuthors = [...new Set(res.data.payload.map(article => article.authorData.nameOfAuthor))];

        setCategories(uniqueCategories);
        setAuthors(uniqueAuthors);
      } else {
        setError(res.data.message);
      }
    } catch (error) {
      setError('Failed to fetch articles');
      console.error(error);
    }
  }

  function filterArticles() {
    let filtered = articles;
    if (selectedCategory) {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }
    if (selectedAuthor) {
      filtered = filtered.filter(article => article.authorData.nameOfAuthor === selectedAuthor);
    }
    setFilteredArticles(filtered);
  }

  useEffect(() => {
    getArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [selectedCategory, selectedAuthor]);

  function gotoArticleById(articleObj) {
    navigate(`/author-profile/${email}/article/${articleObj.articleId}`, { state: articleObj });
  }

  return (
    <div className='container mt-4'>
      {error && <p className='alert alert-danger'>{error}</p>}
      <div className='d-flex mb-3'>
        <select className='form-select me-2' value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value=''>Filter by Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        <select className='form-select' value={selectedAuthor} onChange={(e) => setSelectedAuthor(e.target.value)}>
          <option value=''>Filter by Author</option>
          {authors.map((author, index) => (
            <option key={index} value={author}>{author}</option>
          ))}
        </select>
      </div>
      <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3'>
        {filteredArticles.length > 0 ? (
          filteredArticles.map((articleObj) => (
            <div className='col mb-4' key={articleObj.articleId}>
              <div className='card h-100 shadow-sm'>
                <div className='card-body'>
                  <div className='author-details text-end'>
                    <img src={articleObj.authorData.profileImageUrl} width='40px' className='rounded-circle' alt='Author' />
                    <p><small className='text-secondary'>{articleObj.authorData.nameOfAuthor}</small></p>
                  </div>
                  <h5 className='card-title'>{articleObj.title}</h5>
                  <p className='card-text'>{articleObj.content.substring(0, 80) + '...'}</p>
                  <button className='btn btn-primary' onClick={() => gotoArticleById(articleObj)}>Read More</button>
                </div>
                <div className='card-footer'>
                  <small className='text-body-secondary'>Last Updated on {articleObj.dateOfModification}</small>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className='text-center'>No articles found.</p>
        )}
      </div>
    </div>
  );
}

export default Articles;
