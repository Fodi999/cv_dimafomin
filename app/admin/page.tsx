import { redirect } from "next/navigation";

/**
 * Admin Root Redirect
 * 
 * /admin → /admin/dashboard (server-side)
 * No UI, instant redirect.
 */
export default function AdminIndex() {
  redirect("/admin/dashboard");
}
