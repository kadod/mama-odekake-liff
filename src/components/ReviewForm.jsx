import { useState } from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

/**
 * レビュー投稿フォーム
 */
export function ReviewForm({ spot, onSubmit, onClose }) {
  const [rating, setRating] = useState(0);
  const [crowdLevel, setCrowdLevel] = useState(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('評価を選択してください');
      return;
    }

    setIsSubmitting(true);
    await onSubmit({
      rating,
      crowdLevel,
      comment: comment.trim(),
    });
    setIsSubmitting(false);
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
            {spot.name} のレビュー
          </h2>
          <button onClick={onClose} style={closeButtonStyle}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        <div style={contentStyle}>
          {/* 評価 */}
          <div style={sectionStyle}>
            <label style={labelStyle}>総合評価</label>
            <div style={ratingContainerStyle}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  style={starButtonStyle}
                >
                  {star <= rating ? (
                    <StarIcon sx={{ fontSize: 36, color: '#FFC107' }} />
                  ) : (
                    <StarOutlineIcon sx={{ fontSize: 36, color: '#ddd' }} />
                  )}
                </button>
              ))}
            </div>
            <div style={ratingTextStyle}>
              {rating === 0 && '評価を選択してください'}
              {rating === 1 && 'イマイチ'}
              {rating === 2 && 'もう少し'}
              {rating === 3 && '普通'}
              {rating === 4 && '良かった'}
              {rating === 5 && '最高！'}
            </div>
          </div>

          {/* 混雑度 */}
          <div style={sectionStyle}>
            <label style={labelStyle}>
              <PeopleIcon sx={{ fontSize: 18, marginRight: '6px', verticalAlign: 'middle' }} />
              混雑度（訪問時）
            </label>
            <div style={buttonGroupStyle}>
              <button
                onClick={() => setCrowdLevel('low')}
                style={
                  crowdLevel === 'low'
                    ? { ...crowdButtonStyle, ...activeCrowdButtonStyle, backgroundColor: '#4CAF50', borderColor: '#4CAF50' }
                    : crowdButtonStyle
                }
              >
                空いてた
              </button>
              <button
                onClick={() => setCrowdLevel('medium')}
                style={
                  crowdLevel === 'medium'
                    ? { ...crowdButtonStyle, ...activeCrowdButtonStyle, backgroundColor: '#FFC107', borderColor: '#FFC107' }
                    : crowdButtonStyle
                }
              >
                普通
              </button>
              <button
                onClick={() => setCrowdLevel('high')}
                style={
                  crowdLevel === 'high'
                    ? { ...crowdButtonStyle, ...activeCrowdButtonStyle, backgroundColor: '#F44336', borderColor: '#F44336' }
                    : crowdButtonStyle
                }
              >
                混んでた
              </button>
            </div>
          </div>

          {/* コメント */}
          <div style={sectionStyle}>
            <label style={labelStyle}>コメント（任意）</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="ベビーカーで行きやすかった、授乳室がきれいだった など..."
              maxLength={200}
              style={textareaStyle}
            />
            <div style={charCountStyle}>{comment.length} / 200</div>
          </div>

          {/* 送信ボタン */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            style={
              isSubmitting || rating === 0
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
  maxHeight: '85vh',
  backgroundColor: '#fff',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  animation: 'slideUp 0.3s ease-out',
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
  marginBottom: '12px',
  fontWeight: '600',
  fontSize: '14px',
  color: '#333',
};

const ratingContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '8px',
  marginBottom: '12px',
};

const starButtonStyle = {
  padding: 0,
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
};

const ratingTextStyle = {
  textAlign: 'center',
  fontSize: '16px',
  fontWeight: '600',
  color: '#4CAF50',
  minHeight: '24px',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '8px',
};

const crowdButtonStyle = {
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

const activeCrowdButtonStyle = {
  color: '#fff',
  fontWeight: '600',
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
