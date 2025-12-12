import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';

function DefeatScreen() {
  const { player, score, wave, level, startGame, setGameState, deleteSave } = useGameStore();

  const handleRetry = () => {
    startGame();
  };

  const handleMainMenu = () => {
    deleteSave();
    setGameState('menu');
  };

  return (
    <div className="menu-overlay">
      <motion.div
        className="menu-container"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.7 }}
      >
        <motion.h1
          className="menu-title"
          style={{ color: 'var(--color-danger)' }}
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          💀 DEFEATED 💀
        </motion.h1>

        <motion.h2
          style={{ textAlign: 'center', color: 'var(--color-text)', marginBottom: '20px', opacity: 0.8 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          The Empire has won this battle...
        </motion.h2>

        <div className="stats-grid">
          <motion.div
            className="stat-card"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="stat-label">Final Score</div>
            <div className="stat-value">{score.toLocaleString()}</div>
          </motion.div>
          <motion.div
            className="stat-card"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="stat-label">Level Reached</div>
            <div className="stat-value">{level}</div>
          </motion.div>
          <motion.div
            className="stat-card"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="stat-label">Waves Survived</div>
            <div className="stat-value">{wave}</div>
          </motion.div>
          <motion.div
            className="stat-card"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="stat-label">Enemies Defeated</div>
            <div className="stat-value">{player.stats.enemiesKilled}</div>
          </motion.div>
        </div>

        <motion.div
          className="menu-info"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <h3 style={{ textAlign: 'center' }}>📊 Final Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
            <div>
              <p><strong>💥 Damage Dealt:</strong></p>
              <p style={{ color: 'var(--color-primary)' }}>{Math.floor(player.stats.damageDealt)}</p>
            </div>
            <div>
              <p><strong>🩹 Damage Taken:</strong></p>
              <p style={{ color: 'var(--color-danger)' }}>{Math.floor(player.stats.damageTaken)}</p>
            </div>
            <div>
              <p><strong>⚔️ Skills Used:</strong></p>
              <p style={{ color: 'var(--color-secondary)' }}>{player.stats.skillsUsed}</p>
            </div>
            <div>
              <p><strong>🌊 Waves Completed:</strong></p>
              <p style={{ color: 'var(--color-success)' }}>{player.stats.wavesCompleted}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="menu-buttons"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <button className="menu-button primary" onClick={handleRetry}>
            🔄 TRY AGAIN
          </button>
          <button className="menu-button" onClick={handleMainMenu}>
            🏠 MAIN MENU
          </button>
        </motion.div>

        <motion.p
          style={{ textAlign: 'center', marginTop: '20px', opacity: 0.6, fontSize: '0.9rem', fontStyle: 'italic' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.2 }}
        >
          "Your focus determines your reality."
        </motion.p>
      </motion.div>
    </div>
  );
}

export default DefeatScreen;
