import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';

function PauseMenu() {
  const { resumeGame, setGameState, saveGame, player } = useGameStore();

  const handleResume = () => {
    resumeGame();
  };

  const handleSave = () => {
    saveGame();
    useGameStore.getState().addNotification({
      type: 'success',
      message: 'Game Saved Successfully!',
      duration: 2000
    });
  };

  const handleMainMenu = () => {
    if (confirm('Return to main menu? Unsaved progress will be lost.')) {
      setGameState('menu');
    }
  };

  return (
    <div className="menu-overlay">
      <motion.div
        className="menu-container"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h1 className="menu-title">⏸️ PAUSED</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Level</div>
            <div className="stat-value">{player.level}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Kills</div>
            <div className="stat-value">{player.stats.enemiesKilled}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Waves</div>
            <div className="stat-value">{player.stats.wavesCompleted}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Damage</div>
            <div className="stat-value">{Math.floor(player.stats.damageDealt)}</div>
          </div>
        </div>

        <div className="menu-buttons">
          <button className="menu-button primary" onClick={handleResume}>
            ▶️ RESUME
          </button>
          <button className="menu-button" onClick={handleSave}>
            💾 SAVE GAME
          </button>
          <button className="menu-button danger" onClick={handleMainMenu}>
            🏠 MAIN MENU
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', opacity: 0.7, fontSize: '0.9rem' }}>
          Press ESC or P to resume
        </p>
      </motion.div>
    </div>
  );
}

export default PauseMenu;
