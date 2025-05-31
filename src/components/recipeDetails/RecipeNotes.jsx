import React, { useState, useEffect, useCallback } from "react";
import { Button, Form } from "react-bootstrap";
import { FiEdit3, FiSave, FiX } from "react-icons/fi";
import { notesAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

function RecipeNotes({ recipe, isCommunityRecipe = false }) {
  const { isAuthenticated } = useAuth();
  const [userNote, setUserNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempNote, setTempNote] = useState("");

  const fetchUserNote = useCallback(async () => {
    try {
      const response = await notesAPI.getNotes(recipe.id);
      if (response.data.length > 0) {
        setUserNote(response.data[0].note);
      }
    } catch (error) {
      console.error("Error fetching note:", error);
    }
  }, [recipe.id]);

  useEffect(() => {
    if (isAuthenticated && recipe?.id) {
      fetchUserNote();
    }
  }, [recipe?.id, isAuthenticated, fetchUserNote]);

  const handleEdit = () => {
    setTempNote(userNote);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempNote("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await notesAPI.saveNote(recipe.id, tempNote);
      setUserNote(tempNote);
      setIsEditing(false);
      setTempNote("");
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await notesAPI.deleteNote(recipe.id);
      setUserNote("");
      setIsEditing(false);
      setTempNote("");
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center p-3 bg-light rounded">
        <p className="text-muted mb-0 small">Log in to add personal notes</p>
      </div>
    );
  }

  return (
    <div className="recipe-notes-sidebar">
      {isEditing ? (
        <div>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={4}
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              placeholder="Add notes"
              className="border rounded"
              style={{ fontSize: '0.9rem' }}
            />
          </Form.Group>
          <div className="d-flex gap-2 flex-wrap">
            <Button 
              variant="success" 
              size="sm" 
              onClick={handleSave}
              disabled={loading}
              className="flex-fill"
            >
              <FiSave className="me-1" />
              {loading ? 'Saving...' : 'Save Notes'}
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleCancel}
              disabled={loading}
              className="flex-fill"
            >
              <FiX className="me-1" />
              Cancel
            </Button>
          </div>
          {userNote && (
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={handleDelete}
              disabled={loading}
              className="w-100 mt-2"
            >
              Delete Note
            </Button>
          )}
        </div>
      ) : (
        <div className="notes-display">
          {userNote ? (
            <div className="user-note-display p-3 bg-light rounded position-relative">
              <p className="mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                {userNote}
              </p>
              <Button
                variant="link"
                size="sm"
                onClick={handleEdit}
                className="position-absolute top-0 end-0 p-1 text-muted"
                style={{ fontSize: '0.8rem' }}
              >
                <FiEdit3 size={14} />
              </Button>
            </div>
          ) : (
            <div 
              className="no-notes-placeholder p-3 bg-light rounded text-center cursor-pointer"
              onClick={handleEdit}
              style={{ cursor: 'pointer' }}
            >
              <p className="text-muted mb-2 small">Add notes</p>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={handleEdit}
              >
                <FiEdit3 className="me-1" />
                Add Notes
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RecipeNotes;