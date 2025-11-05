import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/Posts/PostForm.jsx';

const CreatePostPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // After successful creation, redirect to home
    navigate('/');
  };

  const handleClose = () => {
    // If user cancels, go back to home
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Crear Publicación</h2>
      <PostForm onSave={handleSuccess} onClose={handleClose} />
    </div>
  );
};

export default CreatePostPage;
