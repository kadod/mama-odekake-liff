import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import WcIcon from '@mui/icons-material/Wc';
import DirectionsIcon from '@mui/icons-material/Directions';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import { useState, useEffect } from 'react';
import { ReviewForm } from './ReviewForm';
import {
  submitReview,
  getSpotReviews,
  addFavorite,
  removeFavorite,
  isFavorited,
  getRecentCrowdLevel,
} from '../services/supabase';

/**
 * スポット詳細画面
 */
export function SpotDetail({ spot, onBack, userId }) {
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isFav, setIsFav] = useState(false);
  const [crowdLevel, setCrowdLevel] = useState(null);

  useEffect(() => {
    loadReviews();
    checkFavorite();
    loadCrowdLevel();
  }, [spot.id, userId]);

  const loadReviews = async () => {
    const data = await getSpotReviews(spot.id, 5);
    setReviews(data);
  };

  const checkFavorite = async () => {
    if (!userId) return;
    const favorited = await isFavorited(userId, spot.id);
    setIsFav(favorited);
  };

  const loadCrowdLevel = async () => {
    const level = await getRecentCrowdLevel(spot.id);
    setCrowdLevel(level);
  };

  const handleReviewSubmit = async (reviewData) => {
    if (!userId) {
      alert('レビューを投稿するにはログインが必要です');
      return;
    }

    const result = await submitReview(spot.id, userId, reviewData);
    if (result.success) {
      alert('レビューを投稿しました');
      setShowReviewForm(false);
      loadReviews();
      loadCrowdLevel();
    } else {
      alert('投稿に失敗しました');
    }
  };

  const handleFavoriteToggle = async () => {
    if (!userId) {
      alert('お気に入りに追加するにはログインが必要です');
      return;
    }

    if (isFav) {
      const result = await removeFavorite(userId, spot.id);
      if (result.success) setIsFav(false);
    } else {
      const result = await addFavorite(userId, spot.id);
      if (result.success) setIsFav(true);
    }
  };

  // 今日の営業時間を取得
  const getTodayHours = () => {
    if (!spot.opening_hours) return null;

    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    const hours = spot.opening_hours[today];

    if (!hours) return null;
    if (hours.closed) return '定休日';
    if (hours.open === '24h') return '24時間営業';
    return `${hours.open} - ${hours.close}`;
  };

  const getCrowdLevelColor = (level) => {
    if (level === 'low') return '#4CAF50';
    if (level === 'medium') return '#FFC107';
    if (level === 'high') return '#F44336';
    return '#999';
  };

  const getCrowdLevelText = (level) => {
    if (level === 'low') return '空いています';
    if (level === 'medium') return '普通';
    if (level === 'high') return '混雑中';
    return '情報なし';
  };

  return (
    <div style={{ padding: '16px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <button
        onClick={onBack}
        style={{
          marginBottom: '16px',
          padding: '8px 16px',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontWeight: '600',
        }}
      >
        <ArrowBackIcon sx={{ fontSize: 18 }} />
        戻る
      </button>

      <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', flex: 1 }}>
            {spot.name}
          </h2>
          <button onClick={handleFavoriteToggle} style={favoriteButtonStyle}>
            {isFav ? (
              <FavoriteIcon sx={{ fontSize: 28, color: '#F44336' }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 28, color: '#999' }} />
            )}
          </button>
        </div>

        {/* 混雑度表示 */}
        {crowdLevel && (
          <div style={{
            ...crowdBadgeStyle,
            backgroundColor: getCrowdLevelColor(crowdLevel) + '20',
            borderColor: getCrowdLevelColor(crowdLevel),
          }}>
            <PeopleIcon sx={{ fontSize: 18, color: getCrowdLevelColor(crowdLevel) }} />
            <span style={{ color: getCrowdLevelColor(crowdLevel), fontWeight: '600' }}>
              {getCrowdLevelText(crowdLevel)}
            </span>
            <span style={{ fontSize: '11px', color: '#999', marginLeft: '8px' }}>
              (過去3時間の情報)
            </span>
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <p style={{ margin: '0 0 8px 0', color: '#666' }}>
            {spot.address}
          </p>
          {spot.distance && (
            <p style={{ margin: '0', color: '#999', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <LocationOnIcon sx={{ fontSize: 16 }} />
              現在地から約 {spot.distance.toFixed(1)} km
            </p>
          )}
        </div>

        {/* 営業時間・連絡先情報 */}
        {(getTodayHours() || spot.phone || spot.website) && (
          <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            {getTodayHours() && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <AccessTimeIcon sx={{ fontSize: 20, color: '#4CAF50' }} />
                <div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>営業時間（本日）</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{getTodayHours()}</div>
                </div>
              </div>
            )}

            {spot.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <PhoneIcon sx={{ fontSize: 20, color: '#4CAF50' }} />
                <a href={`tel:${spot.phone}`} style={{ fontSize: '14px', color: '#4CAF50', textDecoration: 'none', fontWeight: '500' }}>
                  {spot.phone}
                </a>
              </div>
            )}

            {spot.website && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <LanguageIcon sx={{ fontSize: 20, color: '#4CAF50' }} />
                <a
                  href={spot.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '14px', color: '#4CAF50', textDecoration: 'none', fontWeight: '500' }}
                >
                  公式サイト
                </a>
              </div>
            )}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>
            設備情報
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={facilityRow}>
              <LocalParkingIcon sx={{ fontSize: 24, color: spot.parking !== 'なし' ? '#4CAF50' : '#ccc' }} />
              <span>駐車場: {spot.parking}</span>
            </div>
            <div style={facilityRow}>
              <BabyChangingStationIcon sx={{ fontSize: 24, color: spot.stroller_friendly ? '#4CAF50' : '#ccc' }} />
              <span>ベビーカー: {spot.stroller_friendly ? 'OK' : '-'}</span>
            </div>
            <div style={facilityRow}>
              <LocalCafeIcon sx={{ fontSize: 24, color: spot.nursing_room ? '#4CAF50' : '#ccc' }} />
              <span>授乳室: {spot.nursing_room ? 'あり' : 'なし'}</span>
            </div>
            <div style={facilityRow}>
              <WcIcon sx={{ fontSize: 24, color: spot.diaper_change ? '#4CAF50' : '#ccc' }} />
              <span>おむつ台: {spot.diaper_change ? 'あり' : 'なし'}</span>
            </div>
          </div>
        </div>

        {spot.description && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>
              説明
            </h3>
            <p style={{ margin: '0', lineHeight: '1.6' }}>{spot.description}</p>
          </div>
        )}

        {spot.reviews_ai && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>
              口コミ要約
            </h3>
            <p style={{ margin: '0', lineHeight: '1.6', color: '#555' }}>
              {spot.reviews_ai}
            </p>
          </div>
        )}

        {/* レビューセクション */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
              レビュー ({reviews.length})
            </h3>
            <button
              onClick={() => setShowReviewForm(true)}
              style={reviewButtonStyle}
            >
              <RateReviewIcon sx={{ fontSize: 18, marginRight: '6px' }} />
              レビューを書く
            </button>
          </div>

          {reviews.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reviews.map((review) => (
                <div key={review.id} style={reviewCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
                    <div>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          sx={{
                            fontSize: 16,
                            color: star <= review.rating ? '#FFC107' : '#ddd',
                          }}
                        />
                      ))}
                    </div>
                    {review.crowd_level && (
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: getCrowdLevelColor(review.crowd_level) + '20',
                        color: getCrowdLevelColor(review.crowd_level),
                        fontWeight: '600',
                      }}>
                        {getCrowdLevelText(review.crowd_level)}
                      </span>
                    )}
                  </div>
                  {review.comment && (
                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', lineHeight: '1.5' }}>
                      {review.comment}
                    </p>
                  )}
                  <div style={{ fontSize: '11px', color: '#999' }}>
                    {new Date(review.created_at).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#999', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
              まだレビューがありません
            </p>
          )}
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px 24px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            textAlign: 'center',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
          }}
        >
          <DirectionsIcon sx={{ fontSize: 20 }} />
          Google Mapsでルートを見る
        </a>
      </div>

      {/* レビューフォームモーダル */}
      {showReviewForm && (
        <ReviewForm
          spot={spot}
          onSubmit={handleReviewSubmit}
          onClose={() => setShowReviewForm(false)}
        />
      )}
    </div>
  );
}

const facilityRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '8px 0',
};

const favoriteButtonStyle = {
  padding: '8px',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const crowdBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '2px solid',
  marginBottom: '16px',
};

const reviewButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
};

const reviewCardStyle = {
  padding: '16px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
};
