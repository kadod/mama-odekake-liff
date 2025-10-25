/**
 * スポット表示カード
 */
export function SpotCard({ spot, onClick }) {
  return (
    <div
      className="spot-card"
      onClick={() => onClick(spot)}
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        cursor: 'pointer',
        backgroundColor: '#fff',
      }}
    >
      <div style={{ marginBottom: '8px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold' }}>
          {spot.name}
        </h3>
        <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
          {spot.address}
        </p>
        {spot.distance && (
          <p style={{ margin: '4px 0 0 0', color: '#999', fontSize: '12px' }}>
            現在地から約 {spot.distance.toFixed(1)} km
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {spot.parking === '無料' && (
          <span style={{ ...iconStyle, backgroundColor: '#4CAF50', color: '#fff' }}>
            無料駐車場
          </span>
        )}
        {spot.parking === '有料' && (
          <span style={{ ...iconStyle, backgroundColor: '#FFC107', color: '#fff' }}>
            有料駐車場
          </span>
        )}
        {spot.stroller_friendly && (
          <span style={{ ...iconStyle, backgroundColor: '#2196F3', color: '#fff' }}>
            ベビーカーOK
          </span>
        )}
        {spot.nursing_room && (
          <span style={{ ...iconStyle, backgroundColor: '#E91E63', color: '#fff' }}>
            授乳室あり
          </span>
        )}
        {spot.diaper_change && (
          <span style={{ ...iconStyle, backgroundColor: '#9C27B0', color: '#fff' }}>
            おむつ台あり
          </span>
        )}
      </div>

      {spot.reviews_ai && (
        <p style={{ margin: '12px 0 0 0', fontSize: '14px', color: '#333' }}>
          {spot.reviews_ai}
        </p>
      )}
    </div>
  );
}

const iconStyle = {
  display: 'inline-block',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 'bold',
};
