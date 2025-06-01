import React from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';

function ProfileSettingsForm({
  formData,
  editMode,
  onInputChange,
  onSave,
  onCancel,
  onEditMode,
  loading,
  error,
  message
}) {
  return (
    <>
      {message && <Alert variant="success" className="alert-success-custom">{message}</Alert>}
      {error && <Alert variant="danger" className="alert-danger-custom">{error}</Alert>}

      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username || ''}
                onChange={onInputChange}
                disabled={!editMode}
                className="form-control-custom"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={onInputChange}
                disabled={!editMode}
                className="form-control-custom"
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label className="form-label-custom">Password</Form.Label>
          <Form.Control
            type="password"
            value="••••••••••••••••••••"
            disabled
            className="form-control-custom"
          />
          <Form.Text className="text-muted">
            Contact support to change your password
          </Form.Text>
        </Form.Group>

        <div className="d-flex gap-2">
          {!editMode ? (
            <Button 
              className="btn-main w-100"
              onClick={onEditMode}
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button 
                variant="outline-secondary"
                className="btn-cancel flex-fill"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                className="btn-success-custom flex-fill"
                onClick={onSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
        </div>
      </Form>
    </>
  );
}

export default ProfileSettingsForm;