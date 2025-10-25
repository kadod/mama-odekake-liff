import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import MyLocationIcon from '@mui/icons-material/MyLocation';

/**
 * マップから位置を選択するコンポーネント
 */
export function MapPicker({ userLocation, onSelect, onClose }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const center = userLocation
    ? { lat: userLocation.lat, lng: userLocation.lng }
    : { lat: 35.6762, lng: 139.6503 }; // 東京都庁をデフォルト

  const handleMapClick = (event) => {
    const latLng = event.detail.latLng;
    if (latLng) {
      setSelectedLocation({ lat: latLng.lat, lng: latLng.lng });
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelect(selectedLocation);
    }
  };

  const handleUseCurrentLocation = () => {
    if (userLocation) {
      setSelectedLocation({ lat: userLocation.lat, lng: userLocation.lng });
    }
  };

  return (
    <div style={overlayStyle}>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <div style={containerStyle}>
          {/* ヘッダー */}
          <div style={headerStyle}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>
              地図から位置を選択
            </h3>
            <button onClick={onClose} style={closeButtonStyle}>
              <CloseIcon sx={{ fontSize: 20 }} />
            </button>
          </div>

          {/* 説明 */}
          <div style={instructionStyle}>
            地図をタップしてスポットの位置を選択してください
          </div>

          {/* マップ */}
          <div style={{ flex: 1, position: 'relative' }}>
            <Map
              defaultZoom={15}
              defaultCenter={center}
              mapId="mama-odekake-map-picker"
              gestureHandling="greedy"
              disableDefaultUI={false}
              zoomControl={true}
              onClick={handleMapClick}
            >
              {/* 現在地マーカー */}
              {userLocation && (
                <AdvancedMarker
                  position={{ lat: userLocation.lat, lng: userLocation.lng }}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#4285F4',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }} />
                </AdvancedMarker>
              )}

              {/* 選択位置マーカー */}
              {selectedLocation && (
                <AdvancedMarker position={selectedLocation}>
                  <Pin
                    background="#FF5722"
                    borderColor="#fff"
                    glyphColor="#fff"
                    scale={1.2}
                  />
                </AdvancedMarker>
              )}
            </Map>

            {/* 現在地ボタン */}
            {userLocation && (
              <button onClick={handleUseCurrentLocation} style={myLocationButtonStyle}>
                <MyLocationIcon sx={{ fontSize: 20 }} />
              </button>
            )}
          </div>

          {/* フッター */}
          <div style={footerStyle}>
            {selectedLocation && (
              <div style={selectedInfoStyle}>
                選択位置: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </div>
            )}
            <div style={buttonGroupStyle}>
              <button onClick={onClose} style={cancelButtonStyle}>
                キャンセル
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedLocation}
                style={
                  selectedLocation
                    ? confirmButtonStyle
                    : { ...confirmButtonStyle, ...disabledButtonStyle }
                }
              >
                <CheckIcon sx={{ fontSize: 18, marginRight: '4px' }} />
                この位置に決定
              </button>
            </div>
          </div>
        </div>
      </APIProvider>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 3000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const containerStyle = {
  width: '100%',
  height: '100%',
  maxWidth: '600px',
  maxHeight: '90vh',
  backgroundColor: '#fff',
  borderRadius: '12px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  margin: '20px',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 20px',
  borderBottom: '1px solid #e0e0e0',
  backgroundColor: '#fff',
};

const closeButtonStyle = {
  padding: '8px',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: '#666',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const instructionStyle = {
  padding: '12px 20px',
  backgroundColor: '#e3f2fd',
  color: '#1976d2',
  fontSize: '14px',
  textAlign: 'center',
  borderBottom: '1px solid #bbdefb',
};

const myLocationButtonStyle = {
  position: 'absolute',
  bottom: '20px',
  right: '20px',
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: '#fff',
  border: 'none',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#666',
};

const footerStyle = {
  padding: '16px 20px',
  borderTop: '1px solid #e0e0e0',
  backgroundColor: '#fff',
};

const selectedInfoStyle = {
  fontSize: '12px',
  color: '#666',
  marginBottom: '12px',
  textAlign: 'center',
  backgroundColor: '#f5f5f5',
  padding: '8px',
  borderRadius: '6px',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '12px',
};

const cancelButtonStyle = {
  flex: 1,
  padding: '12px',
  backgroundColor: '#fff',
  color: '#666',
  border: '1px solid #ddd',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
};

const confirmButtonStyle = {
  flex: 2,
  padding: '12px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const disabledButtonStyle = {
  backgroundColor: '#ccc',
  cursor: 'not-allowed',
};
