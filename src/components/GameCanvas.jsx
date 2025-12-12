import { useEffect, useRef } from 'react';
import useGameStore from '../store/gameStore';
import { GROUND_Y } from '../store/gameStore';
import '../styles/GameCanvas.css';

function GameCanvas() {
  const canvasRef = useRef(null);
  const {
    player,
    platforms,
    enemies,
    projectiles,
    particles,
    powerups,
    camera,
    setKey,
    playerJump,
    playerAttack,
    pauseGame,
    resumeGame,
    gameState
  } = useGameStore();

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

  // Input handling
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

      // Movement
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        setKey('left', true);
      }
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        setKey('right', true);
      }

      // Jump
      if (e.key === ' ' || e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        e.preventDefault();
        playerJump();
      }

      // Attack
      if (e.key === 'x' || e.key === 'X' || e.key === 'Control') {
        playerAttack();
      }

      // Pause
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        pauseGame();
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        setKey('left', false);
      }
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        setKey('right', false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setKey, playerJump, playerAttack, pauseGame, resumeGame, gameState]);

  // Draw Jedi character
  const drawJedi = (ctx, x, y, width, height, direction, isAttacking, invulnerable) => {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    if (direction === 'left') ctx.scale(-1, 1);

    // Flicker if invulnerable
    if (invulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    // Body (brown robes)
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.moveTo(-width / 4, -height / 3);
    ctx.lineTo(-width / 3, height / 2);
    ctx.lineTo(width / 3, height / 2);
    ctx.lineTo(width / 4, -height / 3);
    ctx.closePath();
    ctx.fill();

    // Belt
    ctx.fillStyle = '#654321';
    ctx.fillRect(-width / 3, height / 6, width * 2 / 3, height / 12);

    // Head (flesh tone)
    ctx.fillStyle = '#FFD7A3';
    ctx.beginPath();
    ctx.arc(0, -height / 3, width / 3, 0, Math.PI * 2);
    ctx.fill();

    // Hair (brown)
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.arc(0, -height / 3 - width / 6, width / 3, 0, Math.PI);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-width / 8, -height / 3, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width / 8, -height / 3, 2, 0, Math.PI * 2);
    ctx.fill();

    // Lightsaber handle
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(width / 4, -height / 8, width / 6, height / 3);

    // Lightsaber blade (when attacking)
    if (isAttacking) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00FFFF';
      ctx.fillStyle = '#00FFFF';
      ctx.fillRect(width / 4 + width / 12 - 2, -height / 8 - height / 2, 4, height / 1.5);

      // Bright core
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(width / 4 + width / 12 - 1, -height / 8 - height / 2, 2, height / 1.5);
    }

    ctx.restore();
  };

  // Draw Stormtrooper
  const drawStormtrooper = (ctx, x, y, width, height, facingLeft) => {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    if (facingLeft) ctx.scale(-1, 1);

    // Body (white armor)
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;

    // Torso
    ctx.fillRect(-width / 3, -height / 4, width * 2 / 3, height * 2 / 3);
    ctx.strokeRect(-width / 3, -height / 4, width * 2 / 3, height * 2 / 3);

    // Helmet
    ctx.beginPath();
    ctx.arc(0, -height / 3, width / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Helmet details (black visor)
    ctx.fillStyle = '#000000';
    ctx.fillRect(-width / 4, -height / 3 - 5, width / 2, 10);

    // Eyes (T-shaped visor)
    ctx.fillRect(-3, -height / 3, 6, 15);

    // Blaster
    ctx.fillStyle = '#404040';
    ctx.fillRect(width / 3, -height / 8, width / 4, height / 12);

    // Black details on armor
    ctx.fillStyle = '#000000';
    ctx.fillRect(-width / 8, 0, width / 4, height / 16);

    ctx.restore();
  };

  // Draw Probe Droid
  const drawProbeDroid = (ctx, x, y, width, height) => {
    ctx.save();

    // Main sphere body
    ctx.fillStyle = '#404040';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(x + width / 2, y + height / 2, width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Eye/sensor (red)
    ctx.fillStyle = '#FF0000';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#FF0000';
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height / 2, width / 4, 0, Math.PI * 2);
    ctx.fill();

    // Antennas
    ctx.strokeStyle = '#606060';
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2;

    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI * 2 * i) / 4;
      const startX = x + width / 2 + Math.cos(angle) * width / 2;
      const startY = y + height / 2 + Math.sin(angle) * height / 2;
      const endX = startX + Math.cos(angle) * width / 3;
      const endY = startY + Math.sin(angle) * height / 3;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Antenna tip
      ctx.fillStyle = '#808080';
      ctx.beginPath();
      ctx.arc(endX, endY, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  // Draw Scout Trooper
  const drawScoutTrooper = (ctx, x, y, width, height, facingLeft) => {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    if (facingLeft) ctx.scale(-1, 1);

    // Body (gray/black armor)
    ctx.fillStyle = '#505050';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;

    // Torso (slimmer than stormtrooper)
    ctx.fillRect(-width / 4, -height / 4, width / 2, height * 2 / 3);
    ctx.strokeRect(-width / 4, -height / 4, width / 2, height * 2 / 3);

    // Helmet (distinctive scout helmet)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(0, -height / 3, width / 3, width / 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Black visor
    ctx.fillStyle = '#000000';
    ctx.fillRect(-width / 4, -height / 3 - 8, width / 2, 16);

    // Blaster rifle
    ctx.fillStyle = '#303030';
    ctx.fillRect(width / 3, -height / 6, width / 3, height / 10);

    ctx.restore();
  };

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(-camera.x, -camera.y);

      // Draw space background
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(camera.x, camera.y, canvas.width, canvas.height);

      // Draw stars
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 100; i++) {
        const x = (i * 131) % 2000;
        const y = (i * 197) % 600;
        const size = (i % 3) + 1;
        if (x >= camera.x - 50 && x <= camera.x + canvas.width + 50) {
          ctx.fillRect(x, y, size, size);
        }
      }

      // Draw distant planets/moons
      ctx.fillStyle = 'rgba(100, 100, 150, 0.3)';
      ctx.beginPath();
      ctx.arc(1500, 150, 80, 0, Math.PI * 2);
      ctx.fill();

      // Draw platforms
      platforms.forEach(platform => {
        if (platform.type === 'ground') {
          // Ground platform - Death Star floor style
          ctx.fillStyle = '#2a2a3a';
          ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

          // Grid pattern
          ctx.strokeStyle = '#404060';
          ctx.lineWidth = 1;
          for (let i = platform.x; i < platform.x + platform.width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i, platform.y);
            ctx.lineTo(i, platform.y + platform.height);
            ctx.stroke();
          }

          // Top edge
          ctx.strokeStyle = '#505070';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(platform.x, platform.y);
          ctx.lineTo(platform.x + platform.width, platform.y);
          ctx.stroke();
        } else {
          // Floating platform - metal grating
          ctx.fillStyle = '#4a4a5a';
          ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

          ctx.strokeStyle = '#6a6a7a';
          ctx.lineWidth = 2;
          ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);

          // Grating lines
          ctx.strokeStyle = '#5a5a6a';
          ctx.lineWidth = 1;
          for (let i = platform.x + 10; i < platform.x + platform.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, platform.y);
            ctx.lineTo(i, platform.y + platform.height);
            ctx.stroke();
          }
        }
      });

      // Draw powerups
      powerups.forEach(powerup => {
        const x = powerup.position.x;
        const y = powerup.position.y;

        if (powerup.type === 'health') {
          // Health pack (medical cross)
          ctx.fillStyle = '#00FF00';
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#00FF00';

          ctx.beginPath();
          ctx.arc(x, y, 12, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(x - 8, y - 2, 16, 4);
          ctx.fillRect(x - 2, y - 8, 4, 16);
          ctx.shadowBlur = 0;
        } else if (powerup.type === 'life') {
          // Extra life (Rebel symbol)
          ctx.fillStyle = '#FFD700';
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#FFD700';

          ctx.beginPath();
          ctx.arc(x, y, 12, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FF0000';
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('1UP', x, y);
          ctx.shadowBlur = 0;
        }
      });

      // Draw particles
      particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.lifetime;
        ctx.shadowBlur = 5;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(particle.position.x, particle.position.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      });

      // Draw projectiles
      projectiles.forEach(proj => {
        ctx.save();
        ctx.fillStyle = '#FF0000';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FF0000';

        ctx.beginPath();
        ctx.arc(proj.position.x, proj.position.y, proj.radius, 0, Math.PI * 2);
        ctx.fill();

        // Bright core
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(proj.position.x, proj.position.y, proj.radius / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // Draw enemies
      enemies.forEach(enemy => {
        if (enemy.isDead) {
          ctx.globalAlpha = Math.max(0, 1 - enemy.deathTimer * 2);
        }

        const facingLeft = enemy.velocity?.x < 0;

        if (enemy.type === 'stormtrooper') {
          drawStormtrooper(ctx, enemy.position.x, enemy.position.y, enemy.width, enemy.height, facingLeft);
        } else if (enemy.type === 'probeDroid') {
          drawProbeDroid(ctx, enemy.position.x, enemy.position.y, enemy.width, enemy.height);
        } else if (enemy.type === 'scoutTrooper') {
          drawScoutTrooper(ctx, enemy.position.x, enemy.position.y, enemy.width, enemy.height, facingLeft);
        }

        // HP bar
        if (!enemy.isDead) {
          const hpPercent = enemy.hp / (enemy.hp + 30); // Approximate max HP
          const barWidth = enemy.width;
          const barHeight = 4;
          const barY = enemy.position.y - 10;

          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(enemy.position.x, barY, barWidth, barHeight);

          ctx.fillStyle = hpPercent > 0.5 ? '#00FF00' : hpPercent > 0.25 ? '#FFAA00' : '#FF0000';
          ctx.fillRect(enemy.position.x, barY, barWidth * hpPercent, barHeight);
        }

        ctx.globalAlpha = 1;
      });

      // Draw player (Jedi)
      drawJedi(
        ctx,
        player.position.x,
        player.position.y,
        player.width,
        player.height,
        player.direction,
        player.isAttacking,
        player.invulnerable
      );

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
  }, [player, platforms, enemies, projectiles, particles, powerups, camera]);

  return <canvas ref={canvasRef} className="game-canvas" />;
}

export default GameCanvas;
