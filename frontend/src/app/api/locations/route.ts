import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const apiKey = process.env.COUNTRY_STATE_CITY_API_KEY;

  if (!apiKey) {
    console.error('COUNTRY_STATE_CITY_API_KEY environment variable is not defined.');
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    if (type === 'states') {
      const res = await fetch('https://api.countrystatecity.in/v1/countries/IN/states', {
        headers: {
          'X-CSCAPI-KEY': apiKey,
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch states from upstream API: ${res.statusText}`);
      }
      const data = await res.json();
      return NextResponse.json(data);
    }

    if (type === 'cities') {
      const stateCode = searchParams.get('stateCode');
      if (!stateCode) {
        return NextResponse.json({ error: 'stateCode parameter is required' }, { status: 400 });
      }

      const res = await fetch(`https://api.countrystatecity.in/v1/countries/IN/states/${stateCode}/cities`, {
        headers: {
          'X-CSCAPI-KEY': apiKey,
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch cities from upstream API: ${res.statusText}`);
      }
      const data = await res.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (err: any) {
    console.error('Location API Proxy error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
