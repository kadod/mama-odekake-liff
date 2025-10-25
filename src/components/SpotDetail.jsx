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
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        ← 戻る
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
            <p style={{ margin: '0', color: '#999', fontSize: '14px' }}>
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
              <span style={facilityIcon(spot.parking !== 'なし')}>🅿️</span>
              <span>駐車場: {spot.parking}</span>
            </div>
            <div style={facilityRow}>
              <span style={facilityIcon(spot.stroller_friendly)}>👶</span>
              <span>ベビーカー: {spot.stroller_friendly ? 'OK' : '-'}</span>
            </div>
            <div style={facilityRow}>
              <span style={facilityIcon(spot.nursing_room)}>🤱</span>
              <span>授乳室: {spot.nursing_room ? 'あり' : 'なし'}</span>
            </div>
            <div style={facilityRow}>
              <span style={facilityIcon(spot.diaper_change)}>🚼</span>
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
            display: 'block',
            padding: '12px 24px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            textAlign: 'center',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Google Mapsでルートを見る
        </a>
      </div>
    </div>
  );
}

const facilityRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const facilityIcon = (available) => ({
  fontSize: '20px',
  opacity: available ? 1 : 0.3,
});
