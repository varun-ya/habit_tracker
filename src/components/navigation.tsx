'use client';

import Link from 'next/link';
import { Home, Target, TrendingUp, CheckSquare } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Trackerr
            </Link>
          </div>
          
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
        </div>
      </div>
    </nav>
  );
}