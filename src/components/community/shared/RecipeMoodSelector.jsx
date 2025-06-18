import React from "react";
import { Form, ButtonGroup, ToggleButton } from "react-bootstrap";

const moods = [
  { name: "Happy", color: "#FFD93D", description: "Bright, cheerful dishes" },
  { name: "Cozy", color: "#D39C74", description: "Warm, comforting meals" },
  { name: "Relaxed", color: "#CDB4DB", description: "Calm, soothing dishes" },
  { name: "Energetic", color: "#FFAD69", description: "Bold, spicy meals" }
];

function RecipeMoodSelector({ selectedMood, onMoodChange, disabled = false }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Recipe Mood *</Form.Label>
      <Form.Text className="text-muted d-block mb-3">
        Choose the mood that best represents your recipe
      </Form.Text>
      
      <ButtonGroup className="w-100 flex-wrap">
        {moods.map((mood) => (
          <ToggleButton
            key={mood.name}
            id={`recipe-mood-${mood.name}`}
            type="radio"
            variant="outline-primary"
            name="recipe-mood"
            value={mood.name}
            checked={selectedMood === mood.name}
            onChange={(e) => onMoodChange(e.currentTarget.value)}
            disabled={disabled}
            className="mood-option flex-fill mb-2 me-2"
            style={{
              borderColor: mood.color,
              color: selectedMood === mood.name ? 'white' : mood.color,
              backgroundColor: selectedMood === mood.name ? mood.color : 'transparent',
              borderRadius: '12px',
              fontWeight: '600',
              padding: '0.75rem 1rem',
              transition: 'all 0.2s ease',
              minWidth: '120px'
            }}
          >
            <div>
              <div>{mood.name}</div>
              <small style={{ 
                fontSize: '0.75rem', 
                opacity: 0.8,
                display: 'block',
                marginTop: '0.25rem'
              }}>
                {mood.description}
              </small>
            </div>
          </ToggleButton>
        ))}
      </ButtonGroup>
      
      {!selectedMood && (
        <Form.Text className="text-danger">
          Please select a mood for your recipe
        </Form.Text>
      )}
    </Form.Group>
  );
}

export default RecipeMoodSelector;