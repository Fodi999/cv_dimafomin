"use client";

import { useUser } from "@/contexts/UserContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TestUserPage() {
  const { user, isAuthenticated, token, refreshBalance } = useUser();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">User Context Debug</h1>
      
      <Card className="p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Authentication Status</h2>
          <p className="text-lg">
            <strong>isAuthenticated:</strong> 
            <span className={isAuthenticated ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
              {isAuthenticated ? "✅ YES" : "❌ NO"}
            </span>
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Token</h2>
          <p className="text-sm break-all">
            {token ? `${token.substring(0, 50)}...` : "❌ No token"}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">User Data</h2>
          {user ? (
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          ) : (
            <p className="text-red-600">❌ No user data</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">ChefTokens Balance</h2>
          <p className="text-3xl font-bold text-sky-600">
            {user?.chefTokens ?? "❌ undefined"} CT
          </p>
        </div>

        <Button onClick={refreshBalance} className="mt-4">
          Refresh Balance
        </Button>
      </Card>
    </div>
  );
}
