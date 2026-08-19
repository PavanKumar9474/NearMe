import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Globe, Phone, Clock, Star, ArrowLeft, Heart, AlertTriangle, Navigation } from 'lucide-react';
import ReportModal from '../components/ReportModal';

export default function PlaceDetailsPage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReport, setShowReport] = useState(false);
  
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const token = localStorage.getItem('access_token');

  const fetchReviews = () => {
    axios.get(`http://127.0.0.1:8000/api/reviews/?place=${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error("Error fetching reviews:", err));
  };

  useEffect(() => {
    const fetchPlace = axios.get(`http://127.0.0.1:8000/api/places/${id}/`);
    const fetchFavorites = token ? axios.get('http://127.0.0.1:8000/api/favorites/', { headers: { Authorization: `Bearer ${token}` } }) : Promise.resolve({ data: [] });

    Promise.all([fetchPlace, fetchFavorites])
      .then(([placeRes, favRes]) => {
        setPlace(placeRes.data);
        const favs = favRes.data;
        if (favs.some(f => f.place === parseInt(id))) {
          setIsFavorite(true);
        }
        fetchReviews();
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, [id, token]);

  const toggleFavorite = () => {
    if (!token) return alert('Please login to favorite places.');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    if (isFavorite) {
      // Find the favorite ID to delete. For simplicity, just fetch again or assume the backend handles it.
      // A more robust implementation would store the favorite ID.
      axios.get('http://127.0.0.1:8000/api/favorites/', config).then(res => {
        const fav = res.data.find(f => f.place === parseInt(id));
        if (fav) {
          axios.delete(`http://127.0.0.1:8000/api/favorites/${fav.id}/`, config).then(() => setIsFavorite(false));
        }
      });
    } else {
      axios.post('http://127.0.0.1:8000/api/favorites/', { place: id }, config)
        .then(() => setIsFavorite(true))
        .catch(err => console.error("Error favoriting:", err));
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!token) return alert('Please login to submit a review.');
    setSubmittingReview(true);
    axios.post('http://127.0.0.1:8000/api/reviews/', {
      place: id,
      rating: reviewRating,
      comment: reviewText
    }, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
      setReviews([res.data, ...reviews]);
      setReviewText('');
      setReviewRating(5);
      axios.get(`http://127.0.0.1:8000/api/places/${id}/`).then(p => setPlace(p.data));
    })
    .catch(err => console.error("Error submitting review:", err))
    .finally(() => setSubmittingReview(false));
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!place) return <div className="container">Place not found.</div>;

  return (
    <div className="container animate-fade-in">
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', textDecoration: 'none', marginBottom: '2rem' }}>
        <ArrowLeft size={20} /> Back to Map
      </Link>
      
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {place.image && (
          <img 
            src={`http://127.0.0.1:8000${place.image}`} 
            alt={place.name} 
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '0.75rem' }}
          />
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <h1 style={{ margin: 0 }}>{place.name}</h1>
              <button onClick={toggleFavorite} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isFavorite ? '#ef4444' : 'var(--text-secondary)' }}>
                <Heart size={28} fill={isFavorite ? '#ef4444' : 'none'} />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
              {place.category_name && <span style={{ background: 'var(--bg-secondary)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem' }}>{place.category_name}</span>}
              {place.rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}>
                  <Star size={18} fill="currentColor" />
                  <span style={{ fontWeight: 600 }}>{place.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>About</h3>
            <p style={{ lineHeight: 1.7 }}>{place.description || "No description provided."}</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Contact Info</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <MapPin size={20} style={{ color: 'var(--accent-primary)', marginTop: '0.1rem' }} />
              <div>
                <span style={{ display: 'block', marginBottom: '0.5rem' }}>{place.address}</span>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem', textDecoration: 'none' }}>
                  <Navigation size={16} /> Get Directions
                </a>
              </div>
            </div>
            {place.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={20} style={{ color: 'var(--accent-primary)' }} />
                <span>{place.phone}</span>
              </div>
            )}
            {place.website && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Globe size={20} style={{ color: 'var(--accent-primary)' }} />
                <a href={place.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)' }}>{place.website}</a>
              </div>
            )}
            {place.opening_hours && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Clock size={20} style={{ color: 'var(--accent-primary)', marginTop: '0.1rem' }} />
                <span>{place.opening_hours}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button 
            onClick={() => setShowReport(true)} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'none'; }}
          >
            <AlertTriangle size={16} /> Report Issue
          </button>
        </div>

        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-glass)', paddingTop: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Reviews</h2>
          
          {token ? (
            <form onSubmit={handleReviewSubmit} style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Write a Review</h3>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Rating</label>
                <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border-glass)', background: 'var(--bg-primary)', color: 'white' }}>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Terrible</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Comment</label>
                <textarea 
                  required 
                  value={reviewText} 
                  onChange={(e) => setReviewText(e.target.value)} 
                  rows="3" 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-glass)', background: 'var(--bg-primary)', color: 'white', resize: 'vertical' }}
                  placeholder="Share your experience..."
                />
              </div>
              <button type="submit" className="btn-primary" disabled={submittingReview} style={{ alignSelf: 'flex-start', padding: '0.5rem 1.5rem' }}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Please <Link to="/login" style={{ color: 'var(--accent-primary)' }}>login</Link> to leave a review.</p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first to review this place!</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '0.5rem', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>{review.username || 'User'}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}>
                      <Star size={14} fill="currentColor" />
                      <span>{review.rating}</span>
                    </div>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>{review.comment}</p>
                  <small style={{ color: 'gray', display: 'block', marginTop: '0.5rem' }}>{new Date(review.created_at).toLocaleDateString()}</small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      
      {showReport && <ReportModal placeId={place.id} onClose={() => setShowReport(false)} />}
    </div>
  );
}
