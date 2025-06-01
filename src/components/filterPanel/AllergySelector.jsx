import React from "react";
import { ButtonGroup, ToggleButton, Row, Col, Alert } from "react-bootstrap";
import "../../styles/filterMenu/allergy-selector.css";

const allergies = [
  { name: "Dairy", icon: "🥛", description: "Milk, cheese, yogurt, butter" },
  { name: "Egg", icon: "🥚", description: "Eggs and egg-based products" },
  { name: "Gluten", icon: "🌾", description: "Wheat, barley, rye products" },
  { name: "Grain", icon: "🌾", description: "All grain-based products" },
  { name: "Peanut", icon: "🥜", description: "Peanuts and peanut products" },
  { name: "Seafood", icon: "🐟", description: "Fish and seafood products" },
  { name: "Sesame", icon: "🌰", description: "Sesame seeds and oil" },
  { name: "Shellfish", icon: "🦐", description: "Crab, lobster, shrimp" },
  { name: "Soy", icon: "🫘", description: "Soybeans and soy products" },
  { name: "Sulfite", icon: "⚗️", description: "Sulfur dioxide preservatives" },
  { name: "Tree Nut", icon: "🌰", description: "Almonds, walnuts, cashews" },
  { name: "Wheat", icon: "🌾", description: "Wheat-based products" }
];

function AllergySelector({ selected = [], onSelect, userAllergies = [], showDescriptions = false }) {
  function toggleAllergy(allergyName) {
    onSelect(
      selected.includes(allergyName)
        ? selected.filter((a) => a !== allergyName)
        : [...selected, allergyName]
    );
  }

  return (
    <div className="allergy-selector">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="mb-0">Select Your Allergies & Restrictions</h6>
        {selected.length > 0 && (
          <small className="text-muted">
            {selected.length} selected
          </small>
        )}
      </div>
      
      {selected.length > 0 && (
        <Alert variant="warning" className="mb-3">
          <small>
            <strong>⚠️ Safety Notice:</strong> Recipes containing {selected.join(', ')} will be automatically filtered out. 
            Always verify ingredients before consuming any recipe.
          </small>
        </Alert>
      )}

      <Row className="g-2">
        {allergies.map((allergy) => {
          const isSelected = selected.includes(allergy.name);
          const isUserAllergy = userAllergies.includes(allergy.name);
          
          return (
            <Col xs={12} sm={6} md={4} key={allergy.name}>
              <div className="allergy-card">
                <ToggleButton
                  id={`allergy-${allergy.name}`}
                  type="checkbox"
                  variant={isSelected ? "danger" : "outline-danger"}
                  value={allergy.name}
                  checked={isSelected}
                  onChange={() => toggleAllergy(allergy.name)}
                  className={`w-100 text-start allergy-button ${isSelected ? 'selected' : ''}`}
                >
                  <div className="d-flex align-items-start">
                    <span className="allergy-icon me-2">{allergy.icon}</span>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center">
                        <strong className="allergy-name">{allergy.name}</strong>
                        {isUserAllergy && (
                          <small className="ms-1 user-indicator" title="From your profile">
                            👤
                          </small>
                        )}
                      </div>
                      {showDescriptions && (
                        <small className="text-muted allergy-description">
                          {allergy.description}
                        </small>
                      )}
                    </div>
                  </div>
                </ToggleButton>
              </div>
            </Col>
          );
        })}
      </Row>

      {selected.length === 0 && (
        <div className="text-center mt-3 p-3 bg-light rounded">
          <p className="text-muted mb-1">
            <strong>No allergies selected</strong>
          </p>
          <small className="text-muted">
            Select any allergies or dietary restrictions to automatically filter them out of your recipe searches.
          </small>
        </div>
      )}

      {selected.length > 0 && (
        <div className="mt-3 p-3 bg-success bg-opacity-10 rounded">
          <h6 className="text-success mb-2">
            <span className="me-2">✅</span>
            Active Filters ({selected.length})
          </h6>
          <div className="d-flex flex-wrap gap-1">
            {selected.map((allergy) => {
              const allergyData = allergies.find(a => a.name === allergy);
              return (
                <span key={allergy} className="badge bg-danger">
                  {allergyData?.icon} {allergy}
                </span>
              );
            })}
          </div>
          <small className="text-muted mt-2 d-block">
            These ingredients will be automatically excluded from your recipe searches.
          </small>
        </div>
      )}
    </div>
  );
}

export default AllergySelector;