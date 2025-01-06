import React from 'react';
import { GameInterface } from './components/GameInterface';
import { Providers } from './providers/Providers';

export default function App() {
  return (
    <Providers>
      <GameInterface />
    </Providers>
  );
}