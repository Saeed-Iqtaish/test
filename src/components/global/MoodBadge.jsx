import React from "react";
import { Badge } from "react-bootstrap";
import "../../styles/global/mood-badge.css"

function MoodBadge({ mood }) {
  return (
    <Badge className={`text-capitalize badge-${mood?.toLowerCase()}`}>
      {mood}
    </Badge>
  );
}

export default MoodBadge;