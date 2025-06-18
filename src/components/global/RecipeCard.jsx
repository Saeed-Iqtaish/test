import React, { useState, useEffect, useCallback } from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { FiEdit3 } from "react-icons/fi";
import MoodBadge from "./MoodBadge";
import RecipeNotesModal from "../favorites/RecipeNotesModal";
import FavoriteButton from './FavoriteButton';
import RatingDisplay from "../ratings/RatingDisplay";
import { AuthModal } from "../auth/AuthModal";
import { notesAPI } from "../../services/api";
import "../../styles/global/recipe-card.css";

function RecipeCard({ 
  recipe, 
  isCommunityRecipe = false, 
  isFavoritesPage = false,
  onClick,
  onFavoriteChange 
}) {
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userNote, setUserNote] = useState("");

  const isActuallyCommunityRecipe = isCommunityRecipe || recipe.isCommunityRecipe || false;

  const fetchUserNote = useCallback(async () => {
    try {
      const response = await notesAPI.getNotes(recipe.id, isActuallyCommunityRecipe);
      if (response.data.length > 0) {
        setUserNote(response.data[0].note);
      }
    } catch (error) {
      console.error("Error fetching note:", error);
    }
  }, [recipe.id, isActuallyCommunityRecipe]);

  useEffect(() => {
    if (isFavoritesPage) {
      fetchUserNote();
    }
  }, [recipe.id, isFavoritesPage, fetchUserNote]);

  const handleNoteSaved = (note) => {
    setUserNote(note);
    setShowNotesModal(false);
  };

  const handleLoginRequired = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const title = recipe.title;
  const image = isActuallyCommunityRecipe
    ? (recipe.image_data ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/community/${recipe.id}/image` : null)
    : recipe.image;
  const prepTime = isActuallyCommunityRecipe ? `${recipe.prep_time || 'N/A'} mins` : `${recipe.readyInMinutes} mins`;
  const servings = isActuallyCommunityRecipe ? recipe.servings || 'N/A' : recipe.servings;
  const mood = recipe.mood || "Happy";

  const creatorName = isActuallyCommunityRecipe
    ? (recipe.created_by_username || "Anonymous")
    : null;

  const getCardClass = () => {
    let baseClass = "flex-fill shadow-sm h-100";
    if (isActuallyCommunityRecipe) {
      baseClass = `community-recipe-card ${baseClass}`;
    }
    if (isFavoritesPage) {
      baseClass = `favorite-recipe-card ${baseClass}`;
    }
    return baseClass;
  };

  const handleClick = () => {
    if (onClick) {
      onClick(recipe);
    }
  };

  const showFavoriteButton = () => {
    return true;
  };

  const isClickable = () => {
    return onClick !== undefined;
  };

  return (
    <>
      <Card
        className={`${getCardClass()} ${isClickable() ? 'clickable-card' : ''}`}
        onClick={isClickable() ? handleClick : undefined}
        style={{ cursor: isClickable() ? 'pointer' : 'default' }}
      >
        {image ? (
          <Card.Img
            variant="top"
            src={image}
            alt={title}
            className="card-img-top"
            style={{ objectFit: "cover", height: "200px" }}
            onError={(e) => {
              console.error('Error loading recipe card image:', e.target.src);
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center bg-light"
            style={{ height: "200px" }}
          >
            <span className="text-muted">No Image Available</span>
          </div>
        )}

        <Card.Body className="d-flex flex-column">
          <div className="d-flex justify-content-between mb-2 align-items-start">
            <MoodBadge mood={mood} />
            <div className="d-flex align-items-center gap-2">
              {isActuallyCommunityRecipe && (
                <RatingDisplay
                  recipeId={recipe.id}
                  isCommunityRecipe={true}
                  size="xs"
                  className="rating-on-card"
                />
              )}
              {showFavoriteButton() && (
                <div onClick={(e) => e.stopPropagation()}>
                  <FavoriteButton 
                    recipeId={recipe.id}
                    isCommunityRecipe={isActuallyCommunityRecipe}
                    onFavoriteChange={onFavoriteChange}
                    onLoginRequired={handleLoginRequired}
                  />
                </div>
              )}
            </div>
          </div>

          <Card.Title as="h6" className="recipe-title">
            {title}
          </Card.Title>

          {isActuallyCommunityRecipe && !isFavoritesPage && (
            <>
              <Card.Text className="text-muted" style={{ fontSize: "0.85rem" }}>
                Prep Time: {prepTime} &bull; Servings: {servings}
              </Card.Text>

              <div className="recipe-meta-info mt-auto">
                <small className="recipe-creator">
                  <strong>By:</strong>{" "}
                  <span 
                    className={recipe.created_by_username === "Anonymous" ? "text-muted" : ""}
                    style={{ 
                      fontStyle: recipe.created_by_username === "Anonymous" ? "italic" : "normal" 
                    }}
                  >
                    {creatorName}
                  </span>
                </small>
              </div>
            </>
          )}

          {isFavoritesPage && (
            <>
              <Card.Text className="recipe-description text-muted">
                {recipe.summary ? 
                  recipe.summary.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : 
                  'A delicious recipe to try!'
                }
              </Card.Text>

              <Card.Text className="recipe-meta text-muted">
                <strong>Prep Time:</strong> {prepTime} • <strong>Servings:</strong> {servings}
              </Card.Text>

              {!isActuallyCommunityRecipe && (
                <div className="mb-3">
                  {recipe.diets?.slice(0, 2).map((diet) => (
                    <Badge key={diet} bg="success" className="me-1 mb-1">
                      {diet}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="mb-3">
                <Badge bg={isActuallyCommunityRecipe ? "info" : "primary"} className="me-1">
                  {isActuallyCommunityRecipe ? "Community Recipe" : "Spoonacular Recipe"}
                </Badge>
              </div>

              <div className="notes-section mt-auto">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="notes-title mb-0">Notes</h6>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 edit-note-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNotesModal(true);
                    }}
                  >
                    <FiEdit3 size={16} />
                  </Button>
                </div>
                <div className="notes-content">
                  {userNote ? (
                    <p className="user-note">{userNote}</p>
                  ) : (
                    <p className="no-notes text-muted">Add notes</p>
                  )}
                </div>
              </div>
            </>
          )}

          {!isActuallyCommunityRecipe && !isFavoritesPage && (
            <>
              <Card.Text className="text-muted" style={{ fontSize: "0.85rem" }}>
                Prep Time: {prepTime} &bull; Servings: {servings}
              </Card.Text>

              <div className="mt-2">
                {recipe.diets?.map(function (diet) {
                  return (
                    <Badge key={diet} bg="success" className="me-1">
                      {diet}
                    </Badge>
                  );
                })}
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      <AuthModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {isFavoritesPage && (
        <RecipeNotesModal
          show={showNotesModal}
          onHide={() => setShowNotesModal(false)}
          recipe={recipe}
          currentNote={userNote}
          onNoteSaved={handleNoteSaved}
          isCommunityRecipe={isActuallyCommunityRecipe}
        />
      )}
    </>
  );
}

export default RecipeCard;