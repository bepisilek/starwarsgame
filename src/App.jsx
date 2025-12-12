import { useState, useEffect } from 'react';
import useGameStore from './store/gameStore';
import MainMenu from './components/MainMenu';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import PauseMenu from './components/PauseMenu';
import VictoryScreen from './components/VictoryScreen';
import DefeatScreen from './components/DefeatScreen';
import Notifications from './components/Notifications';
import Starfield from './components/Starfield';
import './styles/App.css';

function App() {
  const { gameState, gameUpdate } = useGameStore();
  const [lastTime, setLastTime] = useState(performance.now());

  useEffect(() => {
    let animationFrame;

    const gameLoop = (currentTime) => {
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
      setLastTime(currentTime);

      gameUpdate(deltaTime);

      animationFrame = requestAnimationFrame(gameLoop);
    };

    animationFrame = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [lastTime, gameUpdate]);

  return (
    <div className="app">
      <Starfield />

      {gameState === 'menu' && <MainMenu />}

      {(gameState === 'playing' || gameState === 'paused') && (
        <>
          <GameCanvas />
          <HUD />
          <Notifications />
        </>
      )}

      {gameState === 'paused' && <PauseMenu />}
      {gameState === 'victory' && <VictoryScreen />}
      {gameState === 'defeat' && <DefeatScreen />}
    </div>
  );
}

export default App;
