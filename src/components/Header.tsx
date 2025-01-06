import React from 'react';
import { useDisconnect } from 'wagmi';
import { LogOut } from 'lucide-react';

export function Header() {
  const { disconnect } = useDisconnect();

  return (
    <div className="fixed top-0 left-0 right-0 bg-game-bg/95 backdrop-blur-sm border-b border-game-accent/10 p-3 z-10">
      <div className="max-w-5xl mx-auto flex justify-end">
        <button
          onClick={() => disconnect()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff5757] hover:bg-[#ff5757]/80 text-white text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </button>
      </div>
    </div>
  );
}