import React from 'react';
import { ArrowLeft, Building, Calendar, DollarSign, MapPin, CheckCircle2 } from 'lucide-react';

const AdminScholarshipDetail = ({ scholarship, onBack }) => {
  if (!scholarship) return null;

  const formattedDate = scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  }) : '-';

  return (
    <div className="card animate-fade-in delay-100">
      <button onClick={onBack} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: '0.5rem 1rem' }}>
        <ArrowLeft size={16} /> Kembali ke Daftar
      </button>

      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        {scholarship.category && <span className="card-tag" style={{ marginBottom: '1rem', display: 'inline-block' }}>{scholarship.category}</span>}
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{scholarship.title}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <Building size={18} />
          <span>{scholarship.provider}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> Tenggat Waktu</div>
          <div style={{ fontWeight: 600 }}>{formattedDate}</div>
        </div>
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> Lokasi / Tipe</div>
          <div style={{ fontWeight: 600 }}>{scholarship.type || 'Semua Universitas'}</div>
        </div>
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><DollarSign size={16} /> URL Pendaftaran</div>
          <div style={{ fontWeight: 600 }}>
            {scholarship.applyUrl ? (
              <a href={scholarship.applyUrl.startsWith('http') ? scholarship.applyUrl : `https://${scholarship.applyUrl}`} target="_blank" rel="noreferrer" className="text-cyan">Buka Link</a>
            ) : '-'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--accent-cyan)' }}>Deskripsi</h3>
          <p style={{ whiteSpace: 'pre-line', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{scholarship.description}</p>
        </div>

        {scholarship.benefits && Array.isArray(scholarship.benefits) && scholarship.benefits.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--accent-cyan)' }}>Keuntungan (Benefits)</h3>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.6 }}>
              {scholarship.benefits.map((ben, idx) => <li key={idx}>{ben}</li>)}
            </ul>
          </div>
        )}

        {scholarship.requirements && Array.isArray(scholarship.requirements) && scholarship.requirements.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} /> Persyaratan
            </h3>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.6 }}>
              {scholarship.requirements.map((req, idx) => <li key={idx}>{req}</li>)}
            </ul>
          </div>
        )}

        {scholarship.documents && Array.isArray(scholarship.documents) && scholarship.documents.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--accent-cyan)' }}>Dokumen Dibutuhkan</h3>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.6 }}>
              {scholarship.documents.map((doc, idx) => <li key={idx}>{doc}</li>)}
            </ul>
          </div>
        )}

        {scholarship.tags && Array.isArray(scholarship.tags) && scholarship.tags.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--accent-cyan)' }}>Tag</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {scholarship.tags.map((tag, idx) => (
                <span key={idx} style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '999px', border: '1px solid var(--border-color)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminScholarshipDetail;
