'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="main-footer py-12 bg-dark-surface/70 backdrop-blur-lg border-t border-border relative">
      <div className="container">
        <div className="footer-content flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="footer-logo mb-6 md:mb-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative">
                <Image
                  src="/byd-logo.png"
                  alt="BYD Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-xl font-bold">BYD 比亚迪汽车</div>
            </div>
          </div>
          
          <div className="footer-links flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link href="#hero-section" className="footer-link text-white/70 hover:text-white transition-colors">
              首页
            </Link>
            <Link href="#dashboard" className="footer-link text-white/70 hover:text-white transition-colors">
              销量数据
            </Link>
            <Link href="#detail-section" className="footer-link text-white/70 hover:text-white transition-colors">
              详细数据
            </Link>
            <Link href="#compare-section" className="footer-link text-white/70 hover:text-white transition-colors">
              对比分析
            </Link>
            <Link href="/admin" className="footer-link text-white/70 hover:text-white transition-colors">
              管理后台
            </Link>
          </div>
        </div>
        
        <div className="footer-copyright text-center text-white/50 text-sm">
          &copy; {new Date().getFullYear()} 比亚迪汽车销量数据分析平台 | 数据仅供参考
        </div>
      </div>
    </footer>
  );
} 