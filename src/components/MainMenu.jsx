import { useState } from 'react';
import useGameStore from '../store/gameStore';
import { motion } from 'framer-motion';

function MainMenu() {
  const { startGame, loadGame, difficulty } = useGameStore();
  const [showHow, setShowHow] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);

  const hasSave = localStorage.getItem('starwars_save') !== null;

  const handleStart = () => {
    useGameStore.setState({ difficulty: selectedDifficulty });
    startGame();
  };

  const handleLoad = () => {
    if (loadGame()) {
      // Game loaded successfully
    } else {
      alert('No saved game found!');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="menu-overlay">
      <motion.div
        className="menu-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="menu-title" variants={itemVariants}>
          ⚔️ STAR WARS ⚔️<br />
          <span style={{ fontSize: '2rem' }}>GALAXY DEFENSE</span>
        </motion.h1>

        <motion.p className="menu-subtitle" variants={itemVariants}>
          Defend the galaxy from the Empire!
        </motion.p>

        {!showHow ? (
          <>
            <motion.div variants={itemVariants}>
              <h3 style={{ color: 'var(--color-primary)', marginBottom: '10px', textAlign: 'center' }}>
                Select Difficulty
              </h3>
              <div className="difficulty-selector">
                {['easy', 'normal', 'hard', 'extreme'].map(diff => (
                  <button
                    key={diff}
                    className={`difficulty-option ${selectedDifficulty === diff ? 'selected' : ''}`}
                    onClick={() => setSelectedDifficulty(diff)}
                  >
                    {diff.toUpperCase()}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div className="menu-buttons" variants={itemVariants}>
              <button className="menu-button primary" onClick={handleStart}>
                🎮 NEW GAME
              </button>

              {hasSave && (
                <button className="menu-button" onClick={handleLoad}>
                  💾 LOAD GAME
                </button>
              )}

              <button className="menu-button" onClick={() => setShowHow(true)}>
                📖 HOW TO PLAY
              </button>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div className="menu-info" variants={itemVariants}>
              <h3>🎯 Objective</h3>
              <p>Defend against endless waves of Imperial forces!</p>

              <h3 style={{ marginTop: '20px' }}>🎮 Controls</h3>
              <p><strong>A/D or Arrow Keys:</strong> Move left/right</p>
              <p><strong>1-4 or Q/E/R/F:</strong> Use skills</p>
              <p><strong>ESC or P:</strong> Pause game</p>

              <h3 style={{ marginTop: '20px' }}>⚔️ Skills</h3>
              <p><strong>Blaster (1/Q):</strong> Rapid fire projectile</p>
              <p><strong>Grenade (2/E):</strong> Area explosion</p>
              <p><strong>Shield (3/R):</strong> Temporary shield boost</p>
              <p><strong>Dash (4/F):</strong> Quick dodge movement</p>

              <h3 style={{ marginTop: '20px' }}>💡 Tips</h3>
              <p>• Collect powerups dropped by enemies</p>
              <p>• Manage your energy wisely</p>
              <p>• Level up to increase stats</p>
              <p>• Watch out for boss waves!</p>
            </motion.div>

            <motion.div className="menu-buttons" variants={itemVariants}>
              <button className="menu-button" onClick={() => setShowHow(false)}>
                ← BACK TO MENU
              </button>
            </motion.div>
          </>
        )}

        <motion.p
          style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', opacity: 0.6 }}
          variants={itemVariants}
        >
          May the Force be with you!
        </motion.p>
      </motion.div>
    </div>
  );
}

export default MainMenu;
