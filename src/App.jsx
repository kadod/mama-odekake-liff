import { useState, useEffect } from 'react';
import { useLiff, useLocation } from './hooks/useLiff';
import { getSpotsByLocation } from './services/supabase';
import { SpotCard } from './components/SpotCard';
import { SpotDetail } from './components/SpotDetail';
import { MapView } from './components/MapView';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import WarningIcon from '@mui/icons-material/Warning';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import WcIcon from '@mui/icons-material/Wc';
import ListIcon from '@mui/icons-material/List';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

function App() {
  const { isLoggedIn, isLoading: liffLoading, error: liffError, profile } = useLiff();
  const { location, isLoading: locationLoading, error: locationError, getLocation } = useLocation();
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [spotsLoading, setSpotsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    if (location) {
      fetchSpots();
    }
  }, [location]);

  const fetchSpots = async () => {
    if (!location) return;

    setSpotsLoading(true);
    const data = await getSpotsByLocation(location.lat, location.lng, 20);
    setSpots(data);
    setSpotsLoading(false);
  };

  if (liffLoading) {
    return <div style={loadingStyle}>LIFF初期化中...</div>;
  }

  if (liffError) {
    return <div style={errorStyle}>エラー: {liffError}</div>;
  }

  if (!isLoggedIn) {
    return <div style={loadingStyle}>ログイン中...</div>;
  }

  if (selectedSpot) {
    return <SpotDetail spot={selectedSpot} onBack={() => setSelectedSpot(null)} />;
  }

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <FamilyRestroomIcon sx={{ fontSize: 32 }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', letterSpacing: '0.5px' }}>ままっぷ</h1>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', opacity: 0.85, fontWeight: '500' }}>ママのおでかけスポット検索</p>
          </div>
        </div>
        {profile && <p style={{ margin: '12px 0 0 0', fontSize: '13px', opacity: 0.9 }}>こんにちは、{profile.displayName}さん</p>}
      </header>

      <div style={contentStyle}>
        {!location ? (
          <div style={welcomeContainerStyle}>
            <div style={welcomeIconStyle}>
              <LocationOnIcon sx={{ fontSize: 64, color: '#4CAF50' }} />
            </div>
            <h2 style={welcomeTitleStyle}>近くのお出かけスポットを探す</h2>
            <p style={welcomeDescriptionStyle}>
              位置情報を使って、お子様連れに優しい<br />
              お出かけスポットを見つけましょう
            </p>

            <div style={buttonGroupStyle}>
              <button
                onClick={getLocation}
                disabled={locationLoading}
                style={primaryButtonStyle(locationLoading)}
              >
                <LocationOnIcon sx={{ fontSize: 20, marginRight: '8px', verticalAlign: 'middle' }} />
                {locationLoading ? '位置情報取得中...' : '現在地で検索'}
              </button>

              <button
                onClick={() => setViewMode('map')}
                style={secondaryButtonStyle}
              >
                <MapIcon sx={{ fontSize: 20, marginRight: '8px', verticalAlign: 'middle' }} />
                マップを見る
              </button>
            </div>

            {locationError && (
              <div style={errorMessageStyle}>
                <WarningIcon sx={{ fontSize: 18, marginRight: '8px', verticalAlign: 'middle' }} />
                {locationError}
              </div>
            )}

            <div style={featureListStyle}>
              <div style={featureItemStyle}>
                <LocalParkingIcon sx={{ fontSize: 20, color: '#4CAF50' }} />
                <span style={featureTextStyle}>駐車場情報</span>
              </div>
              <div style={featureItemStyle}>
                <BabyChangingStationIcon sx={{ fontSize: 20, color: '#4CAF50' }} />
                <span style={featureTextStyle}>ベビーカー対応</span>
              </div>
              <div style={featureItemStyle}>
                <LocalCafeIcon sx={{ fontSize: 20, color: '#4CAF50' }} />
                <span style={featureTextStyle}>授乳室完備</span>
              </div>
              <div style={featureItemStyle}>
                <WcIcon sx={{ fontSize: 20, color: '#4CAF50' }} />
                <span style={featureTextStyle}>おむつ台あり</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={locationBarStyle}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <LocationOnIcon sx={{ fontSize: 16 }} />
                  現在地
                </div>
                <div style={{ fontSize: '11px', color: '#999' }}>
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </div>
              </div>
              <button
                onClick={getLocation}
                style={refreshButtonStyle}
              >
                <RefreshIcon sx={{ fontSize: 16, marginRight: '4px', verticalAlign: 'middle' }} />
                再検索
              </button>
            </div>

            {spotsLoading ? (
              <div style={loadingContainerStyle}>
                <div style={spinnerStyle}>
                  <HourglassEmptyIcon sx={{ fontSize: 48, color: '#4CAF50' }} />
                </div>
                <p style={{ marginTop: '16px', color: '#666' }}>スポットを検索中...</p>
              </div>
            ) : spots.length === 0 ? (
              <div style={emptyStateStyle}>
                <SearchIcon sx={{ fontSize: 64, color: '#ccc', marginBottom: '16px' }} />
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>スポットが見つかりません</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                  近くにお出かけスポットがありませんでした。<br />
                  範囲を広げて再検索してみてください。
                </p>
              </div>
            ) : (
              <>
                {viewMode === 'list' ? (
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                        近くのスポット（{spots.length}件）
                      </h2>
                      <button
                        onClick={() => setViewMode('map')}
                        style={mapButtonStyle}
                      >
                        <MapIcon sx={{ fontSize: 16, marginRight: '4px', verticalAlign: 'middle' }} />
                        地図で見る
                      </button>
                    </div>
                    {spots.map((spot) => (
                      <SpotCard key={spot.id} spot={spot} onClick={setSelectedSpot} />
                    ))}
                  </div>
                ) : (
                  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}>
                    <button
                      onClick={() => setViewMode('list')}
                      style={viewSwitchButtonStyle}
                    >
                      <ListIcon sx={{ fontSize: 18, marginRight: '4px', verticalAlign: 'middle' }} />
                      リスト表示
                    </button>
                    <MapView
                      spots={spots}
                      userLocation={location}
                      onSpotClick={setSelectedSpot}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const containerStyle = {
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
};

const headerStyle = {
  padding: '20px 16px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

const contentStyle = {
  backgroundColor: '#fff',
  minHeight: 'calc(100vh - 80px)',
};

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  fontSize: '18px',
};

const errorStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  fontSize: '18px',
  color: 'red',
  padding: '20px',
  textAlign: 'center',
};

const welcomeContainerStyle = {
  textAlign: 'center',
  padding: '48px 24px',
  maxWidth: '500px',
  margin: '0 auto',
};

const welcomeIconStyle = {
  fontSize: '64px',
  marginBottom: '24px',
  animation: 'pulse 2s ease-in-out infinite',
};

const welcomeTitleStyle = {
  margin: '0 0 16px 0',
  fontSize: '22px',
  fontWeight: '700',
  color: '#333',
  lineHeight: '1.4',
};

const welcomeDescriptionStyle = {
  margin: '0 0 32px 0',
  fontSize: '15px',
  color: '#666',
  lineHeight: '1.6',
};

const buttonGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '32px',
};

const primaryButtonStyle = (disabled) => ({
  width: '100%',
  padding: '16px 24px',
  backgroundColor: disabled ? '#ccc' : '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '700',
  cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: disabled ? 'none' : '0 4px 12px rgba(76, 175, 80, 0.3)',
});

const secondaryButtonStyle = {
  width: '100%',
  padding: '16px 24px',
  backgroundColor: '#fff',
  color: '#4CAF50',
  border: '2px solid #4CAF50',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const errorMessageStyle = {
  padding: '12px 16px',
  backgroundColor: '#ffebee',
  color: '#c62828',
  borderRadius: '8px',
  fontSize: '14px',
  marginBottom: '24px',
};

const featureListStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '12px',
  padding: '24px 0 0 0',
  borderTop: '1px solid #e0e0e0',
};

const featureItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const featureIconStyle = {
  fontSize: '20px',
};

const featureTextStyle = {
  fontSize: '13px',
  color: '#666',
  fontWeight: '500',
};

const locationBarStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '16px',
  backgroundColor: '#f8f9fa',
  borderBottom: '1px solid #e0e0e0',
};

const refreshButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#fff',
  color: '#4CAF50',
  border: '1px solid #4CAF50',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const loadingContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 20px',
  textAlign: 'center',
};

const spinnerStyle = {
  fontSize: '48px',
  animation: 'spin 1s linear infinite',
};

const emptyStateStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 24px',
  textAlign: 'center',
};

const mapButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 'bold',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const viewSwitchButtonStyle = {
  position: 'absolute',
  top: '16px',
  right: '16px',
  zIndex: 1000,
  padding: '10px 20px',
  backgroundColor: '#fff',
  color: '#333',
  border: '2px solid #4CAF50',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
};

export default App;
