import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';
import { User, Bookmark, FileText, Settings, LogOut, Star, Edit3, Save } from 'lucide-react';
import ScholarshipCard from '../components/ScholarshipCard';
import { supabase } from '../supabaseClient';

const UserProfile = () => {
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: 'Pengguna BeaSite', email: 'user@example.com' });
  const [userPreferences, setUserPreferences] = useState({ currentLevel: '', semester: '', targetLevel: '', major: '' });
  const [allScholarships, setAllScholarships] = useState([]);
  const [loadingReq, setLoadingReq] = useState(false);

  useEffect(() => {
    if (role !== 'applicant') {
      navigate('/login');
    } else {
      const stored = localStorage.getItem('registeredUser');
      if (stored) {
        setUserData(JSON.parse(stored));
      }
      const prefs = localStorage.getItem('userPreferences');
      if (prefs) {
        setUserPreferences(JSON.parse(prefs));
      } else {
        // Prompt to edit if no prefs exist
        setIsEditing(true);
      }
    }
  }, [role, navigate]);

  useEffect(() => {
    if (activeTab === 'saved') {
      if (allScholarships.length === 0 && !loadingReq) {
        const fetchScholarships = async () => {
          setLoadingReq(true);
          try {
            const { data, error } = await supabase.from('scholarships').select('*');
            if (error) throw error;
            const formattedData = data.map(item => ({ ...item, applyUrl: item.applyurl }));
            setAllScholarships(formattedData);
          } catch (err) {
            console.error('Failed to fetch saved scholarships:', err);
          } finally {
            setLoadingReq(false);
          }
        };
        fetchScholarships();
      }
    }
  }, [activeTab, allScholarships.length, loadingReq]);

  if (role !== 'applicant') {
    return null;
  }

  const handleSaveProfile = () => {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    setIsEditing(false);
    alert('Profil berhasil diperbarui!');
  };

  const renderContent = () => {
    if (activeTab === 'profile') {
      return (
        <div className="card animate-fade-in" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Informasi Profil</h2>
            {!isEditing ? (
              <button className="btn btn-outline" onClick={() => setIsEditing(true)} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem' }}>
                <Edit3 size={16} /> Edit Profil
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleSaveProfile} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem' }}>
                <Save size={16} /> Simpan
              </button>
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #10b981' }}>
                Lengkapi profil Anda agar sistem dapat memberikan <strong>Rekomendasi Beasiswa</strong> yang paling akurat!
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Nama Lengkap</label>
              <input type="text" className="search-input" value={userData.name} readOnly style={{ width: '100%', cursor: 'not-allowed', opacity: 0.6 }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email</label>
              <input type="email" className="search-input" value={userData.email} readOnly style={{ width: '100%', cursor: 'not-allowed', opacity: 0.6 }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Pendidikan Saat Ini</label>
              <select className="search-input" value={userPreferences.currentLevel} disabled={!isEditing} onChange={(e) => setUserPreferences({...userPreferences, currentLevel: e.target.value})} style={{ width: '100%', opacity: !isEditing ? 0.6 : 1, cursor: !isEditing ? 'not-allowed' : 'pointer', borderColor: isEditing ? 'var(--accent-cyan)' : 'var(--border-color)' }}>
                <option value="" disabled>Pilih Pendidikan Saat Ini...</option>
                <option value="SMA">SMA / SMK / Sederajat</option>
                <option value="D3">D3 (Diploma)</option>
                <option value="S1">S1 (Sarjana)</option>
                <option value="S2">S2 (Magister)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Semester Saat Ini</label>
              <select className="search-input" value={userPreferences.semester} disabled={!isEditing} onChange={(e) => setUserPreferences({...userPreferences, semester: e.target.value})} style={{ width: '100%', opacity: !isEditing ? 0.6 : 1, cursor: !isEditing ? 'not-allowed' : 'pointer', borderColor: isEditing ? 'var(--accent-cyan)' : 'var(--border-color)' }}>
                <option value="" disabled>Pilih Semester...</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(num => (
                  <option key={num} value={num}>Semester {num}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Target Beasiswa</label>
              <select className="search-input" value={userPreferences.targetLevel} disabled={!isEditing} onChange={(e) => setUserPreferences({...userPreferences, targetLevel: e.target.value})} style={{ width: '100%', opacity: !isEditing ? 0.6 : 1, cursor: !isEditing ? 'not-allowed' : 'pointer', borderColor: isEditing ? 'var(--accent-cyan)' : 'var(--border-color)' }}>
                <option value="" disabled>Pilih Target Beasiswa...</option>
                <option value="D3">D3 (Diploma)</option>
                <option value="D4">D4 (Diploma Terapan)</option>
                <option value="S1">S1 (Sarjana)</option>
                <option value="S2">S2 (Magister)</option>
                <option value="S3">S3 (Doktoral)</option>
                <option value="Postdoc">Postdoc</option>
                <option value="Profesional">Profesional / Sertifikasi</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Minat / Jurusan Impian</label>
              <input type="text" className="search-input" value={userPreferences.major} disabled={!isEditing} onChange={(e) => setUserPreferences({...userPreferences, major: e.target.value})} placeholder="Contoh: Kedokteran, Bisnis..." style={{ width: '100%', opacity: !isEditing ? 0.6 : 1, cursor: !isEditing ? 'not-allowed' : 'text', borderColor: isEditing ? 'var(--accent-cyan)' : 'var(--border-color)' }} />
            </div>
          </div>
        </div>
      );
    } else if (activeTab === 'saved') {
      const user = JSON.parse(localStorage.getItem('registeredUser') || 'null');
      const storageKey = user ? `savedScholarships_${user.id}` : 'savedScholarships';
      const savedIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const savedScholarships = allScholarships.filter(s => savedIds.includes(s.id));

      // Urutkan berdasarkan deadline
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      savedScholarships.sort((a, b) => {
        const dateA = new Date(a.deadline);
        dateA.setHours(0, 0, 0, 0);
        const diffA = Math.ceil((dateA - today) / (1000 * 60 * 60 * 24));

        const dateB = new Date(b.deadline);
        dateB.setHours(0, 0, 0, 0);
        const diffB = Math.ceil((dateB - today) / (1000 * 60 * 60 * 24));

        const isClosedA = diffA < 0;
        const isClosedB = diffB < 0;

        if (isClosedA && !isClosedB) return 1;  // Sudah tutup ditaruh di bawah
        if (!isClosedA && isClosedB) return -1; // Masih buka ditaruh di atas

        return diffA - diffB; // Urut dari hari terdekat ke terjauh
      });

      return (
        <div className="animate-fade-in" key="saved">
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Beasiswa <span className="text-cyan">Tersimpan</span></h2>
            <p style={{ color: 'var(--text-secondary)' }}>Koleksi beasiswa yang Anda simpan untuk dibaca nanti.</p>
          </div>
          
          {loadingReq ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Memuat data beasiswa...</div>
          ) : savedScholarships.length > 0 ? (
            <div className="card-grid">
              {savedScholarships.map(scholarship => (
                <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
              <Bookmark size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Belum Ada Beasiswa Tersimpan</h3>
              <p>Anda belum menyimpan beasiswa apapun. Silakan cari beasiswa yang Anda minati lalu simpan.</p>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/scholarships')}>
                Cari Beasiswa
              </button>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', minHeight: 'calc(100vh - 150px)' }}>
      {/* Profile Header Banner */}
      <div className="card" style={{ padding: '2.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.5rem', backgroundImage: 'linear-gradient(to right, var(--bg-secondary), rgba(14, 165, 233, 0.05))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '2.5rem', boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)' }}>
            {userData.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 700 }}>{userData.name}</h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>{userData.email} • Pelamar</p>
          </div>
        </div>
        <button 
          onClick={async () => {
            await supabase.auth.signOut();
            localStorage.removeItem('role');
            localStorage.removeItem('registeredUser');
            window.location.href = '/';
          }}
          className="btn btn-outline"
          style={{ borderColor: '#ef4444', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
        >
          <LogOut size={18} /> Keluar
        </button>
      </div>

      {/* Horizontal Tabs */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <button 
          onClick={() => setActiveTab('profile')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0', background: 'transparent', border: 'none', color: activeTab === 'profile' ? 'var(--accent-cyan)' : 'var(--text-secondary)', fontWeight: activeTab === 'profile' ? 600 : 500, cursor: 'pointer', whiteSpace: 'nowrap', borderBottom: activeTab === 'profile' ? '3px solid var(--accent-cyan)' : '3px solid transparent', transition: 'all 0.2s', marginBottom: '-1px' }}
        >
          <User size={18} /> Profil Saya
        </button>
        <button 
          onClick={() => setActiveTab('saved')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0', background: 'transparent', border: 'none', color: activeTab === 'saved' ? 'var(--accent-cyan)' : 'var(--text-secondary)', fontWeight: activeTab === 'saved' ? 600 : 500, cursor: 'pointer', whiteSpace: 'nowrap', borderBottom: activeTab === 'saved' ? '3px solid var(--accent-cyan)' : '3px solid transparent', transition: 'all 0.2s', marginBottom: '-1px' }}
        >
          <Bookmark size={18} /> Tersimpan
        </button>
      </div>

      {/* Main Content */}
      <div style={{ minWidth: 0 }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default UserProfile;
