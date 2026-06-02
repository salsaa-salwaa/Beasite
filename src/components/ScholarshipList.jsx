import React, { useEffect, useState } from 'react';
import { Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const ScholarshipList = ({ onEdit, onAdd, onDetail }) => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('scholarships').select('*');
      if (error) throw error;
      const formattedData = data.map(item => ({ ...item, applyUrl: item.applyurl }));
      setScholarships(formattedData);
    } catch (e) {
      console.error('Failed to load scholarships', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus beasiswa ini?')) return;
    try {
      const { error } = await supabase.from('scholarships').delete().eq('id', id);
      if (error) throw error;
      setScholarships((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      alert('Error menghapus');
    }
  };

  if (loading) return <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>Memuat data beasiswa...</div>;

  const totalPages = Math.ceil(scholarships.length / itemsPerPage);
  const currentItems = scholarships.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="card animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 className="card-title" style={{ fontSize: '1.5rem', margin: 0 }}>Daftar Beasiswa</h3>
        <button onClick={onAdd} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <Plus size={18} /> Tambah Baru
        </button>
      </div>
      
      {scholarships.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: '1rem' }}>
          <p>Belum ada data beasiswa.</p>
          <button onClick={onAdd} className="btn btn-outline" style={{ marginTop: '1rem' }}>Tambah Sekarang</button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Judul Beasiswa</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Penyelenggara</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Kategori</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }} className="hover-row">
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500, maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{s.provider}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{s.category || s.level || '-'}</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button 
                        onClick={() => onDetail(s)} 
                        title="Lihat Detail"
                        style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--accent-cyan)', cursor: 'pointer' }}
                        className="action-btn"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => onEdit(s)} 
                        title="Edit"
                        style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}
                        className="action-btn"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(s.id)} 
                        title="Hapus"
                        style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', cursor: 'pointer' }}
                        className="action-btn-danger"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {!loading && scholarships.length > itemsPerPage && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)} 
            className="btn btn-outline"
            style={{ padding: '0.5rem 1rem', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '0.875rem' }}
          >
            Sebelumnya
          </button>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
            Halaman {currentPage} dari {totalPages}
          </span>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => p + 1)} 
            className="btn btn-outline"
            style={{ padding: '0.5rem 1rem', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '0.875rem' }}
          >
            Selanjutnya
          </button>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        .hover-row:hover { background-color: rgba(255, 255, 255, 0.03); }
        [data-theme='light'] .hover-row:hover { background-color: rgba(0, 0, 0, 0.03); }
        .action-btn:hover { background-color: var(--bg-secondary) !important; }
        .action-btn-danger:hover { background-color: rgba(239, 68, 68, 0.15) !important; }
      `}} />
    </div>
  );
};

export default ScholarshipList;
