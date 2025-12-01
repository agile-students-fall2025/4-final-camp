import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Protected({ children, allowedRoles }) {
  const { isAuthenticated, role, initializing } = useAuth();

  if (initializing) {
    return <div className="p-6 text-center text-gray-500">Loading session...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="p-8 max-w-md mx-auto text-center bg-white shadow rounded">
        <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
        <p className="text-gray-600 text-sm">Please sign in to access this section.</p>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="p-8 max-w-md mx-auto text-center bg-white shadow rounded">
        <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
        <p className="text-gray-600 text-sm">Your role does not permit viewing this content.</p>
      </div>
    );
  }

  return <>{children}</>;
}
