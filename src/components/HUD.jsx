import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import '../styles/HUD.css';

function HUD() {
  const { player, lives, score, level } = useGameStore();

  const getHPColor = () => {
    const percent = player.hp / player.maxHp;
    if (percent > 0.5) return '#00FF00';
    if (percent > 0.25) return '#FFAA00';
    return '#FF0000';
  };

  return (
    <div className="hud">
      {/* Top Bar */}
      <div className="hud-top">
        <motion.div
          className="hud-panel platformer-hud"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="hud-stat">
            <span className="hud-label">Score</span>
            <span className="hud-value glow">{score.toLocaleString()}</span>
          </div>
          <div className="hud-stat">
            <span className="hud-label">Lives</span>
            <span className="hud-value" style={{ color: '#FFD700' }}>
              {Array(lives).fill('❤️').join(' ')}
            </span>
          </div>
          <div className="hud-stat">
            <span className="hud-label">Level</span>
            <span className="hud-value">{level}</span>
          </div>
        </motion.div>
      </div>

      {/* Player HP - Left Side */}
      <motion.div
        className="player-stats platformer-stats"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div className="stat-row">
          <span className="stat-label">⚔️ Jedi Knight</span>
        </div>

        {/* HP Bar */}
        <div className="bar-container">
          <div className="bar-label">
            <span>HP</span>
            <span>{Math.ceil(player.hp)}/{player.maxHp}</span>
          </div>
          <div className="bar">
            <div
              className="bar-fill"
              style={{
                width: `${(player.hp / player.maxHp) * 100}%`,
                background: getHPColor()
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Controls - Bottom */}
      <motion.div
        className="controls-container"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="controls-title">CONTROLS</div>
        <div className="controls-grid">
          <div className="control-item">
            <div className="control-key">←→</div>
            <div className="control-label">Move</div>
          </div>
          <div className="control-item">
            <div className="control-key">A/D</div>
            <div className="control-label">Move</div>
          </div>
          <div className="control-item">
            <div className="control-key">SPACE</div>
            <div className="control-label">Jump</div>
          </div>
          <div className="control-item">
            <div className="control-key">X</div>
            <div className="control-label">Attack</div>
          </div>
          <div className="control-item">
            <div className="control-key">ESC</div>
            <div className="control-label">Pause</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default HUD;
