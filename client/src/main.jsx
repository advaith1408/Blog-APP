import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Rootlayout from './components/Rootlayout.jsx';
import Home from './components/common/Home.jsx';
import Signin from './components/common/Signin.jsx';
import Signup from './components/common/Signup.jsx';
import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import Articles from './components/common/Articles.jsx';
import ArticleByID from './components/common/ArticleByID.jsx';
import UserProfile from './components/user/UserProfile.jsx';
import AuthorProfile from './components/author/AuthorProfile.jsx';
import PostArticle from './components/author/PostArticle.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import UserAuthorProvider from './contexts/userAuthorContext.jsx'; // ✅ Correct Import

const browserRouterObj = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout />,
    children: [
      { path: "", element: <Home /> },
      { path: "signin", element: <Signin /> },
      { path: "signup", element: <Signup /> },
      {
        path: "user-profile/:email",
        element: <UserProfile />,
        children: [
          { path: "articles", element: <Articles /> },
          { path: "articleId", element: <ArticleByID /> },
          { path: "", element: <Navigate to="articles" /> },
        ],
      },
      {
        path: "author-profile/:email",
        element: <AuthorProfile />,
        children: [
          { path: "articles", element: <Articles /> },
          { path: "article/:articleId", element: <ArticleByID /> },
          { path: "article", element: <PostArticle /> },
          { path: "", element: <Navigate to="articles" /> },
        ],
      }      
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserAuthorProvider> {/* ✅ Wrap RouterProvider inside UserAuthorProvider */}
      <RouterProvider router={browserRouterObj} />
    </UserAuthorProvider>
  </StrictMode>
);
