import React from 'react';
import { Button } from 'react-bootstrap';
import { FiArrowLeft, FiEdit3 } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';

function CommunityRecipeNavigation({ 
  onBackClick, 
  onHomeClick, 
  onEditClick, 
  canEdit = false 
}) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div className="d-flex gap-2">
        <Button 
          className="btn-main"
          onClick={onBackClick}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
            border: 'none',
            color: 'white',
            fontWeight: '600',
            borderRadius: '25px',
            padding: '0.6rem 1.5rem',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(255, 107, 107, 0.3)';
          }}
        >
          <FiArrowLeft /> Back to Community
        </Button>
      </div>
      
      {isAuthenticated && canEdit && (
        <Button
          variant="outline-secondary"
          onClick={onEditClick}
          className="d-flex align-items-center gap-2"
        >
          <FiEdit3 /> Edit Recipe
        </Button>
      )}
    </div>
  );
}

export default CommunityRecipeNavigation;