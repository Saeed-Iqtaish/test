import React from "react";

function AdminHeader({ user }) {
  return (
    <div className="admin-header">
      <div className="header-content">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h1 className="admin-title">
              🛡️ Admin Dashboard
            </h1>
            <p className="admin-subtitle">
              Welcome back, {user?.username}! Manage pending recipe submissions.
            </p>
          </div>
          <div className="admin-badge">
            <span className="badge bg-danger px-3 py-2">
              Administrator
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;