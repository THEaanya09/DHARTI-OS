import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { isProfileComplete } from '@/lib/profile-utils';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      let next = '/onboarding';

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('crop, latitude')
          .eq('id', user.id)
          .maybeSingle();

        if (isProfileComplete(profile)) {
          next = '/dashboard';
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // If there's an error or no code, redirect to login page with an error query
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}
