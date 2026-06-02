import { Calendar, Building, Wallet, MapPin, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ScholarshipCard({ scholarship }) {
  // Format date nicely
  const formattedDate = new Date(scholarship.deadline).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const deadlineDate = new Date(scholarship.deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  const diffTime = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
  
  const isMepet = diffTime >= 0 && diffTime <= 14;
  const isClosed = diffTime < 0;

  return (
    <div className="card" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span className="card-tag">{scholarship.level}</span>
        {isClosed ? (
          <span className="card-tag" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontWeight: 600 }}>
            <AlertCircle size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> Ditutup
          </span>
        ) : isMepet ? (
          <span className="card-tag" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#d97706', fontWeight: 600, border: '1px solid rgba(245, 158, 11, 0.3)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
            <Clock size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> {diffTime === 0 ? 'Hari Ini!' : `${diffTime} Hari Lagi`}
          </span>
        ) : null}
      </div>
      <h3 className="card-title" style={{ marginTop: 0 }}>{scholarship.title}</h3>
      <div className="card-provider">
        <Building size={16} />
        {scholarship.provider}
      </div>
      
      <div className="card-details">
        <div className="card-detail-item">
          <Calendar size={16} className="card-detail-icon" />
          <span>Tenggat Waktu: <strong className={isMepet ? "text-error" : "text-cyan"}>{formattedDate}</strong></span>
        </div>
        <div className="card-detail-item">
          <Wallet size={16} className="card-detail-icon" />
          <span>Pendanaan: <strong style={{color: 'var(--text-primary)'}}>{scholarship.fundings || 'Beasiswa Penuh'}</strong></span>
        </div>
        <div className="card-detail-item">
          <MapPin size={16} className="card-detail-icon" />
          <span>Jenis: {scholarship.type}</span>
        </div>
      </div>

      <Link to={`/scholarship/${scholarship.id}`} className="btn btn-outline" style={{ marginTop: 'auto', width: '100%' }}>
        Detail Beasiswa <ArrowRight size={18} />
      </Link>
    </div>
  );
}
