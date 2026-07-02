import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');

  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: 'latitude and longitude are required' },
      { status: 400 },
    );
  }

  try {
    const params = new URLSearchParams({ latitude, longitude });
    const response = await fetch(`${BACKEND_URL}/soil?${params.toString()}`, {
      next: { revalidate: 86400 },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Soil proxy error:', error);
    return NextResponse.json(
      { error: 'Unable to reach the soil service. Is the backend running?' },
      { status: 502 },
    );
  }
}
