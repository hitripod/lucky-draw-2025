import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export function Card({ title, icon: Icon, children }: CardProps) {
  return (
    <div className="bg-game-card p-4 rounded-xl shadow-xl border border-game-accent/20">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="text-game-accent w-4 h-4" />
        <h2 className="text-lg font-bold text-[#f690c6]">{title}</h2>
      </div>
      {children}
    </div>
  );
}