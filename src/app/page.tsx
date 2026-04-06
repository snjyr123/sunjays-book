import DfsDashboard from '@/components/DfsDashboard';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F7F2] py-12 relative overflow-hidden">
      {/* Groovy Background Accents */}
      <div className="absolute top-[-10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-[#3b59df]/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[5%] -right-[5%] w-[30%] h-[30%] rounded-full bg-[#f49ac2]/10 blur-[100px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section with New Logo */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="relative mb-8 group transition-transform duration-500 hover:scale-105">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#3b59df] to-[#f49ac2] rounded-[40px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white p-2 rounded-[40px] shadow-2xl overflow-hidden">
              <Image
                src="/logo.png"
                alt="Sunjay's Book Logo"
                width={320}
                height={320}
                className="rounded-[32px]"
                priority
              />
              </div>
              </div>

              <div className="max-w-2xl space-y-3">
              <p className="text-xs font-black text-[#3b59df] uppercase tracking-[0.4em] drop-shadow-sm">Precision DFS Analytics</p>
              <p className="text-xl font-bold text-gray-500/80 leading-relaxed">
              Finding the <span className="text-[#f49ac2]">sweet spot</span> in real-time market data.
              </p>
              </div>
              </div>

              <DfsDashboard />

              {/* Footer Section */}
              <footer className="mt-20 pt-12 border-t border-gray-200/50 flex flex-col items-center">
              <div className="flex flex-wrap justify-center gap-8 w-full max-w-4xl">
              {/* About Developer */}
              <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 shadow-xl border border-white flex flex-col items-center gap-4 flex-1 min-w-[300px] transition-transform hover:scale-[1.02]">
              <div className="w-16 h-16 bg-[#3b59df] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="font-black text-gray-900 uppercase tracking-tight">About Developer</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Sunjay's Book Engine</p>
              </div>
              <a
                href="/developer_video.mp4"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 px-8 py-3 bg-gray-900 hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95"
              >
                Watch Story
              </a>
              </div>

              {/* Contact Us */}
              <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 shadow-xl border border-white flex flex-col items-center gap-4 flex-1 min-w-[300px] transition-transform hover:scale-[1.02]">
              <div className="w-16 h-16 bg-[#f49ac2] rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="font-black text-gray-900 uppercase tracking-tight">Contact Us</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Get in Touch</p>
              </div>
              <a
                href="/contact.jpg"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 px-8 py-3 bg-gray-900 hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95"
              >
                Reach Out
              </a>
              </div>          </div>
          <p className="mt-12 text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">© 2026 Sunjay's Book • All Rights Reserved</p>
        </footer>
      </div>
    </main>
  );
}
