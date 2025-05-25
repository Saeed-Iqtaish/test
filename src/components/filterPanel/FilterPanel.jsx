import React from "react";
import {Button, Collapse } from "react-bootstrap";
import MoodSelector from "./MoodSelector";
import DietSelector from "./DietSelector";
import AllergySelector from "./AllergySelector";
import "../../styles/filterMenu/mood-selector.css";

function FilterPanel({ show, filters, setFilters, onApply, onClear }) {
  function updateField(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <Collapse in={show}>
      <div className="p-3 border rounded bg-light mt-3">
        <MoodSelector selected={filters.mood} onSelect={(v) => updateField("mood", v)} />
        <DietSelector selected={filters.diet} onSelect={(v) => updateField("diet", v)} />
        <AllergySelector selected={filters.allergy} onSelect={(v) => updateField("allergy", v)} />

        <div className="d-flex justify-content-end mt-3 gap-2">
          <Button variant="outline-secondary" onClick={onClear}>
            Clear
          </Button>
          <Button variant="primary" onClick={onApply}>
            Apply
          </Button>
        </div>
      </div>
    </Collapse>
  );
}

export default FilterPanel;