import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing. Please check .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 位置情報を基にスポットを取得（フィルター対応）
 * @param {number} lat - 緯度
 * @param {number} lng - 経度
 * @param {number} radiusKm - 検索半径（km）
 * @param {object} filters - フィルター条件
 * @returns {Promise<Array>}
 */
export async function getSpotsByLocation(lat, lng, radiusKm = 10, filters = {}) {
  try {
    let query = supabase.from('spots').select('*');

    // 駐車場フィルター
    if (filters.parking && filters.parking !== 'all') {
      query = query.eq('parking', filters.parking);
    }

    // ベビーカーフィルター
    if (filters.strollerFriendly) {
      query = query.eq('stroller_friendly', true);
    }

    // 授乳室フィルター
    if (filters.nursingRoom) {
      query = query.eq('nursing_room', true);
    }

    // おむつ台フィルター
    if (filters.diaperChange) {
      query = query.eq('diaper_change', true);
    }

    // 年齢層フィルター
    if (filters.ageRange && filters.ageRange !== 'all') {
      query = query.contains('age_range', [filters.ageRange]);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    // 距離計算
    const spotsWithDistance = data.map(spot => ({
      ...spot,
      distance: calculateDistance(lat, lng, spot.lat, spot.lng)
    }));

    // 距離フィルター適用
    const maxDistance = filters.distance && filters.distance !== 'all'
      ? parseInt(filters.distance)
      : radiusKm;

    // distance: 'all'の場合は距離制限なし
    const filteredSpots = filters.distance === 'all'
      ? spotsWithDistance
      : spotsWithDistance.filter(spot => spot.distance <= maxDistance);

    return filteredSpots.sort((a, b) => a.distance - b.distance);
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

/**
 * レビューを投稿
 */
export async function submitReview(spotId, userId, reviewData) {
  try {
    const { data, error } = await supabase
      .from('spot_reviews')
      .insert({
        spot_id: spotId,
        user_id: userId,
        rating: reviewData.rating,
        crowd_level: reviewData.crowdLevel,
        comment: reviewData.comment,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting review:', error);
    return { success: false, error };
  }
}

/**
 * スポットのレビューを取得
 */
export async function getSpotReviews(spotId, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('spot_reviews')
      .select('*')
      .eq('spot_id', spotId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

/**
 * お気に入りに追加
 */
export async function addFavorite(userId, spotId) {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: userId,
        spot_id: spotId,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error adding favorite:', error);
    return { success: false, error };
  }
}

/**
 * お気に入りから削除
 */
export async function removeFavorite(userId, spotId) {
  try {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('spot_id', spotId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error removing favorite:', error);
    return { success: false, error };
  }
}

/**
 * ユーザーのお気に入り一覧を取得
 */
export async function getUserFavorites(userId) {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('spot_id, spots(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(fav => fav.spots);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
}

/**
 * お気に入りチェック
 */
export async function isFavorited(userId, spotId) {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('spot_id', spotId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return !!data;
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
}

/**
 * 混雑報告を投稿
 */
export async function submitCrowdReport(spotId, userId, reportData) {
  try {
    const { data, error } = await supabase
      .from('crowd_reports')
      .insert({
        spot_id: spotId,
        user_id: userId,
        crowd_level: reportData.crowdLevel,
        stroller_crowded: reportData.strollerCrowded || false,
        parking_full: reportData.parkingFull || false,
        comment: reportData.comment,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting crowd report:', error);
    return { success: false, error };
  }
}

/**
 * 最新の混雑情報を取得（過去3時間）
 */
export async function getRecentCrowdLevel(spotId) {
  try {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('crowd_reports')
      .select('crowd_level')
      .eq('spot_id', spotId)
      .gte('reported_at', threeHoursAgo)
      .order('reported_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) return null;

    // 多数決で混雑度を決定
    const counts = { low: 0, medium: 0, high: 0 };
    data.forEach(report => {
      if (report.crowd_level) counts[report.crowd_level]++;
    });

    const maxLevel = Object.entries(counts).reduce((a, b) =>
      counts[a[0]] > counts[b[0]] ? a : b
    )[0];

    return maxLevel;
  } catch (error) {
    console.error('Error fetching crowd level:', error);
    return null;
  }
}

/**
 * ユーザースポット情報を投稿（要承認）
 */
export async function submitSpotSuggestion(userId, spotData) {
  try {
    const { data, error } = await supabase
      .from('user_spot_submissions')
      .insert({
        user_id: userId,
        name: spotData.name,
        address: spotData.address,
        description: spotData.description,
        parking: spotData.parking,
        stroller_friendly: spotData.strollerFriendly,
        nursing_room: spotData.nursingRoom,
        diaper_change: spotData.diaperChange,
        phone: spotData.phone,
        website: spotData.website,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting spot suggestion:', error);
    return { success: false, error };
  }
}

/**
 * ユーザーの投稿履歴を取得
 */
export async function getUserSubmissions(userId) {
  try {
    const { data, error } = await supabase
      .from('user_spot_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    return [];
  }
}

/**
 * 逆ジオコーディング：座標から住所を取得
 */
export async function reverseGeocode(lat, lng) {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=ja`
    );

    if (!response.ok) {
      throw new Error('Geocoding API request failed');
    }

    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      return {
        success: true,
        address: data.results[0].formatted_address,
        lat,
        lng,
      };
    } else {
      return {
        success: false,
        error: 'Address not found',
      };
    }
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * ジオコーディング：住所から座標を取得
 */
export async function geocodeAddress(address) {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}&language=ja`
    );

    if (!response.ok) {
      throw new Error('Geocoding API request failed');
    }

    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        success: true,
        address: data.results[0].formatted_address,
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      return {
        success: false,
        error: 'Location not found',
      };
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}
