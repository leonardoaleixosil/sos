import { NextResponse } from 'next/server';

export async function GET(req) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || req.socket.remoteAddress;
  
  const response = await fetch(`https://ipapi.co/${ip}/json/`);
  const data = await response.json();

  return NextResponse.json({
    ip: ip,
    city: data.city,
    region: data.region,
    country: data.country_name,
    latitude: data.latitude,
    longitude: data.longitude,
  });
}