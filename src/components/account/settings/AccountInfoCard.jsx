import React from 'react';
import { Card } from 'react-bootstrap';

function AccountInfoCard({ user, allergies }) {
  return (
    <Card className="mt-4 info-card">
      <Card.Header className="info-card-header">
        <h5 className="mb-0">Account Information</h5>
      </Card.Header>
      <Card.Body>
        <div className="mb-2">
          <strong>Account Type:</strong> {user?.isAdmin ? 'Administrator' : 'Regular User'}
        </div>
        <div className="mb-2">
          <strong>Member Since:</strong> {new Date().toLocaleDateString()}
        </div>
        {allergies && allergies.length > 0 && (
          <div className="mb-2">
            <strong>Active Allergy Filters:</strong> {allergies.length} selected
            <br />
            <small className="text-muted">
              Recipes containing {allergies.join(', ')} will be automatically filtered out
            </small>
          </div>
        )}
        <div className="mb-0">
          <strong>Auto-filtering:</strong> {allergies?.length > 0 ? 'Enabled' : 'Disabled'}
        </div>
      </Card.Body>
    </Card>
  );
}

export default AccountInfoCard;