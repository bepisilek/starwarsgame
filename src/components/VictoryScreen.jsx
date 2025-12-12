import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';

function VictoryScreen() {
  const { player, score, wave, setGameState, nextWave, saveGame } = useGameStore();

  const handleContinue = () => {
    nextWave();
    setGameState('playing');
  };

  const handleMainMenu = () => {
    saveGame();
    setGameState('menu');
  };

  return (
    <div className="menu-overlay">
      <motion.div
        className="menu-container"
        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.7 }}
      >
        <motion.h1
          className="menu-title"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          🎉 VICTORY! 🎉
        </motion.h1>

        <motion.h2
          style={{ textAlign: 'center', color: 'var(--color-secondary)', marginBottom: '20px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Wave {wave} Complete!
        </motion.h2>

        <div className="stats-grid">
          <motion.div
            className="stat-card"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="stat-label">Score</div>
            <div className="stat-value">{score.toLocaleString()}</div>
          </motion.div>
          <motion.div
            className="stat-card"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="stat-label">Level</div>
            <div className="stat-value">{player.level}</div>
          </motion.div>
          <motion.div
            className="stat-card"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="stat-label">Enemies Defeated</div>
            <div className="stat-value">{player.stats.enemiesKilled}</div>
          </motion.div>
          <motion.div
            className="stat-card"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="stat-label">Total Damage</div>
            <div className="stat-value">{Math.floor(player.stats.damageDealt)}</div>
          </motion.div>
        </div>

        <motion.div
          className="menu-info"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <h3 style={{ textAlign: 'center' }}>🎁 Rewards</h3>
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--color-primary)' }}>
            + HP Restored<br />
            + Full Shield & Energy<br />
            + Bonus Score: {500 * wave}
          </p>
        </motion.div>

        <motion.div
          className="menu-buttons"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <button className="menu-button primary" onClick={handleContinue}>
            ⚔️ NEXT WAVE ({wave + 1})
          </button>
          <button className="menu-button" onClick={handleMainMenu}>
            🏠 MAIN MENU
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default VictoryScreen;
