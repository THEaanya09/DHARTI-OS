/** Returns true when the farmer has finished onboarding (crop + location set). */
export function isProfileComplete(
  profile: { crop?: string | null; latitude?: number | null } | null | undefined,
): boolean {
  return Boolean(profile?.crop && profile.latitude != null);
}

export function postAuthPath(
  profile: { crop?: string | null; latitude?: number | null } | null | undefined,
): '/dashboard' | '/onboarding' {
  return isProfileComplete(profile) ? '/dashboard' : '/onboarding';
}
