import { useState, useEffect } from 'react';
import liff from '@line/liff';

/**
 * LIFF SDKの初期化とユーザー情報取得
 */
export function useLiff() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const initLiff = async () => {
      try {
        const liffId = import.meta.env.VITE_LIFF_ID;

        if (!liffId) {
          throw new Error('LIFF ID is not configured. Please set VITE_LIFF_ID in .env');
        }

        await liff.init({ liffId });

        if (liff.isLoggedIn()) {
          setIsLoggedIn(true);
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
        } else {
          liff.login();
        }
      } catch (err) {
        console.error('LIFF initialization failed:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initLiff();
  }, []);

  return { isLoggedIn, isLoading, error, profile, liff };
}

/**
 * 位置情報取得フック
 */
export function useLocation() {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('このブラウザでは位置情報を取得できません');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        setError('位置情報の取得に失敗しました。設定をご確認ください。');
        console.error('Geolocation error:', err);
        setIsLoading(false);
      }
    );
  };

  return { location, isLoading, error, getLocation };
}
