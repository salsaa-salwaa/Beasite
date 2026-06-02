import React, { useState, useEffect } from 'react';

import { supabase } from '../supabaseClient';

const UserPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  
  const [form, setForm] = useState({ name: '', email: '', role: 'applicant' });
  const [status, setStatus] = useState(null);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      setUsers(data);
    } catch (e) {
      console.error('Failed to load users', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ name: user.name || '', email: user.email || '', role: user.role || 'applicant' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setForm({ name: '', email: '', role: 'applicant' });
    setStatus(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini? (Hanya menghapus profil, user Auth harus dihapus dari Supabase Dashboard)')) return;
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      alert('Error menghapus pengguna');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) {
      setStatus({ type: 'error', text: 'Untuk menambah pengguna baru, silakan gunakan Supabase Dashboard (Menu Authentication) karena membutuhkan password.' });
      return;
    }

    const payload = {
      name: form.name,
      role: form.role
    };

    try {
      const { error } = await supabase.from('profiles').update(payload).eq('id', editingUser.id);
      
      if (!error) {
        setStatus({ type: 'success', text: 'Pengguna berhasil diubah' });
        handleCancelEdit(); // reset form
        fetchUsers(); // refresh list
      } else {
        setStatus({ type: 'error', text: error.message || 'Gagal menyimpan pengguna' });
      }
    } catch (err) {
      setStatus({ type: 'error', text: 'Error jaringan' });
    }
  };

  const inputStyle = { paddingLeft: '1.5rem', width: '100%', borderRadius: '0.75rem' };
  const labelStyle = { display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
      {/* Form */}
      <div className="card animate-fade-in delay-100">
        <h3 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Nama Lengkap</label>
              <input name="name" className="search-input" style={inputStyle} value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input name="email" type="email" className="search-input" style={inputStyle} value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
            </div>
            <div>
              <label style={labelStyle}>Peran (Role)</label>
              <select 
                className="search-input" 
                style={{...inputStyle, paddingRight: '1.5rem', appearance: 'none', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)'}} 
                value={form.role} 
                onChange={(e) => setForm({...form, role: e.target.value})}
              >
                <option value="applicant">Pendaftar Beasiswa (Applicant)</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              {editingUser ? 'Simpan Perubahan' : 'Tambah Pengguna'}
            </button>
            {editingUser && (
              <button type="button" className="btn btn-outline" onClick={handleCancelEdit} style={{ padding: '0.75rem 2rem' }}>
                Batal
              </button>
            )}
          </div>
          {status && (
            <div style={{ 
              padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem',
              backgroundColor: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: status.type === 'success' ? '#10b981' : '#ef4444',
              border: `1px solid ${status.type === 'success' ? '#10b981' : '#ef4444'}`
            }}>
              {status.text}
            </div>
          )}
        </form>
      </div>

      {/* List */}
      <div className="card animate-fade-in delay-200">
        <h3 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Daftar Pengguna</h3>
        
        {loading ? (
           <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Memuat data...</div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Belum ada data pengguna.</div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Nama</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Role</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }} className="hover-row">
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{u.name}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        backgroundColor: u.role === 'admin' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                        color: u.role === 'admin' ? 'var(--accent-cyan)' : 'var(--text-secondary)'
                      }}>
                        {u.role === 'admin' ? 'Admin' : 'Applicant'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleEdit(u)} 
                          className="btn btn-outline"
                          style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}
                        >
                          Edit
                        </button>
                        {u.id !== 'usr-admin1' && (
                          <button 
                            onClick={() => handleDelete(u.id)} 
                            className="btn"
                            style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444' }}
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPanel;
