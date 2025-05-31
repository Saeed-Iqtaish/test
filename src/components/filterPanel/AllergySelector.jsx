import React from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import "../../styles/filterMenu/allergy-selector.css";

const allergies = [
  "Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood",
  "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"
];

function AllergySelector({ selected = [], onSelect, userAllergies = [] }) {
  function toggleAllergy(allergy) {
    onSelect(
      selected.includes(allergy)
        ? selected.filter((a) => a !== allergy)
        : [...selected, allergy]
    );
  }

  return (
    <div className="allergy-selector">
      <h6>Allergies</h6>
      <ButtonGroup className="mb-3 w-100 flex-wrap">
        {allergies.map((allergy) => {
          const isSelected = selected.includes(allergy);
          const isUserAllergy = userAllergies.includes(allergy);
          
          return (
            <ToggleButton
              key={allergy}
              id={`allergy-${allergy}`}
              type="checkbox"
              variant={isSelected ? "danger" : "outline-danger"}
              value={allergy}
              checked={isSelected}
              onChange={() => toggleAllergy(allergy)}
              className={`${isUserAllergy ? 'user-allergy' : ''}`}
              title={isUserAllergy ? "From your profile" : ""}
            >
              {allergy}
              {isUserAllergy && <small className="ms-1">👤</small>}
            </ToggleButton>
          );
        })}
      </ButtonGroup>
    </div>
  );
}

export default AllergySelector;