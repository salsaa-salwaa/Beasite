import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';
import AdminPanel from '../components/AdminPanel';
import UserPanel from '../components/UserPanel';
import { BookOpen, Users, LayoutDashboard, LogOut } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Dashboard = () => {
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState('scholarships');
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/login');
    }
  }, [role, navigate]);

  if (role !== 'admin') {
    return null;
  }

  const renderContent = () => {
    if (activeTab === 'scholarships') {
      return (
        <div className="animate-fade-in" key="scholarships">
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Kelola <span className="text-cyan">Beasiswa</span></h2>
            <p style={{ color: 'var(--text-secondary)' }}>Tambah, ubah, dan hapus informasi beasiswa.</p>
          </div>
          <AdminPanel />
        </div>
      );
    } else if (activeTab === 'users') {
      return (
        <div className="animate-fade-in" key="users">
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Kelola <span className="text-cyan">Pengguna</span></h2>
            <p style={{ color: 'var(--text-secondary)' }}>Daftar pengguna dan pengaturan akses.</p>
          </div>
          <UserPanel />
        </div>
      );
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', minHeight: 'calc(100vh - 150px)' }}>
      <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Sidebar */}
        <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <LayoutDashboard className="text-cyan" size={24} />
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Admin Panel</h2>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              onClick={() => setActiveTab('scholarships')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                borderRadius: '0.5rem', border: 'none', background: activeTab === 'scholarships' ? 'var(--accent-cyan-light)' : 'transparent',
                color: activeTab === 'scholarships' ? 'var(--accent-cyan)' : 'var(--text-primary)',
                fontWeight: activeTab === 'scholarships' ? 600 : 500,
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                fontFamily: 'inherit', fontSize: '1rem', width: '100%'
              }}
              className={activeTab !== 'scholarships' ? 'sidebar-btn-hover' : ''}
            >
              <BookOpen size={20} />
              Beasiswa
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                borderRadius: '0.5rem', border: 'none', background: activeTab === 'users' ? 'var(--accent-cyan-light)' : 'transparent',
                color: activeTab === 'users' ? 'var(--accent-cyan)' : 'var(--text-primary)',
                fontWeight: activeTab === 'users' ? 600 : 500,
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                fontFamily: 'inherit', fontSize: '1rem', width: '100%'
              }}
              className={activeTab !== 'users' ? 'sidebar-btn-hover' : ''}
            >
              <Users size={20} />
              Pengguna
            </button>
            
            <div style={{ margin: '1rem 0', height: '1px', backgroundColor: 'var(--border-color)' }}></div>
            
            <button 
              onClick={async () => {
                await supabase.auth.signOut();
                localStorage.removeItem('role');
                localStorage.removeItem('registeredUser');
                window.location.href = '/';
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                borderRadius: '0.5rem', border: 'none', background: 'transparent',
                color: '#ef4444', fontWeight: 500, cursor: 'pointer', textAlign: 'left',
                fontFamily: 'inherit', fontSize: '1rem', width: '100%', transition: 'all 0.2s'
              }}
              className="sidebar-btn-hover"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <LogOut size={20} />
              Keluar (Logout)
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ minWidth: 0 }}>
          {renderContent()}
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .sidebar-btn-hover:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
        [data-theme='light'] .sidebar-btn-hover:hover {
          background-color: rgba(0, 0, 0, 0.05) !important;
        }
        @media (max-width: 768px) {
          .dashboard-layout {
            grid-template-columns: 1fr !important;
          }
          .dashboard-layout > .card {
            position: static !important;
            margin-bottom: 2rem;
          }
        }
      `}} />
    </div>
  );
};

export default Dashboard;
