'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Home, Target, TrendingUp, Settings, CheckSquare, LogOut, User } from 'lucide-react';

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Trackerr
            </Link>
          </div>
          
          {session ? (
            <>
              <div className="flex items-center space-x-8">
                <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link href="/goals" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  <Target className="h-5 w-5" />
                  <span>Goals</span>
                </Link>
                <Link href="/habits" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  <CheckSquare className="h-5 w-5" />
                  <span>Habits</span>
                </Link>
                <Link href="/analytics" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  <TrendingUp className="h-5 w-5" />
                  <span>Analytics</span>
                </Link>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="h-5 w-5" />
                  <span className="text-sm">{session.user?.email}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center">
              <Link 
                href="/api/auth/signin"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}