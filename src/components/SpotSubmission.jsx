import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import WcIcon from '@mui/icons-material/Wc';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';

/**
 * スポット情報投稿フォーム
 */
export function SpotSubmission({ onSubmit, onClose, initialLocation, onMapSelect }) {
  const [formData, setFormData] = useState({
    name: '',
    address: initialLocation?.address || '',
    description: '',
    parking: 'なし',
    strollerFriendly: false,
    nursingRoom: false,
    diaperChange: false,
    phone: '',
    website: '',
    lat: initialLocation?.lat || null,
    lng: initialLocation?.lng || null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.address.trim()) {
      alert('施設名と住所は必須です');
      return;
    }

    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
            新しいスポットを追加
          </h2>
          <button onClick={onClose} style={closeButtonStyle}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        <div style={contentStyle}>
          {/* 基本情報 */}
          <div style={sectionStyle}>
            <label style={labelStyle}>施設名 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="例: ○○公園"
              maxLength={100}
              style={inputStyle}
            />
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle}>
              <LocationOnIcon sx={{ fontSize: 16, marginRight: '4px', verticalAlign: 'middle' }} />
              住所 *
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="例: 東京都渋谷区..."
                maxLength={200}
                style={{ ...inputStyle, flex: 1 }}
              />
              {onMapSelect && (
                <button
                  type="button"
                  onClick={onMapSelect}
                  style={mapButtonStyle}
                  title="地図から選択"
                >
                  <MapIcon sx={{ fontSize: 20 }} />
                </button>
              )}
            </div>
            {formData.lat && formData.lng && (
              <div style={coordinateInfoStyle}>
                📍 座標: {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
              </div>
            )}
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle}>説明（任意）</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="施設の特徴やおすすめポイントを教えてください"
              maxLength={500}
              style={textareaStyle}
            />
            <div style={charCountStyle}>{formData.description.length} / 500</div>
          </div>

          {/* 連絡先情報 */}
          <div style={sectionStyle}>
            <label style={labelStyle}>
              <PhoneIcon sx={{ fontSize: 16, marginRight: '4px', verticalAlign: 'middle' }} />
              電話番号（任意）
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="例: 03-1234-5678"
              maxLength={20}
              style={inputStyle}
            />
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle}>
              <LanguageIcon sx={{ fontSize: 16, marginRight: '4px', verticalAlign: 'middle' }} />
              ウェブサイト（任意）
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="例: https://..."
              style={inputStyle}
            />
          </div>

          {/* 駐車場 */}
          <div style={sectionStyle}>
            <label style={labelStyle}>
              <LocalParkingIcon sx={{ fontSize: 16, marginRight: '4px', verticalAlign: 'middle' }} />
              駐車場
            </label>
            <div style={buttonGroupStyle}>
              <button
                onClick={() => handleChange('parking', 'なし')}
                style={
                  formData.parking === 'なし'
                    ? { ...optionButtonStyle, ...activeOptionButtonStyle }
                    : optionButtonStyle
                }
              >
                なし
              </button>
              <button
                onClick={() => handleChange('parking', '無料')}
                style={
                  formData.parking === '無料'
                    ? { ...optionButtonStyle, ...activeOptionButtonStyle }
                    : optionButtonStyle
                }
              >
                無料
              </button>
              <button
                onClick={() => handleChange('parking', '有料')}
                style={
                  formData.parking === '有料'
                    ? { ...optionButtonStyle, ...activeOptionButtonStyle }
                    : optionButtonStyle
                }
              >
                有料
              </button>
            </div>
          </div>

          {/* 設備情報 */}
          <div style={sectionStyle}>
            <label style={labelStyle}>設備情報</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={formData.strollerFriendly}
                  onChange={(e) => handleChange('strollerFriendly', e.target.checked)}
                  style={checkboxStyle}
                />
                <BabyChangingStationIcon sx={{ fontSize: 20, marginRight: '8px', verticalAlign: 'middle' }} />
                ベビーカーで入りやすい
              </label>

              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={formData.nursingRoom}
                  onChange={(e) => handleChange('nursingRoom', e.target.checked)}
                  style={checkboxStyle}
                />
                <LocalCafeIcon sx={{ fontSize: 20, marginRight: '8px', verticalAlign: 'middle' }} />
                授乳室あり
              </label>

              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={formData.diaperChange}
                  onChange={(e) => handleChange('diaperChange', e.target.checked)}
                  style={checkboxStyle}
                />
                <WcIcon sx={{ fontSize: 20, marginRight: '8px', verticalAlign: 'middle' }} />
                おむつ台あり
              </label>
            </div>
          </div>

          {/* 注意書き */}
          <div style={noticeStyle}>
            ※ 投稿された情報は運営による確認後、公開されます
          </div>

          {/* 送信ボタン */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name.trim() || !formData.address.trim()}
            style={
              isSubmitting || !formData.name.trim() || !formData.address.trim()
                ? { ...submitButtonStyle, ...disabledButtonStyle }
                : submitButtonStyle
            }
          >
            {isSubmitting ? (
              '送信中...'
            ) : (
              <>
                <SendIcon sx={{ fontSize: 18, marginRight: '8px' }} />
                投稿する
              </>
            )}
          </button>
        </div>
      </div>
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
  zIndex: 2000,
  display: 'flex',
  alignItems: 'flex-end',
};

const modalStyle = {
  width: '100%',
  maxHeight: '90vh',
  backgroundColor: '#fff',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
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
  overflowY: 'auto',
  flex: 1,
};

const sectionStyle = {
  marginBottom: '24px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
  fontSize: '14px',
  color: '#333',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  fontSize: '14px',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const textareaStyle = {
  width: '100%',
  minHeight: '100px',
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  fontSize: '14px',
  fontFamily: 'inherit',
  resize: 'vertical',
  boxSizing: 'border-box',
};

const charCountStyle = {
  textAlign: 'right',
  fontSize: '12px',
  color: '#999',
  marginTop: '4px',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '8px',
};

const optionButtonStyle = {
  flex: 1,
  padding: '12px',
  backgroundColor: '#fff',
  color: '#666',
  border: '2px solid #ddd',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const activeOptionButtonStyle = {
  backgroundColor: '#4CAF50',
  borderColor: '#4CAF50',
  color: '#fff',
  fontWeight: '600',
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
  cursor: 'pointer',
};

const checkboxStyle = {
  marginRight: '12px',
  width: '18px',
  height: '18px',
  cursor: 'pointer',
};

const noticeStyle = {
  padding: '12px',
  backgroundColor: '#fff3cd',
  border: '1px solid #ffc107',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#856404',
  marginBottom: '20px',
  textAlign: 'center',
};

const submitButtonStyle = {
  width: '100%',
  padding: '16px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '700',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
};

const disabledButtonStyle = {
  backgroundColor: '#ccc',
  cursor: 'not-allowed',
  boxShadow: 'none',
};

const mapButtonStyle = {
  padding: '12px',
  backgroundColor: '#2196F3',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '48px',
};

const coordinateInfoStyle = {
  marginTop: '8px',
  fontSize: '12px',
  color: '#666',
  backgroundColor: '#f5f5f5',
  padding: '8px',
  borderRadius: '6px',
};
