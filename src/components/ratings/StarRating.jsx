import React, { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

function StarRating({ 
  value = 0, 
  onChange = null, 
  readonly = false, 
  size = 'sm',
  showCount = false,
  totalRatings = 0 
}) {
  const [hoverValue, setHoverValue] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const sizes = {
    xs: '0.75rem',
    sm: '1rem', 
    md: '1.25rem',
    lg: '1.5rem',
    xl: '2rem'
  };

  const iconSize = sizes[size] || sizes.sm;
  const isInteractive = !readonly && onChange;

  const handleClick = (rating) => {
    if (isInteractive) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating) => {
    if (isInteractive) {
      setHoverValue(rating);
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoverValue(0);
      setIsHovering(false);
    }
  };

  const displayValue = isHovering ? hoverValue : value;

  return (
    <div className="d-flex align-items-center gap-1">
      <div className="d-flex align-items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="btn p-0 border-0 bg-transparent"
            disabled={!isInteractive}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            style={{
              cursor: isInteractive ? 'pointer' : 'default',
              color: star <= displayValue ? '#FFD93D' : '#E5E7EB',
              fontSize: iconSize,
              lineHeight: 1,
              marginRight: '0.125rem'
            }}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          >
            {star <= displayValue ? (
              <FaStar />
            ) : (
              <FiStar />
            )}
          </button>
        ))}
      </div>
      
      {readonly && (
        <div className="ms-2 d-flex align-items-center gap-1">
          <span style={{ fontSize: size === 'xs' ? '0.75rem' : '0.875rem' }}>
            {value > 0 ? value.toFixed(1) : '0.0'}
          </span>
          {showCount && totalRatings > 0 && (
            <span 
              className="text-muted" 
              style={{ fontSize: size === 'xs' ? '0.7rem' : '0.75rem' }}
            >
              ({totalRatings} rating{totalRatings !== 1 ? 's' : ''})
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default StarRating;