import React from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import "../../styles/filterMenu/allergy-selector.css";

const allergies = [
  "Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood",
  "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"
];

function AllergySelector({ selected = [], onSelect }) {
  function toggleAllergy(allergy) {
    onSelect(
      selected.includes(allergy)
        ? selected.filter((a) => a !== allergy)
        : [...selected, allergy]
    );
  }

  return (
  <div className="allergy-selector">
    <h6 className="mt-3">Allergies</h6>
    <ButtonGroup className="mb-3 w-100 flex-wrap">
      {allergies.map((allergy) => (
        <ToggleButton
          key={allergy}
          id={`allergy-${allergy}`}
          type="checkbox"
          variant={selected.includes(allergy) ? "danger" : "outline-danger"}
          value={allergy}
          checked={selected.includes(allergy)}
          onChange={() => toggleAllergy(allergy)}
          className="me-2 mb-2"
        >
          {allergy}
        </ToggleButton>
      ))}
    </ButtonGroup>
  </div>
);

}

export default AllergySelector;