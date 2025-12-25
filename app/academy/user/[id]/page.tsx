import { redirect } from 'next/navigation';

/**
 * Academy User Profile Redirect
 * 
 * This page redirects to the unified profile page.
 * Decision: Option B - Redirect strategy (25.12.2025)
 * 
 * Reasoning:
 * - Quick implementation
 * - Zero data migration needed
 * - Keep both APIs separate initially
 * - Gradual consolidation later
 * 
 * Before: 274 lines of duplicate code
 * After: Simple redirect
 */

export default function AcademyUserRedirect({ 
  params 
}: { 
  params: { id: string } 
}) {
  // Permanent redirect (301) for SEO
  redirect(`/profile/${params.id}`);
}
