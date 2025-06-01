import React from 'react';

function CommunityRecipeMeta({ recipe }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!recipe) return null;

  return (
    <div className="recipe-meta mb-4">
      <div className="meta-item mb-2">
        <strong>Prep Time:</strong> {recipe.prep_time ? `${recipe.prep_time} mins` : 'Not specified'} • 
        <strong> Servings:</strong> {recipe.servings ? `${recipe.servings}` : 'Not specified'} • 
        <strong> Created by:</strong> {recipe.created_by_username || 'Anonymous'}
      </div>
      <div className="meta-item">
        <strong>Created:</strong> {formatDate(recipe.created_at)}
        {recipe.updated_at !== recipe.created_at && (
          <span> • <strong>Updated:</strong> {formatDate(recipe.updated_at)}</span>
        )}
      </div>
    </div>
  );
}

export default CommunityRecipeMeta;