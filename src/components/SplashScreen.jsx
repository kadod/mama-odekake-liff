import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import './SplashScreen.css';

export function SplashScreen() {
  return (
    <div className="splash-container">
      <div className="splash-content">
        {/* ロゴアイコン */}
        <div className="splash-icon-wrapper">
          <FamilyRestroomIcon className="splash-icon" />
        </div>

        {/* ロゴテキスト */}
        <div className="splash-logo-wrapper">
          <h1 className="splash-logo">ままっぷ</h1>
          <p className="splash-subtitle">ママのおでかけスポット検索</p>
        </div>

        {/* ローディングドット */}
        <div className="splash-loading">
          <span className="loading-dot dot-1"></span>
          <span className="loading-dot dot-2"></span>
          <span className="loading-dot dot-3"></span>
        </div>

        <p className="splash-text">初期化中...</p>
      </div>
    </div>
  );
}
