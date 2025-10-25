import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { useState } from 'react';

/**
 * マップビューコンポーネント
 */
export function MapView({ spots, userLocation, onSpotClick }) {
  const [selectedSpot, setSelectedSpot] = useState(null);

  const center = userLocation
    ? { lat: userLocation.lat, lng: userLocation.lng }
    : { lat: 35.6762, lng: 139.6503 }; // 東京都庁をデフォルト

  const handleMarkerClick = (spot) => {
    setSelectedSpot(spot);
  };

  const handleInfoWindowClose = () => {
    setSelectedSpot(null);
  };

  const handleDetailClick = (spot) => {
    setSelectedSpot(null);
    onSpotClick(spot);
  };

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}>
        <Map
          defaultZoom={13}
          defaultCenter={center}
          mapId="mama-odekake-map"
          gestureHandling="greedy"
          disableDefaultUI={false}
          zoomControl={true}
        >
          {/* ユーザーの現在地マーカー */}
          {userLocation && (
            <AdvancedMarker
              position={{ lat: userLocation.lat, lng: userLocation.lng }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#4285F4',
                border: '3px solid white',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
              }} />
            </AdvancedMarker>
          )}

          {/* スポットマーカー */}
          {spots.map((spot) => (
            <AdvancedMarker
              key={spot.id}
              position={{ lat: spot.lat, lng: spot.lng }}
              onClick={() => handleMarkerClick(spot)}
            >
              <Pin
                background={getPinColor(spot)}
                borderColor="#fff"
                glyphColor="#fff"
              />
            </AdvancedMarker>
          ))}

          {/* 情報ウィンドウ */}
          {selectedSpot && (
            <InfoWindow
              position={{ lat: selectedSpot.lat, lng: selectedSpot.lng }}
              onCloseClick={handleInfoWindowClose}
            >
              <div style={{ padding: '8px', minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
                  {selectedSpot.name}
                </h3>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
                  {selectedSpot.address}
                </p>
                {selectedSpot.distance && (
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#999' }}>
                    現在地から約 {selectedSpot.distance.toFixed(1)} km
                  </p>
                )}

                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {selectedSpot.parking === '無料' && (
                    <span style={facilityBadge}>🅿️無料</span>
                  )}
                  {selectedSpot.stroller_friendly && (
                    <span style={facilityBadge}>👶ベビーカー</span>
                  )}
                  {selectedSpot.nursing_room && (
                    <span style={facilityBadge}>🤱授乳室</span>
                  )}
                  {selectedSpot.diaper_change && (
                    <span style={facilityBadge}>🚼おむつ台</span>
                  )}
                </div>

                <button
                  onClick={() => handleDetailClick(selectedSpot)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  詳細を見る
                </button>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}

// ピンの色を設定（駐車場の有無で色分け）
function getPinColor(spot) {
  if (spot.parking === '無料') return '#4CAF50'; // 緑
  if (spot.parking === '有料') return '#FFC107'; // 黄色
  return '#9E9E9E'; // グレー
}

const facilityBadge = {
  display: 'inline-block',
  padding: '2px 6px',
  backgroundColor: '#f0f0f0',
  borderRadius: '4px',
  fontSize: '11px',
  whiteSpace: 'nowrap'
};
