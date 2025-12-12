import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import '../styles/HUD.css';

function HUD() {
  const { player, wave, score, credits, level, useSkill, gameState, saveGame } = useGameStore();

  const getSkillColor = (skill) => {
    if (skill.cooldown > 0) return '#666';
    if (player.energy < skill.energy) return '#AA0000';
    return '#00FF00';
  };

  const getSkillProgress = (skill) => {
    if (skill.cooldown > 0) {
      return ((skill.maxCooldown - skill.cooldown) / skill.maxCooldown) * 100;
    }
    return 100;
  };

  const getHPColor = () => {
    const percent = player.hp / player.maxHp;
    if (percent > 0.5) return '#00FF00';
    if (percent > 0.25) return '#FFAA00';
    return '#FF0000';
  };

  const handleSave = () => {
    saveGame();
    useGameStore.getState().addNotification({
      type: 'success',
      message: 'Game Saved!',
      duration: 2000
    });
  };

  return (
    <div className="hud">
      {/* Top Bar */}
      <div className="hud-top">
        <motion.div
          className="hud-panel"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="hud-stat">
            <span className="hud-label">Level</span>
            <span className="hud-value">{level}</span>
          </div>
          <div className="hud-stat">
            <span className="hud-label">Wave</span>
            <span className="hud-value glow">{wave}</span>
          </div>
          <div className="hud-stat">
            <span className="hud-label">Score</span>
            <span className="hud-value">{score.toLocaleString()}</span>
          </div>
          <div className="hud-stat">
            <span className="hud-label">💰 Credits</span>
            <span className="hud-value" style={{ color: '#FFD700' }}>{credits}</span>
          </div>
        </motion.div>

        <motion.button
          className="save-button"
          onClick={handleSave}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          💾 SAVE
        </motion.button>
      </div>

      {/* Player Stats - Left Side */}
      <motion.div
        className="player-stats"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div className="stat-row">
          <span className="stat-label">⚔️ {player.name}</span>
          <span className="stat-value">Lv.{player.level}</span>
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

        {/* Shield Bar */}
        <div className="bar-container">
          <div className="bar-label">
            <span>🛡️ Shield</span>
            <span>{Math.ceil(player.shield)}/{player.maxShield}</span>
          </div>
          <div className="bar">
            <div
              className="bar-fill"
              style={{
                width: `${(player.shield / player.maxShield) * 100}%`,
                background: 'linear-gradient(90deg, #00D9FF, #0088CC)'
              }}
            />
          </div>
        </div>

        {/* Energy Bar */}
        <div className="bar-container">
          <div className="bar-label">
            <span>⚡ Energy</span>
            <span>{Math.ceil(player.energy)}/{player.maxEnergy}</span>
          </div>
          <div className="bar">
            <div
              className="bar-fill"
              style={{
                width: `${(player.energy / player.maxEnergy) * 100}%`,
                background: 'linear-gradient(90deg, #FFE81F, #FFA500)'
              }}
            />
          </div>
        </div>

        {/* XP Bar */}
        <div className="bar-container">
          <div className="bar-label">
            <span>✨ XP</span>
            <span>{Math.ceil(player.xp)}/{player.xpToNext}</span>
          </div>
          <div className="bar">
            <div
              className="bar-fill"
              style={{
                width: `${(player.xp / player.xpToNext) * 100}%`,
                background: 'linear-gradient(90deg, #9B59B6, #E74C3C)'
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Skills - Bottom */}
      <motion.div
        className="skills-container"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="skills-title">SKILLS</div>
        <div className="skills-grid">
          {player.skills.map((skill, index) => {
            const hotkey = index + 1;
            const altKey = ['Q', 'E', 'R', 'F'][index];
            const canUse = skill.cooldown === 0 && player.energy >= skill.energy;

            return (
              <motion.button
                key={skill.id}
                className={`skill-button ${!canUse ? 'disabled' : ''}`}
                onClick={() => useSkill(skill.id)}
                whileHover={canUse ? { scale: 1.05 } : {}}
                whileTap={canUse ? { scale: 0.95 } : {}}
              >
                <div className="skill-hotkey">{hotkey}/{altKey}</div>
                <div className="skill-icon">{['🔫', '💣', '🛡️', '💨'][index]}</div>
                <div className="skill-name">{skill.name}</div>
                <div className="skill-cost">⚡{skill.energy}</div>

                {/* Cooldown overlay */}
                {skill.cooldown > 0 && (
                  <div className="skill-cooldown">
                    <div
                      className="cooldown-progress"
                      style={{ height: `${getSkillProgress(skill)}%` }}
                    />
                    <span className="cooldown-text">{skill.cooldown.toFixed(1)}s</span>
                  </div>
                )}

                {/* Ready indicator */}
                {canUse && (
                  <div className="skill-ready" />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Stats Preview - Right Side */}
      <motion.div
        className="combat-stats"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div className="stats-title">COMBAT STATS</div>
        <div className="stat-item">
          <span>⚔️ Damage:</span>
          <span className="stat-num">{player.damage}</span>
        </div>
        <div className="stat-item">
          <span>⚡ Attack Speed:</span>
          <span className="stat-num">{player.attackSpeed.toFixed(1)}x</span>
        </div>
        <div className="stat-item">
          <span>🎯 Crit Chance:</span>
          <span className="stat-num">{(player.critChance * 100).toFixed(0)}%</span>
        </div>
        <div className="stat-item">
          <span>💥 Crit Damage:</span>
          <span className="stat-num">{player.critDamage.toFixed(1)}x</span>
        </div>

        <div className="stats-divider" />

        <div className="stat-item">
          <span>💀 Kills:</span>
          <span className="stat-num">{player.stats.enemiesKilled}</span>
        </div>
        <div className="stat-item">
          <span>🗡️ Damage Dealt:</span>
          <span className="stat-num">{Math.floor(player.stats.damageDealt)}</span>
        </div>
        <div className="stat-item">
          <span>🩹 Damage Taken:</span>
          <span className="stat-num">{Math.floor(player.stats.damageTaken)}</span>
        </div>
        <div className="stat-item">
          <span>🌊 Waves:</span>
          <span className="stat-num">{player.stats.wavesCompleted}</span>
        </div>
      </motion.div>
    </div>
  );
}

export default HUD;
