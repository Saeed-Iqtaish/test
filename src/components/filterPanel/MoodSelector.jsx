import React from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import "../../styles/filterMenu/mood-selector.css";

const moods = ["Happy", "Cozy", "Relaxed", "Energetic"];

function MoodSelector({ selected = [], onSelect }) {
  function toggleMood(mood) {
    onSelect(
      selected.includes(mood)
        ? selected.filter((m) => m !== mood)
        : [...selected, mood]
    );
  }

  return (
    <div className="mood-selector">
      <h6>Mood</h6>
      <ButtonGroup className="mb-3 w-100 flex-wrap">
        {moods.map((mood) => (
          <ToggleButton
            key={mood}
            id={`mood-${mood}`}
            type="checkbox"
            value={mood}
            checked={selected.includes(mood)}
            onChange={() => toggleMood(mood)}
            className="me-2 mb-2"
          >
            {mood}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </div>
  );
}

export default MoodSelector;