import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { communityAPI } from "../../services/api";

function AdminStats({ refreshTrigger }) {
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    total: 0,
    loading: true
  });

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      
      const pendingResponse = await communityAPI.getPendingRecipes();
      const pendingCount = pendingResponse.data.length;
      
      const allResponse = await communityAPI.getRecipes();
      const approvedCount = allResponse.data.length;
      
      setStats({
        pending: pendingCount,
        approved: approvedCount,
        total: pendingCount + approvedCount,
        loading: false
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  if (stats.loading) {
    return (
      <Row className="mb-4">
        <Col>
          <div className="text-center">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading stats...</span>
            </div>
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <Row className="mb-4 admin-stats">
      <Col md={4}>
        <Card className="stat-card pending-card">
          <Card.Body className="text-center">
            <div className="stat-icon">⏳</div>
            <h3 className="stat-number text-warning">{stats.pending}</h3>
            <p className="stat-label mb-0">Pending Approval</p>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={4}>
        <Card className="stat-card approved-card">
          <Card.Body className="text-center">
            <div className="stat-icon">✅</div>
            <h3 className="stat-number text-success">{stats.approved}</h3>
            <p className="stat-label mb-0">Approved Recipes</p>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={4}>
        <Card className="stat-card total-card">
          <Card.Body className="text-center">
            <div className="stat-icon">📊</div>
            <h3 className="stat-number text-primary">{stats.total}</h3>
            <p className="stat-label mb-0">Total Submissions</p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default AdminStats;