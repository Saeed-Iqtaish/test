import React from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import "../../styles/filterMenu/diet-selector.css";

const diets = [
  "Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian",
  "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo",
  "Primal", "Low FODMAP", "Whole30"
];

function DietSelector({ selected = [], onSelect }) {
  function handleClick(diet) {
    if (selected[0] === diet) {
      onSelect([]);
    } else {
      onSelect([diet]);
    }
  }

  return (
  <div className="diet-selector">
    <h6 className="mt-3">Diet</h6>
    <ButtonGroup className="mb-3 w-100 flex-wrap">
      {diets.map((diet) => (
        <ToggleButton
          key={diet}
          id={`diet-${diet}`}
          type="checkbox"
          variant={selected[0] === diet ? "success" : "outline-success"}
          value={diet}
          checked={selected[0] === diet}
          onChange={() => handleClick(diet)}
          className="me-2 mb-2"
        >
          {diet}
        </ToggleButton>
      ))}
    </ButtonGroup>
  </div>
);
}

export default DietSelector;