import React, { useRef } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import {
  CreditCard,
  Download,
  Share2,
  ShieldCheck,
  QrCode,
  Sparkles,
  Wifi,
  Printer,
} from 'lucide-react';
import { Logo } from '../common/Logo';

export const DigitalCardView: React.FC = () => {
  const { currentUser, addToast } = useLibrary();
  const cardRef = useRef<HTMLDivElement>(null);

  const name = currentUser?.name || 'Aarav Sharma';
  const studentId = currentUser?.studentId || 'CS2026-084';
  const email = currentUser?.email || 'aarav.sharma@librosense.edu';
  const department = currentUser?.department || 'Computer Science & Engineering';
  const role = currentUser?.role || 'Student';
  const avatar =
    currentUser?.avatarUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';

  const handleDownloadCard = () => {
    // Generate clean canvas capture for instant PNG download
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 640, 400);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(0.5, '#1e1b4b');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.roundRect(0, 0, 640, 400, 24);
    ctx.fill();

    // Border
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Header Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px system-ui';
    ctx.fillText('LibroSense Central Library', 30, 50);

    ctx.fillStyle = '#818cf8';
    ctx.font = '12px system-ui';
    ctx.fillText('OFFICIAL DIGITAL ACADEMIC CARD', 30, 72);

    // Member Details
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px system-ui';
    ctx.fillText(name, 30, 160);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px system-ui';
    ctx.fillText(`ID: ${studentId}`, 30, 190);
    ctx.fillText(`Role: ${role} | Dept: ${department}`, 30, 215);
    ctx.fillText(`Email: ${email}`, 30, 240);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 13px system-ui';
    ctx.fillText('STATUS: ACTIVE MEMBER IN GOOD STANDING', 30, 310);

    // Library Barcode Lines simulation
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 40; i++) {
      const w = (i % 3 === 0 ? 4 : 2);
      ctx.fillRect(440 + i * 4, 270, w, 40);
    }
    ctx.font = '10px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(studentId, 460, 325);

    // Trigger download
    const link = document.createElement('a');
    link.download = `LibroSense-Card-${studentId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    addToast('Card Downloaded', 'Digital library pass saved as high-resolution PNG image.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-500" />
            Digital Smart Library Card
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Your university credential for automated turnstiles, self-checkout kiosks, and borrow rights
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Print Pass</span>
          </button>

          <button
            onClick={handleDownloadCard}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all transform active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Card (PNG)</span>
          </button>
        </div>
      </div>

      {/* Card Presentation Showcase */}
      <div className="flex flex-col items-center justify-center py-6 sm:py-10">
        <div
          ref={cardRef}
          className="w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white shadow-2xl ring-1 ring-white/20 relative overflow-hidden border border-indigo-500/30 transform transition-transform duration-300 hover:scale-[1.02]"
        >
          {/* Holographic glowing swirls */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-500/10 blur-2xl pointer-events-none" />

          {/* Top Bar of the Card */}
          <div className="relative z-10 flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <Logo size="sm" lightText />
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-cyan-400 rotate-90" />
              <span className="text-[10px] font-mono tracking-widest text-indigo-300 uppercase">
                NFC RFID
              </span>
            </div>
          </div>

          {/* Card Middle: Photo + Student Details */}
          <div className="relative z-10 flex items-center gap-5 my-6">
            <div className="relative shrink-0">
              <img
                src={avatar}
                alt={name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-indigo-400/50 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-white">
                <ShieldCheck className="w-3 h-3" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider mb-1">
                {role} ID PASS
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white truncate">
                {name}
              </h2>
              <div className="text-xs text-indigo-200/80 font-mono mt-0.5">
                {studentId}
              </div>
              <div className="text-[11px] text-slate-300 truncate mt-0.5">
                {department}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                {email}
              </div>
            </div>
          </div>

          {/* Card Bottom: Barcode & QR Code simulation */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Library Privileges (2025–2027)
              </div>
              <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                Valid at Central Stacks & Digital Terminals
              </p>
            </div>

            {/* Visual QR Code Box */}
            <div className="p-2 bg-white rounded-xl shadow-xs shrink-0 flex items-center justify-center">
              {/* SVG QR Code Pattern */}
              <svg className="w-12 h-12 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm4 4h4v4h-4v-4zm-4 2h2v2h-2v-2zm-2-2h2v2h-2v-2zm-4-4h2v2H8v-2zm2 4h2v4h-2v-4zm4 0h2v2h-2v-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Security watermark footer */}
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            256-Bit Encrypted Campus Signature
          </span>
          <span>&bull;</span>
          <span>Max Borrow Capacity: 4 Books</span>
        </div>
      </div>
    </div>
  );
};
