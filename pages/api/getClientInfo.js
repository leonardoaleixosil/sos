export default async function handler(req, res) {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();

    console.log('IP:', ip);
    console.log('Location Data:', data);

    res.status(200).json({
      ip: ip,
      city: data.city,
      region: data.region,
      country: data.country_name,
      latitude: data.latitude,
      longitude: data.longitude,
    });
  } catch (error) {
    console.error('Error fetching location data:', error);
    res.status(500).json({ error: 'Failed to fetch location data' });
  }
}