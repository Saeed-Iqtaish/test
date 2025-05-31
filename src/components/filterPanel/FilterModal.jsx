import React from "react";
import { Modal, Button, Alert, Row, Col } from "react-bootstrap";
import MoodSelector from "./MoodSelector";
import DietSelector from "./DietSelector";
import AllergySelector from "./AllergySelector";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/filterMenu/filter-modal.css";

function FilterModal({ 
  show, 
  onHide,
  filters, 
  setFilters, 
  onApply, 
  onClear, 
  userAllergies = [] 
}) {
  const { isAuthenticated } = useAuth();

  function updateField(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  const hasUserAllergies = isAuthenticated && userAllergies.length > 0;

  const handleApply = () => {
    onApply();
    onHide();
  };

  const handleClear = () => {
    onClear();
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      size="lg"
      className="filter-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Filter Recipes</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {/* User Allergy Info */}
        {hasUserAllergies && (
          <Alert variant="info" className="mb-3">
            <small>
              <strong>Auto-filtered allergies:</strong> {userAllergies.join(", ")}
              <br />
              <em>Your profile allergies are automatically filtered out. You can add more below.</em>
            </small>
          </Alert>
        )}

        <Row>
          <Col md={12}>
            <MoodSelector 
              selected={filters.mood} 
              onSelect={(v) => updateField("mood", v)} 
            />
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <DietSelector 
              selected={filters.diet} 
              onSelect={(v) => updateField("diet", v)} 
            />
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <AllergySelector 
              selected={filters.allergy} 
              onSelect={(v) => updateField("allergy", v)}
              userAllergies={userAllergies}
            />
          </Col>
        </Row>
      </Modal.Body>
      
      <Modal.Footer className="d-flex justify-content-between">
        <Button 
          variant="outline-secondary" 
          onClick={handleClear}
        >
          {hasUserAllergies ? "Reset to Profile" : "Clear All"}
        </Button>
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default FilterModal;