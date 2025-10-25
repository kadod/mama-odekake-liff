import { useState } from 'react';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import WcIcon from '@mui/icons-material/Wc';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

/**
 * フィルターパネルコンポーネント
 */
export function FilterPanel({ onFilterChange, onClose }) {
  const [filters, setFilters] = useState({
    distance: 'all',
    parking: 'all',
    strollerFriendly: false,
    nursingRoom: false,
    diaperChange: false,
    ageRange: 'all',
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      distance: 'all',
      parking: 'all',
      strollerFriendly: false,
      nursingRoom: false,
      diaperChange: false,
      ageRange: 'all',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FilterListIcon sx={{ fontSize: 24, color: '#4CAF50' }} />
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>条件で絞り込む</h2>
        </div>
        <button onClick={onClose} style={closeButtonStyle}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </button>
      </div>

      <div style={contentStyle}>
        {/* 距離 */}
        <div style={filterGroupStyle}>
          <div style={labelStyle}>
            <LocationOnIcon sx={{ fontSize: 20, color: '#666' }} />
            <span>距離</span>
          </div>
          <div style={buttonGroupStyle}>
            {['1', '3', '5', '10', 'all'].map((dist) => (
              <button
                key={dist}
                onClick={() => handleFilterChange('distance', dist)}
                style={
                  filters.distance === dist
                    ? { ...filterButtonStyle, ...activeButtonStyle }
                    : filterButtonStyle
                }
              >
                {dist === 'all' ? '指定なし' : `${dist}km`}
              </button>
            ))}
          </div>
        </div>

        {/* 駐車場 */}
        <div style={filterGroupStyle}>
          <div style={labelStyle}>
            <LocalParkingIcon sx={{ fontSize: 20, color: '#666' }} />
            <span>駐車場</span>
          </div>
          <div style={buttonGroupStyle}>
            {[
              { value: 'all', label: '指定なし' },
              { value: '無料', label: '無料' },
              { value: '有料', label: '有料' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterChange('parking', option.value)}
                style={
                  filters.parking === option.value
                    ? { ...filterButtonStyle, ...activeButtonStyle }
                    : filterButtonStyle
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 年齢層 */}
        <div style={filterGroupStyle}>
          <div style={labelStyle}>
            <ChildCareIcon sx={{ fontSize: 20, color: '#666' }} />
            <span>お子様の年齢</span>
          </div>
          <div style={buttonGroupStyle}>
            {[
              { value: 'all', label: '指定なし' },
              { value: '0-1', label: '0〜1歳' },
              { value: '1-3', label: '1〜3歳' },
              { value: '3-5', label: '3〜5歳' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterChange('ageRange', option.value)}
                style={
                  filters.ageRange === option.value
                    ? { ...filterButtonStyle, ...activeButtonStyle }
                    : filterButtonStyle
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 設備（トグルボタン） */}
        <div style={filterGroupStyle}>
          <div style={labelStyle}>
            <span style={{ fontWeight: '600', fontSize: '14px' }}>必須設備</span>
          </div>
          <div style={toggleGroupStyle}>
            <button
              onClick={() => handleFilterChange('strollerFriendly', !filters.strollerFriendly)}
              style={
                filters.strollerFriendly
                  ? { ...toggleButtonStyle, ...activeToggleButtonStyle }
                  : toggleButtonStyle
              }
            >
              <BabyChangingStationIcon sx={{ fontSize: 18 }} />
              <span>ベビーカーOK</span>
            </button>

            <button
              onClick={() => handleFilterChange('nursingRoom', !filters.nursingRoom)}
              style={
                filters.nursingRoom
                  ? { ...toggleButtonStyle, ...activeToggleButtonStyle }
                  : toggleButtonStyle
              }
            >
              <LocalCafeIcon sx={{ fontSize: 18 }} />
              <span>授乳室</span>
            </button>

            <button
              onClick={() => handleFilterChange('diaperChange', !filters.diaperChange)}
              style={
                filters.diaperChange
                  ? { ...toggleButtonStyle, ...activeToggleButtonStyle }
                  : toggleButtonStyle
              }
            >
              <WcIcon sx={{ fontSize: 18 }} />
              <span>おむつ台</span>
            </button>
          </div>
        </div>

        {/* アクションボタン */}
        <div style={actionGroupStyle}>
          <button onClick={handleClear} style={clearButtonStyle}>
            クリア
          </button>
        </div>
      </div>
    </div>
  );
}

const panelStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: '#fff',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 20px',
  borderBottom: '1px solid #e0e0e0',
  backgroundColor: '#fff',
  position: 'sticky',
  top: 0,
  zIndex: 10,
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

const contentStyle = {
  padding: '20px',
  flex: 1,
};

const filterGroupStyle = {
  marginBottom: '24px',
  paddingBottom: '24px',
  borderBottom: '1px solid #f0f0f0',
};

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '12px',
  fontWeight: '600',
  fontSize: '14px',
  color: '#333',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
};

const filterButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#fff',
  color: '#666',
  border: '1px solid #ddd',
  borderRadius: '20px',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const activeButtonStyle = {
  backgroundColor: '#4CAF50',
  color: '#fff',
  borderColor: '#4CAF50',
  fontWeight: '600',
};

const toggleGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const toggleButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 16px',
  backgroundColor: '#f8f9fa',
  color: '#666',
  border: '2px solid transparent',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const activeToggleButtonStyle = {
  backgroundColor: '#e8f5e9',
  color: '#4CAF50',
  borderColor: '#4CAF50',
  fontWeight: '600',
};

const actionGroupStyle = {
  marginTop: '24px',
  paddingTop: '24px',
  borderTop: '1px solid #e0e0e0',
};

const clearButtonStyle = {
  width: '100%',
  padding: '14px',
  backgroundColor: '#f5f5f5',
  color: '#666',
  border: 'none',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
};
