import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import CreateRecipeForm from "./CreateRecipeForm";
import "../../../styles/community/create-recipe-modal.css";

function CreateRecipeModal({ show, onHide, onSuccess }) {
  const [error, setError] = useState("");

  function handleSuccess() {
    setError("");
    onSuccess();
  }

  function handleError(errorMessage) {
    setError(errorMessage);
  }

  function handleClose() {
    setError("");
    onHide();
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" className="create-recipe-modal">
      <Modal.Header closeButton>
        <Modal.Title>Create New Recipe</Modal.Title>
      </Modal.Header>
      
      <CreateRecipeForm
        onSuccess={handleSuccess}
        onError={handleError}
        onCancel={handleClose}
        error={error}
      />
    </Modal>
  );
}

export default CreateRecipeModal;