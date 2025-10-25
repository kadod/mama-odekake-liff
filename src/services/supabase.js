import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing. Please check .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 位置情報を基にスポットを取得
 * @param {number} lat - 緯度
 * @param {number} lng - 経度
 * @param {number} radiusKm - 検索半径（km）
 * @returns {Promise<Array>}
 */
export async function getSpotsByLocation(lat, lng, radiusKm = 10) {
  try {
    const { data, error } = await supabase
      .from('spots')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // 距離計算してフィルタリング（簡易版）
    const spotsWithDistance = data.map(spot => ({
      ...spot,
      distance: calculateDistance(lat, lng, spot.lat, spot.lng)
    }));

    return spotsWithDistance
      .filter(spot => spot.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error('Error fetching spots:', error);
    return [];
  }
}

/**
 * 距離計算（ハバーサイン公式）
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 地球の半径（km）
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
