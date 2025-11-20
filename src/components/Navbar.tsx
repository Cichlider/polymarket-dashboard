// src/components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/markets" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-800 tracking-wider">
              PM Data Viewer
            </span>
          </Link>

          <nav className="flex space-x-4">
            <Link 
              href="/markets" 
              className="text-gray-600 hover:text-blue-600 transition duration-150 font-medium"
            >
              📊 市场概览
            </Link>
            <a 
              href="https://github.com/Cichlider/polymarket-dashboard" // 请替换为你的 GitHub URL
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition duration-150 font-medium"
            >
              💻 GitHub 仓库
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}