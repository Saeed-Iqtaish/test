import React from 'react';
import { Card, Form, Alert } from 'react-bootstrap';
import AllergySelector from '../../filterPanel/AllergySelector';

function DietaryRestrictionsCard({
  allergies,
  editMode,
  onAllergyChange
}) {
  return (
    <Card className="mb-4">
      <Card.Header className="bg-light">
        <h6 className="mb-0 d-flex align-items-center">
          <span className="me-2">🚫</span>
          Dietary Restrictions and Allergies
        </h6>
      </Card.Header>
      <Card.Body>
        <Form.Text className="text-muted mb-3 d-block">
          Select your allergies and dietary restrictions. These will be automatically filtered out when you browse recipes to ensure your safety and preferences.
        </Form.Text>
        
        <div className={editMode ? '' : 'pe-none opacity-75'}>
          <AllergySelector
            selected={allergies}
            onSelect={onAllergyChange}
            userAllergies={allergies}
          />
        </div>
        
        {!editMode && allergies.length === 0 && (
          <Alert variant="info" className="mt-3 mb-0">
            <small>
              <strong>No allergies selected.</strong> You can add your allergies to automatically filter out recipes that may contain allergens.
            </small>
          </Alert>
        )}
        
        {!editMode && allergies.length > 0 && (
          <Alert variant="success" className="mt-3 mb-0">
            <small>
              <strong>Active allergy filters:</strong> {allergies.join(', ')}
              <br />
              <em>These ingredients will be automatically filtered out when browsing recipes.</em>
            </small>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}

export default DietaryRestrictionsCard;