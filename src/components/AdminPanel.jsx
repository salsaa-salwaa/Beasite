import React, { useState } from 'react';
import AddScholarshipForm from './AddScholarshipForm';
import ScholarshipList from './ScholarshipList';
import AdminScholarshipDetail from './AdminScholarshipDetail';
import { useRole } from '../hooks/useRole';

const AdminPanel = () => {
  const { role } = useRole();
  const [view, setView] = useState('list'); // 'list', 'form', 'detail'
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  if (role !== 'admin') return null;

  const handleAdd = () => {
    setSelectedScholarship(null);
    setView('form');
  };

  const handleEdit = (scholarship) => {
    setSelectedScholarship(scholarship);
    setView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDetail = (scholarship) => {
    setSelectedScholarship(scholarship);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaved = () => {
    setView('list');
    setSelectedScholarship(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCancel = () => {
    setView('list');
    setSelectedScholarship(null);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
      {view === 'list' && (
        <ScholarshipList 
          key={refreshKey}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDetail={handleDetail}
        />
      )}

      {view === 'form' && (
        <AddScholarshipForm 
          initialData={selectedScholarship} 
          onSaved={handleSaved} 
          onCancel={handleCancel}
        />
      )}

      {view === 'detail' && (
        <AdminScholarshipDetail
          scholarship={selectedScholarship}
          onBack={handleCancel}
        />
      )}
    </div>
  );
};

export default AdminPanel;
