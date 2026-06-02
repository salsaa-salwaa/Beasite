import React, { useState, useEffect } from 'react';

import { supabase } from '../supabaseClient';

const AddScholarshipForm = ({ initialData = null, onSaved, onCancel }) => {
  const isEdit = !!initialData;
  const [form, setForm] = useState({
    title: '', description: '', deadline: '', applyUrl: '', provider: '', category: '',
    requirements: '', benefits: ''
  });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (isEdit) {
      const { title, description, deadline, applyUrl, provider, category, requirements, benefits } = initialData;
      setForm({
        title: title || '', description: description || '', deadline: deadline || '',
        applyUrl: applyUrl || '', provider: provider || '', category: category || '',
        requirements: (Array.isArray(requirements) ? requirements.join('\n') : requirements) || '',
        benefits: (Array.isArray(benefits) ? benefits.join('\n') : benefits) || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      id: isEdit ? initialData.id : `beasiswa-${Date.now()}`,
      title: form.title,
      description: form.description,
      deadline: form.deadline,
      applyurl: form.applyUrl,
      provider: form.provider,
      category: form.category,
      requirements: form.requirements.split('\n').map((t) => t.trim()).filter(Boolean),
      benefits: form.benefits.split('\n').map((t) => t.trim()).filter(Boolean)
    };

    try {
      const { error } = await supabase.from('scholarships').upsert([payload]);
      
      if (!error) {
        setStatus({ type: 'success', text: isEdit ? 'Beasiswa berhasil diubah' : 'Beasiswa berhasil ditambahkan' });
        if (!isEdit) {
          setForm({ title: '', description: '', deadline: '', applyUrl: '', provider: '', category: '', requirements: '', benefits: '' });
        }
        if (onSaved) onSaved();
      } else {
        setStatus({ type: 'error', text: error.message || 'Gagal menyimpan beasiswa' });
      }
    } catch (err) {
      setStatus({ type: 'error', text: 'Error jaringan' });
    }
  };

  const inputStyle = { paddingLeft: '1.5rem', width: '100%', borderRadius: '0.75rem' };
  const labelStyle = { display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' };

  return (
    <div className="card animate-fade-in delay-100">
      <h3 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
        {isEdit ? 'Edit Beasiswa' : 'Tambah Beasiswa Baru'}
      </h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={labelStyle}>Judul Beasiswa</label>
          <input name="title" className="search-input" style={inputStyle} value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <label style={labelStyle}>Deskripsi</label>
          <textarea name="description" className="search-input" style={{ ...inputStyle, borderRadius: '1rem', minHeight: '120px', paddingTop: '1rem', resize: 'vertical' }} value={form.description} onChange={handleChange} required />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Penyelenggara</label>
            <input name="provider" className="search-input" style={inputStyle} value={form.provider} onChange={handleChange} required />
          </div>
          <div>
            <label style={labelStyle}>Batas Akhir</label>
            <input name="deadline" type="date" className="search-input" style={inputStyle} value={form.deadline} onChange={handleChange} required />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Link Form Pendaftaran</label>
            <input name="applyUrl" className="search-input" style={inputStyle} value={form.applyUrl} onChange={handleChange} required />
          </div>
          <div>
            <label style={labelStyle}>Kategori / Jenjang</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['D3', 'D4', 'S1', 'S2', 'S3', 'Postdoc', 'Profesional'].map(lvl => {
                const currentCategories = form.category ? form.category.split(',').map(s=>s.trim()).filter(Boolean) : [];
                const isSelected = currentCategories.includes(lvl);
                return (
                  <label key={lvl} style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '2rem',
                    border: isSelected ? '2px solid #2299dd' : '1px solid var(--border-color)',
                    backgroundColor: isSelected ? 'rgba(34, 153, 221, 0.1)' : 'transparent',
                    color: isSelected ? '#2299dd' : 'var(--text-secondary)',
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                    userSelect: 'none',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <input 
                      type="checkbox" 
                      style={{ display: 'none' }}
                      checked={isSelected}
                      onChange={(e) => {
                        let newCats = [...currentCategories];
                        if (e.target.checked) newCats.push(lvl);
                        else newCats = newCats.filter(c => c !== lvl);
                        setForm(prev => ({ ...prev, category: newCats.join(', ') }));
                      }} 
                    />
                    {lvl}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '1rem 0' }} />

        <div>
          <label style={labelStyle}>Keuntungan (Benefits) - Pisahkan per baris (Enter)</label>
          <textarea name="benefits" className="search-input" style={{ ...inputStyle, borderRadius: '1rem', minHeight: '100px', paddingTop: '1rem', resize: 'vertical' }} value={form.benefits} onChange={handleChange} placeholder="Contoh:\nBiaya kuliah penuh\nUang saku bulanan" />
        </div>
        
        <div>
          <label style={labelStyle}>Persyaratan - Pisahkan per baris (Enter)</label>
          <textarea name="requirements" className="search-input" style={{ ...inputStyle, borderRadius: '1rem', minHeight: '100px', paddingTop: '1rem', resize: 'vertical' }} value={form.requirements} onChange={handleChange} placeholder="Contoh:\nIPK Min 3.0\nWarga Negara Indonesia" />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '1rem' }}>
            {isEdit ? 'Simpan Perubahan' : 'Tambah Beasiswa'}
          </button>
          {isEdit && (
            <button type="button" className="btn btn-outline" onClick={onCancel} style={{ flex: 1, padding: '1rem' }}>
              Batal Edit
            </button>
          )}
        </div>
        {status && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            marginTop: '1rem',
            backgroundColor: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: status.type === 'success' ? '#10b981' : '#ef4444',
            border: `1px solid ${status.type === 'success' ? '#10b981' : '#ef4444'}`
          }}>
            {status.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddScholarshipForm;
