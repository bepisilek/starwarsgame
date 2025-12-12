import { useEffect, useRef } from 'react';
import useGameStore from '../store/gameStore';
import '../styles/GameCanvas.css';

function GameCanvas() {
  const canvasRef = useRef(null);
  const {
    player,
    enemies,
    projectiles,
    particles,
    explosions,
    powerups,
    movePlayer,
    stopPlayer,
    useSkill,
    pauseGame,
    resumeGame,
    gameState
  } = useGameStore();

  const keysPressed = useRef(new Set());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') {
        if (e.key === 'Escape' && gameState === 'paused') {
          resumeGame();
        } else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
          pauseGame();
        }
        return;
      }

      keysPressed.current.add(e.key.toLowerCase());

      // Movement
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        movePlayer('left');
      }
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        movePlayer('right');
      }

      // Skills
      if (e.key === '1' || e.key === 'q' || e.key === 'Q') {
        useSkill('blaster');
      }
      if (e.key === '2' || e.key === 'e' || e.key === 'E') {
        useSkill('grenade');
      }
      if (e.key === '3' || e.key === 'r' || e.key === 'R') {
        useSkill('shield');
      }
      if (e.key === '4' || e.key === 'f' || e.key === 'F') {
        useSkill('dash');
      }

      // Pause
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        pauseGame();
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current.delete(e.key.toLowerCase());

      const key = e.key.toLowerCase();
      if ((key === 'a' || key === 'arrowleft') && !keysPressed.current.has('d') && !keysPressed.current.has('arrowright')) {
        stopPlayer();
      }
      if ((key === 'd' || key === 'arrowright') && !keysPressed.current.has('a') && !keysPressed.current.has('arrowleft')) {
        stopPlayer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [movePlayer, stopPlayer, useSkill, pauseGame, resumeGame, gameState]);

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 232, 31, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw powerups
      powerups.forEach(powerup => {
        let color = '#FFFFFF';
        let symbol = '?';

        switch (powerup.type) {
          case 'health':
            color = '#00FF00';
            symbol = '❤️';
            break;
          case 'shield':
            color = '#00D9FF';
            symbol = '🛡️';
            break;
          case 'energy':
            color = '#FFE81F';
            symbol = '⚡';
            break;
          case 'credits':
            color = '#FFD700';
            symbol = '💰';
            break;
        }

        ctx.save();
        ctx.fillStyle = color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;

        // Floating animation
        const floatOffset = Math.sin(Date.now() / 200) * 5;

        ctx.beginPath();
        ctx.arc(powerup.position.x, powerup.position.y + floatOffset, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(symbol, powerup.position.x, powerup.position.y + floatOffset + 8);
        ctx.restore();
      });

      // Draw particles
      particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.lifetime;
        ctx.beginPath();
        ctx.arc(particle.position.x, particle.position.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw explosions
      explosions.forEach(explosion => {
        const progress = 1 - (explosion.lifetime / 0.5);
        const currentRadius = explosion.radius * progress;

        ctx.strokeStyle = '#FF6600';
        ctx.lineWidth = 5;
        ctx.globalAlpha = explosion.lifetime / 0.5;
        ctx.beginPath();
        ctx.arc(explosion.position.x, explosion.position.y, currentRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#FFAA00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(explosion.position.x, explosion.position.y, currentRadius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Draw projectiles
      projectiles.forEach(proj => {
        ctx.save();
        ctx.fillStyle = proj.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = proj.color;

        if (proj.type === 'blaster') {
          ctx.fillRect(proj.position.x, proj.position.y, proj.size.w, proj.size.h);
        } else {
          ctx.beginPath();
          ctx.arc(proj.position.x, proj.position.y, proj.size.w / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // Draw enemies
      enemies.forEach(enemy => {
        if (enemy.isDead) {
          // Death animation
          ctx.globalAlpha = 0.3;
        }

        ctx.save();

        // Enemy body
        ctx.fillStyle = enemy.color;
        ctx.fillRect(
          enemy.position.x,
          enemy.position.y,
          enemy.size.w,
          enemy.size.h
        );

        // Border
        ctx.strokeStyle = enemy.isBoss ? '#FFE81F' : '#FFFFFF';
        ctx.lineWidth = enemy.isBoss ? 3 : 1;
        ctx.strokeRect(
          enemy.position.x,
          enemy.position.y,
          enemy.size.w,
          enemy.size.h
        );

        // Boss glow
        if (enemy.isBoss) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#FFE81F';
          ctx.strokeRect(
            enemy.position.x,
            enemy.position.y,
            enemy.size.w,
            enemy.size.h
          );
        }

        // Eyes
        ctx.fillStyle = enemy.isAttacking ? '#FF0000' : '#FFE81F';
        const eyeY = enemy.position.y + enemy.size.h * 0.3;
        ctx.beginPath();
        ctx.arc(enemy.position.x + enemy.size.w * 0.3, eyeY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(enemy.position.x + enemy.size.w * 0.7, eyeY, 3, 0, Math.PI * 2);
        ctx.fill();

        // HP bar
        const hpPercent = enemy.hp / enemy.maxHp;
        const barWidth = enemy.size.w;
        const barHeight = 4;
        const barY = enemy.position.y - 10;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(enemy.position.x, barY, barWidth, barHeight);

        ctx.fillStyle = hpPercent > 0.5 ? '#00FF00' : hpPercent > 0.25 ? '#FFAA00' : '#FF0000';
        ctx.fillRect(enemy.position.x, barY, barWidth * hpPercent, barHeight);

        // Shield bar
        if (enemy.shield > 0) {
          const shieldPercent = enemy.shield / enemy.maxShield;
          const shieldBarY = barY - 6;

          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(enemy.position.x, shieldBarY, barWidth, 3);

          ctx.fillStyle = '#00D9FF';
          ctx.fillRect(enemy.position.x, shieldBarY, barWidth * shieldPercent, 3);
        }

        ctx.restore();
        ctx.globalAlpha = 1;
      });

      // Draw player
      ctx.save();

      // Player body
      const pColor = player.shield > 0 ? '#00D9FF' : '#FFE81F';
      ctx.fillStyle = pColor;
      ctx.fillRect(player.position.x, player.position.y, 50, 60);

      // Player border
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(player.position.x, player.position.y, 50, 60);

      // Shield effect
      if (player.shield > 0) {
        ctx.strokeStyle = '#00D9FF';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00D9FF';
        ctx.strokeRect(player.position.x - 5, player.position.y - 5, 60, 70);
      }

      // Face
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(player.position.x + 15, player.position.y + 25, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(player.position.x + 35, player.position.y + 25, 3, 0, Math.PI * 2);
      ctx.fill();

      // Direction indicator
      const direction = player.direction === 'right' ? '→' : '←';
      ctx.fillStyle = '#FFE81F';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(direction, player.position.x + 25, player.position.y + 50);

      ctx.restore();
    };

    let animationFrame;
    const animate = () => {
      render();
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [player, enemies, projectiles, particles, explosions, powerups]);

  return <canvas ref={canvasRef} className="game-canvas" />;
}

export default GameCanvas;
