import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import WcIcon from '@mui/icons-material/Wc';
import DirectionsIcon from '@mui/icons-material/Directions';
import LocationOnIcon from '@mui/icons-material/LocationOn';

/**
 * スポット詳細画面
 */
export function SpotDetail({ spot, onBack }) {
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;

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
        <h2 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: 'bold' }}>
          {spot.name}
        </h2>

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
    </div>
  );
}

const facilityRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '8px 0',
};
