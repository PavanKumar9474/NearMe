import React, { useState } from 'react';
import axios from 'axios';

export default function ReportModal({ placeId, onClose }) {
  const [reportType, setReportType] = useState('Incorrect Information');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      setError('You must be logged in to report a place.');
      return;
    }

    setLoading(true);
    axios.post(
      'http://127.0.0.1:8000/api/reports/',
      { place: placeId, report_type: reportType, description },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      setSuccess(true);
      setLoading(false);
      setTimeout(onClose, 2000);
    }).catch(err => {
      console.error(err);
      setError('An error occurred while submitting the report.');
      setLoading(false);
    });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '90%', maxWidth: '500px', background: 'var(--bg-secondary)' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Report Place</h2>
        
        {success ? (
          <div style={{ color: '#10b981', textAlign: 'center', padding: '1rem' }}>
            Report submitted successfully. Thank you!
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.5rem' }}>{error}</div>}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Reason</label>
              <select value={reportType} onChange={e => setReportType(e.target.value)} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white' }}>
                <option style={{color: 'black'}} value="Incorrect Information">Incorrect Information</option>
                <option style={{color: 'black'}} value="Permanently Closed">Permanently Closed</option>
                <option style={{color: 'black'}} value="Offensive Content">Offensive Content</option>
                <option style={{color: 'black'}} value="Other">Other</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows="4" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: 'white', resize: 'vertical' }} required></textarea>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit Report'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
