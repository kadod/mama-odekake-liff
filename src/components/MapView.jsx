import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import WcIcon from '@mui/icons-material/Wc';

/**
 * マップビューコンポーネント
 */
export function MapView({ spots, userLocation, onSpotClick, onMapLongPress }) {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [longPressLocation, setLongPressLocation] = useState(null);

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

  // 長押し処理
  const handleMapClick = (event) => {
    if (!onMapLongPress) return;

    const latLng = event.detail.latLng;
    if (!latLng) return;

    // タッチデバイスかマウスデバイスかで処理を分岐
    const isTouchDevice = 'ontouchstart' in window;

    if (isTouchDevice) {
      // モバイル: 長押し（500ms）
      const timer = setTimeout(() => {
        setLongPressLocation({ lat: latLng.lat, lng: latLng.lng });
      }, 500);
      setLongPressTimer(timer);
    }
  };

  const handleMapTouchEnd = () => {
    // 長押しタイマーをキャンセル
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleMapContextMenu = (event) => {
    // デスクトップ: 右クリック
    if (!onMapLongPress) return;

    event.preventDefault();
    const latLng = event.detail.latLng;
    if (latLng) {
      setLongPressLocation({ lat: latLng.lat, lng: latLng.lng });
    }
  };

  const handleConfirmLocation = () => {
    if (longPressLocation && onMapLongPress) {
      onMapLongPress(longPressLocation);
      setLongPressLocation(null);
    }
  };

  const handleCancelLocation = () => {
    setLongPressLocation(null);
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
          onClick={handleMapClick}
          onTouchEnd={handleMapTouchEnd}
          onContextmenu={handleMapContextMenu}
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

          {/* 長押し位置の仮マーカー */}
          {longPressLocation && (
            <AdvancedMarker position={longPressLocation}>
              <Pin
                background="#FF5722"
                borderColor="#fff"
                glyphColor="#fff"
              />
            </AdvancedMarker>
          )}

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
                    <span style={facilityBadge}>
                      <LocalParkingIcon sx={{ fontSize: 14, marginRight: '2px', verticalAlign: 'middle' }} />
                      無料
                    </span>
                  )}
                  {selectedSpot.stroller_friendly && (
                    <span style={facilityBadge}>
                      <BabyChangingStationIcon sx={{ fontSize: 14, marginRight: '2px', verticalAlign: 'middle' }} />
                      ベビーカー
                    </span>
                  )}
                  {selectedSpot.nursing_room && (
                    <span style={facilityBadge}>
                      <LocalCafeIcon sx={{ fontSize: 14, marginRight: '2px', verticalAlign: 'middle' }} />
                      授乳室
                    </span>
                  )}
                  {selectedSpot.diaper_change && (
                    <span style={facilityBadge}>
                      <WcIcon sx={{ fontSize: 14, marginRight: '2px', verticalAlign: 'middle' }} />
                      おむつ台
                    </span>
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

        {/* 長押し確認ダイアログ */}
        {longPressLocation && (
          <div style={longPressDialogStyle}>
            <div style={longPressDialogContentStyle}>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600' }}>
                この位置にスポットを追加しますか？
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleCancelLocation} style={cancelButtonStyle}>
                  キャンセル
                </button>
                <button onClick={handleConfirmLocation} style={confirmButtonStyle}>
                  追加する
                </button>
              </div>
            </div>
          </div>
        )}
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

const longPressDialogStyle = {
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1000,
};

const longPressDialogContentStyle = {
  backgroundColor: '#fff',
  padding: '16px 20px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  minWidth: '280px',
};

const cancelButtonStyle = {
  flex: 1,
  padding: '10px',
  backgroundColor: '#fff',
  color: '#666',
  border: '1px solid #ddd',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
};

const confirmButtonStyle = {
  flex: 1,
  padding: '10px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
};
