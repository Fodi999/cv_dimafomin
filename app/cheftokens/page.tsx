import { redirect } from 'next/navigation';

/**
 * ChefTokens Redirect
 * 
 * This page redirects to the new /tokens route.
 * Decision: Rename for clarity (25.12.2025)
 * 
 * Old: /cheftokens (unclear naming)
 * New: /tokens (clear and consistent)
 */

export default function ChefTokensRedirect() {
  // Permanent redirect (301) for SEO
  redirect('/tokens');
}
