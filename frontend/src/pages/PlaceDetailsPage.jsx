import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Globe, Phone, Clock, Star, ArrowLeft, Heart, AlertTriangle, Navigation, MessageSquare, Info } from 'lucide-react';
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

  const fetchReviews = useCallback(() => {
    axios.get(`http://127.0.0.1:8000/api/reviews/?place=${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error("Error fetching reviews:", err));
  }, [id]);

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
  }, [id, token, fetchReviews]);

  const toggleFavorite = () => {
    if (!token) return alert('Please login to favorite places.');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    if (isFavorite) {
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

  if (loading) return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ width: '50px', height: '50px', border: '3px solid var(--border-glass)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!place) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Place not found.</div>;

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '2rem', transition: 'var(--transition-smooth)' }} onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
        <ArrowLeft size={18} /> Back to Discover
      </Link>
      
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Header Image Section */}
        <div style={{ position: 'relative', height: '350px', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(236,72,153,0.2))' }}>
          {place.image ? (
            <img 
              src={`http://127.0.0.1:8000${place.image}`} 
              alt={place.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <MapPin size={80} color="var(--accent-primary)" style={{ opacity: 0.5 }} />
            </div>
          )}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, var(--bg-glass) 0%, rgba(10,10,15,0.1) 60%, transparent 100%)' }}></div>
          
          <div style={{ position: 'absolute', bottom: '2rem', left: '2.5rem', right: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                <h1 style={{ margin: 0, fontSize: '3rem', textShadow: '0 4px 20px rgba(0,0,0,0.5)', lineHeight: 1.1 }}>{place.name}</h1>
                <button onClick={toggleFavorite} style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-glass)', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'var(--transition-bounce)' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Heart size={22} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : 'white'} />
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {place.category_name && <span style={{ background: 'var(--accent-primary)', color: 'white', padding: '0.35rem 1rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{place.category_name}</span>}
                {place.rating && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fbbf24', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', padding: '0.35rem 1rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Star size={16} fill="currentColor" />
                    <span style={{ fontWeight: 700 }}>{place.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'white', fontSize: '1.35rem' }}>
                <Info size={22} color="var(--accent-primary)" /> About
              </h3>
              <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '1.05rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-glass)' }}>
                {place.description || "No description provided yet."}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button 
                onClick={() => setShowReport(true)} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', cursor: 'pointer', transition: 'var(--transition-smooth)', fontWeight: 600, fontSize: '0.9rem' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
              >
                <AlertTriangle size={18} /> Report an Issue
              </button>
            </div>
          </div>
          
          <div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ margin: 0, color: 'white', fontSize: '1.35rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>Contact & Info</h3>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ background: 'rgba(99,102,241,0.1)', padding: '0.75rem', borderRadius: '0.75rem', color: 'var(--accent-primary)' }}>
                  <MapPin size={22} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                  <span style={{ fontSize: '1.05rem', color: 'white', lineHeight: 1.5 }}>{place.address}</span>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--accent-gradient)', color: 'white', borderRadius: '0.5rem', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600, alignSelf: 'flex-start' }}>
                    <Navigation size={16} /> Get Directions
                  </a>
                </div>
              </div>

              {place.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'rgba(99,102,241,0.1)', padding: '0.75rem', borderRadius: '0.75rem', color: 'var(--accent-primary)' }}>
                    <Phone size={22} />
                  </div>
                  <span style={{ fontSize: '1.05rem', color: 'white' }}>{place.phone}</span>
                </div>
              )}

              {place.website && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'rgba(99,102,241,0.1)', padding: '0.75rem', borderRadius: '0.75rem', color: 'var(--accent-primary)' }}>
                    <Globe size={22} />
                  </div>
                  <a href={place.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.05rem', color: 'var(--accent-primary)', textDecoration: 'none', wordBreak: 'break-all' }}>{place.website}</a>
                </div>
              )}

              {place.opening_hours && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ background: 'rgba(99,102,241,0.1)', padding: '0.75rem', borderRadius: '0.75rem', color: 'var(--accent-primary)' }}>
                    <Clock size={22} />
                  </div>
                  <span style={{ fontSize: '1.05rem', color: 'white', lineHeight: 1.5 }}>{place.opening_hours}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ padding: '0 2.5rem 2.5rem 2.5rem' }}>
          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '2.5rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', fontSize: '1.75rem' }}>
              <MessageSquare size={28} color="var(--accent-primary)" /> Reviews
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', md: { gridTemplateColumns: '1fr 2fr' } }}>
              {/* Review Form */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-glass)' }}>
                {token ? (
                  <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Share your experience</h3>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Rating</label>
                      <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '1rem', appearance: 'none' }}>
                        <option value="5">5 - Excellent (⭐⭐⭐⭐⭐)</option>
                        <option value="4">4 - Good (⭐⭐⭐⭐)</option>
                        <option value="3">3 - Average (⭐⭐⭐)</option>
                        <option value="2">2 - Poor (⭐⭐)</option>
                        <option value="1">1 - Terrible (⭐)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Review</label>
                      <textarea 
                        required 
                        value={reviewText} 
                        onChange={(e) => setReviewText(e.target.value)} 
                        rows="4" 
                        style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.3)', color: 'white', resize: 'vertical', fontSize: '1rem' }}
                        placeholder="What did you like or dislike?"
                      />
                    </div>
                    
                    <button type="submit" className="btn-primary" disabled={submittingReview} style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', opacity: submittingReview ? 0.7 : 1 }}>
                      {submittingReview ? 'Submitting...' : 'Post Review'}
                    </button>
                  </form>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <MessageSquare size={48} color="var(--border-glass-hover)" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ marginBottom: '1rem' }}>Join the conversation</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You need to be signed in to leave a review.</p>
                    <Link to="/login" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>Sign In Now</Link>
                  </div>
                )}
              </div>

              {/* Review List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {reviews.length === 0 ? (
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-glass)', borderRadius: '1rem', padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Star size={40} color="var(--border-glass-hover)" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ marginBottom: '0.5rem', color: 'white' }}>No reviews yet</h3>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Be the first to share your thoughts on this place!</p>
                  </div>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="animate-fade-in" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px solid var(--border-glass)', transition: 'var(--transition-smooth)' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                            {(review.username || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <span style={{ fontWeight: 600, display: 'block', fontSize: '1.05rem' }}>{review.username || 'User'}</span>
                            <small style={{ color: 'var(--text-secondary)' }}>{new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</small>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', background: 'rgba(0,0,0,0.3)', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>
                          <Star size={14} fill="currentColor" />
                          <span style={{ fontWeight: 700 }}>{review.rating}.0</span>
                        </div>
                      </div>
                      <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.6, paddingLeft: '3.5rem' }}>"{review.comment}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showReport && <ReportModal placeId={place.id} onClose={() => setShowReport(false)} />}
    </div>
  );
}
