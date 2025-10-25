import { useState, useEffect } from 'react';
import { useLiff, useLocation } from './hooks/useLiff';
import { getSpotsByLocation } from './services/supabase';
import { SpotCard } from './components/SpotCard';
import { SpotDetail } from './components/SpotDetail';

function App() {
  const { isLoggedIn, isLoading: liffLoading, error: liffError, profile } = useLiff();
  const { location, isLoading: locationLoading, error: locationError, getLocation } = useLocation();
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [spotsLoading, setSpotsLoading] = useState(false);

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
        <h1 style={{ margin: 0, fontSize: '20px' }}>ママのおでかけスポット検索</h1>
        {profile && <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>こんにちは、{profile.displayName}さん</p>}
      </header>

      <div style={contentStyle}>
        {!location ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ marginBottom: '20px', fontSize: '16px' }}>
              現在地から近くのお出かけスポットを探します
            </p>
            <button
              onClick={getLocation}
              disabled={locationLoading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: locationLoading ? 'not-allowed' : 'pointer',
                opacity: locationLoading ? 0.6 : 1,
              }}
            >
              {locationLoading ? '位置情報取得中...' : '現在地で検索'}
            </button>
            {locationError && <p style={{ color: 'red', marginTop: '12px' }}>{locationError}</p>}
          </div>
        ) : (
          <>
            <div style={{ padding: '16px', backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                現在地: 緯度 {location.lat.toFixed(4)}, 経度 {location.lng.toFixed(4)}
              </p>
              <button
                onClick={getLocation}
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                再検索
              </button>
            </div>

            {spotsLoading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>読み込み中...</div>
            ) : spots.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <p>近くにスポットが見つかりませんでした</p>
              </div>
            ) : (
              <div style={{ padding: '16px' }}>
                <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold' }}>
                  近くのスポット（{spots.length}件）
                </h2>
                {spots.map((spot) => (
                  <SpotCard key={spot.id} spot={spot} onClick={setSelectedSpot} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const containerStyle = {
  minHeight: '100vh',
  backgroundColor: '#f5f5f5',
};

const headerStyle = {
  padding: '16px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const contentStyle = {
  backgroundColor: '#fff',
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

export default App;
