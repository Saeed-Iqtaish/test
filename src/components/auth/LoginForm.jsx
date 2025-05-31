import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = ({ onSuccess, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3 className="text-center mb-4">Log In</h3>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />
      </Form.Group>

      <Button 
        variant="primary" 
        type="submit" 
        className="w-100 mb-3"
        disabled={loading}
      >
        {loading ? (
          <>
            <Spinner size="sm" className="me-2" />
            Logging in...
          </>
        ) : (
          'Log In'
        )}
      </Button>

      <div className="text-center">
        <span className="text-muted">No account yet? </span>
        <Button 
          variant="link" 
          className="p-0"
          onClick={onSwitchToSignup}
          disabled={loading}
        >
          Sign Up
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;