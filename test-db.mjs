import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://powrxrjblbxrfrqskvye.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvd3J4cmpibGJ4cmZycXNrdnllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzOTM4NTEsImV4cCI6MjA3Njk2OTg1MX0.XUz3x08l2DqFqCW2AnuVYXypTdn-2-aFpis6e0IhoI8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testQuery() {
  console.log('Testing Supabase connection...\n');

  // Test 1: Simple fetch
  const { data, error } = await supabase
    .from('spots')
    .select('*');

  console.log('Test 1 - Fetch all spots:');
  console.log('Success:', !error);
  console.log('Count:', data?.length);
  console.log('Error:', error);
  if (data && data.length > 0) {
    console.log('Sample spot:', data[0]);
  }
  console.log('---\n');

  // Test 2: Simulating app query with filters
  const testLat = 35.6762;
  const testLng = 139.6503;
  const radiusKm = 20;

  const { data: filteredData, error: filteredError } = await supabase
    .from('spots')
    .select('*')
    .order('created_at', { ascending: false });

  console.log('Test 2 - App-style query:');
  console.log('Success:', !filteredError);
  console.log('Count:', filteredData?.length);
  console.log('Error:', filteredError);

  if (filteredData) {
    // Calculate distances
    const spotsWithDistance = filteredData.map(spot => {
      const distance = calculateDistance(testLat, testLng, parseFloat(spot.lat), parseFloat(spot.lng));
      return { ...spot, distance };
    });

    const nearbySpots = spotsWithDistance.filter(spot => spot.distance <= radiusKm);
    console.log('Spots within', radiusKm, 'km:', nearbySpots.length);

    if (nearbySpots.length > 0) {
      console.log('Nearest spot:', nearbySpots[0].name, '-', nearbySpots[0].distance.toFixed(2), 'km');
    }
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
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

testQuery().catch(console.error);
