import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { notesAPI } from "../../services/api";

function RecipeNotesModal({ show, onHide, recipe, currentNote, onNoteSaved }) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      setNote(currentNote || "");
      setError("");
    }
  }, [show, currentNote]);

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      await notesAPI.saveNote(recipe.id, note);
      onNoteSaved(note);
    } catch (error) {
      console.error("Error saving note:", error);
      setError("Failed to save note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      await notesAPI.deleteNote(recipe.id);
      onNoteSaved("");
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("Failed to delete note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" className="recipe-notes-modal">
      <Modal.Header closeButton>
        <Modal.Title>Personal Notes</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <div className="recipe-info mb-3">
          <h6 className="recipe-name">{recipe.title}</h6>
          <p className="text-muted">Add your personal notes, cooking tips, or modifications for this recipe.</p>
        </div>

        <Form.Group>
          <Form.Label>Your Notes</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add your cooking notes, tips, or modifications here..."
            className="notes-textarea"
          />
          <Form.Text className="text-muted">
            Share your experience with this recipe - what worked, what you'd change, or any helpful tips!
          </Form.Text>
        </Form.Group>
      </Modal.Body>
      
      <Modal.Footer className="d-flex justify-content-between">
        <div>
          {currentNote && (
            <Button
              variant="outline-danger"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete Note
            </Button>
          )}
        </div>
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={loading || note === currentNote}
          >
            {loading ? "Saving..." : "Save Notes"}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default RecipeNotesModal;