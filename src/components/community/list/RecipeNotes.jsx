import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useAuth } from '../../../contexts/AuthContext';
import useRecipeNotes from '../../../hooks/useRecipeNotes';

function RecipeNotes({ recipeId }) {
  const { isAuthenticated } = useAuth();
  const {
    userNote,
    isEditing,
    tempNote,
    loading,
    setTempNote,
    saveNote,
    startEditing,
    cancelEditing
  } = useRecipeNotes(recipeId);

  const handleSave = async () => {
    const result = await saveNote(tempNote);
    if (!result.success) {
      alert(result.error || 'Failed to save note');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Card className="mb-4">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Personal Notes</h6>
          {userNote && !isEditing}
        </div>
      </Card.Header>
      <Card.Body>
        {isEditing ? (
          <div className="notes-edit-form">
            <Form.Control
              as="textarea"
              rows={6}
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              placeholder="Add your cooking notes, tips, or modifications here..."
              className="notes-textarea mb-3"
            />
            <div className="d-flex gap-2">
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={loading}
                className="flex-fill"
              >
                {loading ? 'Saving...' : 'Save Notes'}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={cancelEditing}
                disabled={loading}
                className="flex-fill"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div 
            className="notes-display" 
            onClick={startEditing} 
            style={{ cursor: 'pointer', minHeight: '60px' }}
          >
            {userNote ? (
              <div className="user-note" style={{ whiteSpace: 'pre-wrap' }}>
                {userNote}
              </div>
            ) : (
              <div className="add-notes-placeholder text-muted text-center py-3">
                <small>Click to add your personal notes and cooking tips</small>
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default RecipeNotes;