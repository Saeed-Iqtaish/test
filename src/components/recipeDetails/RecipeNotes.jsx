import React, { useState, useEffect, useCallback } from "react";
import { Button, Form } from "react-bootstrap";
import { FiEdit3, FiSave, FiX } from "react-icons/fi";
import { notesAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

function RecipeNotes({ recipe }) {
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
      <div className="text-center p-4">
        <p className="text-muted">Log in to add personal notes to this recipe.</p>
      </div>
    );
  }

  return (
    <div className="recipe-notes-section">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6>Personal Notes</h6>
        {!isEditing && (
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={handleEdit}
          >
            <FiEdit3 className="me-1" />
            {userNote ? 'Edit' : 'Add'} Notes
          </Button>
        )}
      </div>

      {isEditing ? (
        <div>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={4}
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              placeholder="Add your cooking notes, tips, or modifications here..."
            />
          </Form.Group>
          <div className="d-flex gap-2">
            <Button 
              variant="success" 
              size="sm" 
              onClick={handleSave}
              disabled={loading}
            >
              <FiSave className="me-1" />
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleCancel}
              disabled={loading}
            >
              <FiX className="me-1" />
              Cancel
            </Button>
            {userNote && (
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={handleDelete}
                disabled={loading}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="notes-content">
          {userNote ? (
            <div className="user-note p-3 bg-light rounded">
              <p className="mb-0">{userNote}</p>
            </div>
          ) : (
            <div className="text-center p-4">
              <p className="text-muted">No notes added yet. Click "Add Notes" to get started!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RecipeNotes;