import { create } from 'zustand';

const INITIAL_STATE = {
  // Game state
  gameState: 'menu', // 'menu', 'playing', 'paused', 'victory', 'defeat'
  level: 1,
  wave: 1,
  score: 0,
  credits: 1000,

  // Player state
  player: {
    id: 'player',
    name: 'Rebel Commander',
    type: 'hero',
    faction: 'rebel',
    level: 1,
    xp: 0,
    xpToNext: 100,
    hp: 100,
    maxHp: 100,
    shield: 50,
    maxShield: 50,
    energy: 100,
    maxEnergy: 100,
    damage: 20,
    attackSpeed: 1.0,
    critChance: 0.1,
    critDamage: 2.0,
    position: { x: 100, y: 300 },
    velocity: { x: 0, y: 0 },
    isMoving: false,
    direction: 'right',
    currentAnimation: 'idle',
    skills: [
      { id: 'blaster', name: 'Blaster', damage: 25, cooldown: 0, maxCooldown: 1, energy: 10, type: 'projectile' },
      { id: 'grenade', name: 'Thermal Detonator', damage: 80, cooldown: 0, maxCooldown: 5, energy: 30, type: 'aoe', radius: 100 },
      { id: 'shield', name: 'Energy Shield', cooldown: 0, maxCooldown: 10, energy: 50, type: 'buff', duration: 5 },
      { id: 'dash', name: 'Combat Roll', cooldown: 0, maxCooldown: 3, energy: 20, type: 'mobility' },
    ],
    inventory: [],
    equipment: {
      weapon: null,
      armor: null,
      accessory: null
    },
    stats: {
      enemiesKilled: 0,
      damageDealt: 0,
      damageTaken: 0,
      wavesCompleted: 0,
      skillsUsed: 0
    }
  },

  // Enemies
  enemies: [],
  enemySpawnTimer: 0,
  enemySpawnRate: 2.0,

  // Projectiles
  projectiles: [],

  // Effects
  particles: [],
  explosions: [],

  // Powerups
  powerups: [],

  // UI state
  selectedSkill: null,
  hoveredEnemy: null,
  notifications: [],

  // Game settings
  difficulty: 'normal', // 'easy', 'normal', 'hard', 'extreme'
  soundEnabled: true,
  musicEnabled: true,
};

const ENEMY_TYPES = {
  stormtrooper: {
    name: 'Stormtrooper',
    hp: 50,
    damage: 10,
    speed: 1.5,
    xp: 10,
    credits: 25,
    size: { w: 40, h: 50 },
    color: '#FFFFFF',
    attackRange: 200,
    attackCooldown: 2.0,
  },
  scout: {
    name: 'Scout Trooper',
    hp: 30,
    damage: 8,
    speed: 3.0,
    xp: 15,
    credits: 30,
    size: { w: 35, h: 45 },
    color: '#8B4513',
    attackRange: 250,
    attackCooldown: 1.5,
  },
  heavy: {
    name: 'Heavy Trooper',
    hp: 150,
    damage: 25,
    speed: 0.8,
    xp: 30,
    credits: 60,
    size: { w: 60, h: 70 },
    color: '#696969',
    attackRange: 150,
    attackCooldown: 3.0,
  },
  officer: {
    name: 'Imperial Officer',
    hp: 80,
    damage: 15,
    speed: 1.2,
    xp: 25,
    credits: 50,
    size: { w: 40, h: 50 },
    color: '#2F4F4F',
    attackRange: 300,
    attackCooldown: 2.5,
  },
  droid: {
    name: 'Battle Droid',
    hp: 40,
    damage: 12,
    speed: 2.0,
    xp: 12,
    credits: 20,
    size: { w: 35, h: 55 },
    color: '#DAA520',
    attackRange: 220,
    attackCooldown: 1.8,
  },
  destroyer: {
    name: 'Destroyer Droid',
    hp: 200,
    damage: 35,
    speed: 1.0,
    xp: 50,
    credits: 100,
    size: { w: 70, h: 60 },
    color: '#4169E1',
    attackRange: 180,
    attackCooldown: 2.2,
    shield: 100,
  },
  boss: {
    name: 'AT-ST Walker',
    hp: 800,
    damage: 50,
    speed: 0.5,
    xp: 200,
    credits: 500,
    size: { w: 100, h: 120 },
    color: '#2F2F2F',
    attackRange: 300,
    attackCooldown: 4.0,
    isBoss: true,
  }
};

const ITEM_TYPES = {
  // Weapons
  blasterRifle: {
    id: 'blasterRifle',
    name: 'E-11 Blaster Rifle',
    type: 'weapon',
    rarity: 'common',
    stats: { damage: 10, attackSpeed: 0.1 },
    price: 200
  },
  heavyBlaster: {
    id: 'heavyBlaster',
    name: 'DLT-19 Heavy Blaster',
    type: 'weapon',
    rarity: 'rare',
    stats: { damage: 25, attackSpeed: -0.2 },
    price: 500
  },
  sniper: {
    id: 'sniper',
    name: 'Sniper Rifle',
    type: 'weapon',
    rarity: 'epic',
    stats: { damage: 50, critChance: 0.2 },
    price: 800
  },
  // Armor
  lightArmor: {
    id: 'lightArmor',
    name: 'Light Combat Armor',
    type: 'armor',
    rarity: 'common',
    stats: { maxHp: 20, maxShield: 10 },
    price: 150
  },
  heavyArmor: {
    id: 'heavyArmor',
    name: 'Heavy Battle Armor',
    type: 'armor',
    rarity: 'rare',
    stats: { maxHp: 50, maxShield: 30 },
    price: 400
  },
  // Accessories
  energyCell: {
    id: 'energyCell',
    name: 'Enhanced Energy Cell',
    type: 'accessory',
    rarity: 'rare',
    stats: { maxEnergy: 30 },
    price: 300
  }
};

const useGameStore = create((set, get) => ({
  ...INITIAL_STATE,

  // Game control actions
  startGame: () => set({
    ...INITIAL_STATE,
    gameState: 'playing',
  }),

  pauseGame: () => set({ gameState: 'paused' }),

  resumeGame: () => set({ gameState: 'playing' }),

  setGameState: (state) => set({ gameState: state }),

  // Player actions
  movePlayer: (direction) => set((state) => ({
    player: {
      ...state.player,
      isMoving: true,
      direction,
      currentAnimation: 'walk'
    }
  })),

  stopPlayer: () => set((state) => ({
    player: {
      ...state.player,
      isMoving: false,
      currentAnimation: 'idle'
    }
  })),

  updatePlayerPosition: (deltaTime) => set((state) => {
    if (!state.player.isMoving) return state;

    const speed = 200; // pixels per second
    let dx = 0;

    if (state.player.direction === 'left') dx = -speed * deltaTime;
    if (state.player.direction === 'right') dx = speed * deltaTime;

    const newX = Math.max(0, Math.min(window.innerWidth - 50, state.player.position.x + dx));

    return {
      player: {
        ...state.player,
        position: { ...state.player.position, x: newX }
      }
    };
  }),

  damagePlayer: (damage) => set((state) => {
    let newHp = state.player.hp;
    let newShield = state.player.shield;

    if (newShield > 0) {
      newShield = Math.max(0, newShield - damage);
      if (newShield === 0 && damage > state.player.shield) {
        newHp = Math.max(0, newHp - (damage - state.player.shield));
      }
    } else {
      newHp = Math.max(0, newHp - damage);
    }

    const newStats = {
      ...state.player.stats,
      damageTaken: state.player.stats.damageTaken + damage
    };

    if (newHp <= 0) {
      setTimeout(() => set({ gameState: 'defeat' }), 100);
    }

    return {
      player: {
        ...state.player,
        hp: newHp,
        shield: newShield,
        stats: newStats
      }
    };
  }),

  healPlayer: (amount) => set((state) => ({
    player: {
      ...state.player,
      hp: Math.min(state.player.maxHp, state.player.hp + amount)
    }
  })),

  gainXP: (amount) => set((state) => {
    const newXP = state.player.xp + amount;
    const xpNeeded = state.player.xpToNext;

    if (newXP >= xpNeeded) {
      // Level up!
      const newLevel = state.player.level + 1;
      const overflow = newXP - xpNeeded;

      get().addNotification({
        type: 'success',
        message: `Level Up! Now level ${newLevel}`,
        duration: 3000
      });

      return {
        player: {
          ...state.player,
          level: newLevel,
          xp: overflow,
          xpToNext: Math.floor(xpNeeded * 1.5),
          maxHp: state.player.maxHp + 20,
          hp: state.player.maxHp + 20,
          maxShield: state.player.maxShield + 10,
          shield: state.player.maxShield + 10,
          damage: state.player.damage + 5
        },
        score: state.score + 1000
      };
    }

    return {
      player: { ...state.player, xp: newXP }
    };
  }),

  useSkill: (skillId) => set((state) => {
    const skill = state.player.skills.find(s => s.id === skillId);
    if (!skill || skill.cooldown > 0 || state.player.energy < skill.energy) {
      return state;
    }

    // Update skill cooldown and player energy
    const updatedSkills = state.player.skills.map(s =>
      s.id === skillId ? { ...s, cooldown: s.maxCooldown } : s
    );

    const newEnergy = state.player.energy - skill.energy;
    const newStats = {
      ...state.player.stats,
      skillsUsed: state.player.stats.skillsUsed + 1
    };

    // Execute skill effect
    const updates = {
      player: {
        ...state.player,
        skills: updatedSkills,
        energy: newEnergy,
        stats: newStats
      }
    };

    if (skill.type === 'projectile') {
      // Create projectile
      const projectile = {
        id: Date.now() + Math.random(),
        type: 'blaster',
        position: { ...state.player.position, y: state.player.position.y + 20 },
        velocity: { x: state.player.direction === 'right' ? 500 : -500, y: 0 },
        damage: state.player.damage + skill.damage,
        owner: 'player',
        size: { w: 20, h: 5 },
        color: '#00FF00'
      };
      updates.projectiles = [...state.projectiles, projectile];
    }

    if (skill.type === 'aoe') {
      // Create explosion
      updates.explosions = [...state.explosions, {
        id: Date.now(),
        position: { ...state.player.position },
        radius: skill.radius,
        damage: skill.damage,
        owner: 'player',
        lifetime: 0.5
      }];

      // Create particles
      const newParticles = [];
      for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 * i) / 30;
        newParticles.push({
          id: Date.now() + i,
          position: { ...state.player.position },
          velocity: {
            x: Math.cos(angle) * 200,
            y: Math.sin(angle) * 200
          },
          color: '#FF6600',
          lifetime: 1,
          size: 4
        });
      }
      updates.particles = [...state.particles, ...newParticles];
    }

    if (skill.type === 'buff') {
      // Apply shield buff
      updates.player.shield = Math.min(state.player.maxShield * 2, state.player.shield + 50);
    }

    if (skill.type === 'mobility') {
      // Dash
      const dashDistance = 150;
      const direction = state.player.direction === 'right' ? 1 : -1;
      const newX = Math.max(0, Math.min(window.innerWidth - 50,
        state.player.position.x + dashDistance * direction));
      updates.player.position = { ...state.player.position, x: newX };
    }

    return updates;
  }),

  updateSkillCooldowns: (deltaTime) => set((state) => ({
    player: {
      ...state.player,
      skills: state.player.skills.map(skill => ({
        ...skill,
        cooldown: Math.max(0, skill.cooldown - deltaTime)
      })),
      energy: Math.min(state.player.maxEnergy, state.player.energy + 10 * deltaTime)
    }
  })),

  // Enemy actions
  spawnEnemy: (type) => set((state) => {
    const template = ENEMY_TYPES[type];
    if (!template) return state;

    const enemy = {
      id: Date.now() + Math.random(),
      type,
      ...template,
      hp: template.hp,
      maxHp: template.hp,
      position: {
        x: window.innerWidth + 50,
        y: Math.random() * (window.innerHeight - 200) + 100
      },
      velocity: { x: -template.speed * 50, y: 0 },
      currentAttackCooldown: 0,
      isAttacking: false,
      isDead: false
    };

    if (template.shield) {
      enemy.shield = template.shield;
      enemy.maxShield = template.shield;
    }

    return {
      enemies: [...state.enemies, enemy]
    };
  }),

  updateEnemies: (deltaTime) => set((state) => {
    const updatedEnemies = state.enemies.map(enemy => {
      if (enemy.isDead) return enemy;

      // Move towards player
      const dx = state.player.position.x - enemy.position.x;
      const distance = Math.abs(dx);

      let newPosition = { ...enemy.position };
      let isAttacking = false;

      if (distance > enemy.attackRange) {
        // Move towards player
        newPosition.x += enemy.velocity.x * deltaTime;
      } else {
        // In attack range
        isAttacking = true;
      }

      // Update attack cooldown
      let newCooldown = Math.max(0, enemy.currentAttackCooldown - deltaTime);

      if (isAttacking && newCooldown === 0) {
        // Attack!
        newCooldown = enemy.attackCooldown;

        // Create enemy projectile
        setTimeout(() => {
          const projectile = {
            id: Date.now() + Math.random(),
            type: 'enemyBlaster',
            position: { ...newPosition, y: newPosition.y + enemy.size.h / 2 },
            velocity: { x: -300, y: 0 },
            damage: enemy.damage,
            owner: 'enemy',
            size: { w: 15, h: 4 },
            color: '#FF0000'
          };
          set(s => ({ projectiles: [...s.projectiles, projectile] }));
        }, 100);
      }

      return {
        ...enemy,
        position: newPosition,
        currentAttackCooldown: newCooldown,
        isAttacking
      };
    });

    return { enemies: updatedEnemies };
  }),

  damageEnemy: (enemyId, damage) => set((state) => {
    const enemies = state.enemies.map(enemy => {
      if (enemy.id !== enemyId || enemy.isDead) return enemy;

      let newHp = enemy.hp;
      let newShield = enemy.shield || 0;

      if (newShield > 0) {
        newShield = Math.max(0, newShield - damage);
        if (newShield === 0 && damage > enemy.shield) {
          newHp = Math.max(0, newHp - (damage - enemy.shield));
        }
      } else {
        newHp = Math.max(0, newHp - damage);
      }

      const isDead = newHp <= 0;

      if (isDead) {
        // Grant XP and credits
        setTimeout(() => {
          get().gainXP(enemy.xp);
          get().addCredits(enemy.credits);
          get().addToPlayerStats('enemiesKilled', 1);

          // Spawn powerup chance
          if (Math.random() < 0.15) {
            get().spawnPowerup(enemy.position);
          }
        }, 10);
      }

      return {
        ...enemy,
        hp: newHp,
        shield: newShield,
        isDead
      };
    });

    // Remove dead enemies after animation
    setTimeout(() => {
      set(s => ({
        enemies: s.enemies.filter(e => !e.isDead)
      }));
    }, 500);

    return { enemies };
  }),

  // Projectile actions
  updateProjectiles: (deltaTime) => set((state) => {
    const updatedProjectiles = state.projectiles
      .map(proj => ({
        ...proj,
        position: {
          x: proj.position.x + proj.velocity.x * deltaTime,
          y: proj.position.y + proj.velocity.y * deltaTime
        }
      }))
      .filter(proj => {
        // Remove off-screen projectiles
        if (proj.position.x < -50 || proj.position.x > window.innerWidth + 50) {
          return false;
        }

        // Check collision with enemies (player projectiles)
        if (proj.owner === 'player') {
          for (const enemy of state.enemies) {
            if (enemy.isDead) continue;

            const hit = proj.position.x >= enemy.position.x &&
                       proj.position.x <= enemy.position.x + enemy.size.w &&
                       proj.position.y >= enemy.position.y &&
                       proj.position.y <= enemy.position.y + enemy.size.h;

            if (hit) {
              get().damageEnemy(enemy.id, proj.damage);
              get().addToPlayerStats('damageDealt', proj.damage);

              // Create hit particles
              get().createHitParticles(proj.position);

              return false; // Remove projectile
            }
          }
        }

        // Check collision with player (enemy projectiles)
        if (proj.owner === 'enemy') {
          const hit = proj.position.x >= state.player.position.x &&
                     proj.position.x <= state.player.position.x + 50 &&
                     proj.position.y >= state.player.position.y &&
                     proj.position.y <= state.player.position.y + 60;

          if (hit) {
            get().damagePlayer(proj.damage);
            get().createHitParticles(proj.position);
            return false;
          }
        }

        return true;
      });

    return { projectiles: updatedProjectiles };
  }),

  // Explosion updates
  updateExplosions: (deltaTime) => set((state) => {
    const updatedExplosions = state.explosions
      .map(exp => ({
        ...exp,
        lifetime: exp.lifetime - deltaTime
      }))
      .filter(exp => {
        if (exp.lifetime <= 0) return false;

        // Check if this is a new explosion (hasn't dealt damage yet)
        if (exp.lifetime > 0.4 && exp.owner === 'player') {
          // Damage enemies in radius
          state.enemies.forEach(enemy => {
            if (enemy.isDead) return;

            const dx = enemy.position.x - exp.position.x;
            const dy = enemy.position.y - exp.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < exp.radius) {
              get().damageEnemy(enemy.id, exp.damage);
              get().addToPlayerStats('damageDealt', exp.damage);
            }
          });
        }

        return true;
      });

    return { explosions: updatedExplosions };
  }),

  // Particle effects
  updateParticles: (deltaTime) => set((state) => ({
    particles: state.particles
      .map(p => ({
        ...p,
        position: {
          x: p.position.x + p.velocity.x * deltaTime,
          y: p.position.y + p.velocity.y * deltaTime
        },
        velocity: {
          x: p.velocity.x * 0.98,
          y: p.velocity.y + 200 * deltaTime // gravity
        },
        lifetime: p.lifetime - deltaTime,
        size: p.size * 0.98
      }))
      .filter(p => p.lifetime > 0 && p.size > 0.5)
  })),

  createHitParticles: (position) => set((state) => {
    const newParticles = [];
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10;
      newParticles.push({
        id: Date.now() + i + Math.random(),
        position: { ...position },
        velocity: {
          x: Math.cos(angle) * 100,
          y: Math.sin(angle) * 100
        },
        color: '#FFFF00',
        lifetime: 0.5,
        size: 3
      });
    }
    return { particles: [...state.particles, ...newParticles] };
  }),

  // Powerups
  spawnPowerup: (position) => set((state) => {
    const types = ['health', 'shield', 'energy', 'credits'];
    const type = types[Math.floor(Math.random() * types.length)];

    return {
      powerups: [...state.powerups, {
        id: Date.now(),
        type,
        position: { ...position },
        collected: false
      }]
    };
  }),

  updatePowerups: () => set((state) => {
    const player = state.player;

    state.powerups.forEach(powerup => {
      if (powerup.collected) return;

      const dx = player.position.x - powerup.position.x;
      const dy = player.position.y - powerup.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 50) {
        powerup.collected = true;

        switch (powerup.type) {
          case 'health':
            get().healPlayer(30);
            get().addNotification({ type: 'success', message: '+30 HP', duration: 2000 });
            break;
          case 'shield':
            set(s => ({
              player: {
                ...s.player,
                shield: Math.min(s.player.maxShield, s.player.shield + 25)
              }
            }));
            get().addNotification({ type: 'success', message: '+25 Shield', duration: 2000 });
            break;
          case 'energy':
            set(s => ({
              player: {
                ...s.player,
                energy: Math.min(s.player.maxEnergy, s.player.energy + 50)
              }
            }));
            get().addNotification({ type: 'success', message: '+50 Energy', duration: 2000 });
            break;
          case 'credits':
            get().addCredits(50);
            get().addNotification({ type: 'success', message: '+50 Credits', duration: 2000 });
            break;
        }
      }
    });

    return {
      powerups: state.powerups.filter(p => !p.collected)
    };
  }),

  // Wave management
  nextWave: () => set((state) => ({
    wave: state.wave + 1,
    enemySpawnRate: Math.max(0.5, state.enemySpawnRate - 0.1),
    player: {
      ...state.player,
      hp: Math.min(state.player.maxHp, state.player.hp + 20),
      shield: state.player.maxShield,
      energy: state.player.maxEnergy,
      stats: {
        ...state.player.stats,
        wavesCompleted: state.player.stats.wavesCompleted + 1
      }
    },
    score: state.score + 500 * state.wave
  })),

  checkWaveComplete: () => {
    const state = get();
    if (state.enemies.length === 0 && state.enemySpawnTimer > 30) {
      get().addNotification({
        type: 'success',
        message: `Wave ${state.wave} Complete!`,
        duration: 3000
      });
      get().nextWave();
    }
  },

  // Economy
  addCredits: (amount) => set((state) => ({
    credits: state.credits + amount,
    score: state.score + amount
  })),

  spendCredits: (amount) => set((state) => {
    if (state.credits >= amount) {
      return { credits: state.credits - amount };
    }
    return state;
  }),

  // Stats
  addToPlayerStats: (stat, value) => set((state) => ({
    player: {
      ...state.player,
      stats: {
        ...state.player.stats,
        [stat]: state.player.stats[stat] + value
      }
    }
  })),

  // Notifications
  addNotification: (notification) => set((state) => {
    const id = Date.now();
    const newNotification = { id, ...notification };

    setTimeout(() => {
      set(s => ({
        notifications: s.notifications.filter(n => n.id !== id)
      }));
    }, notification.duration || 3000);

    return {
      notifications: [...state.notifications, newNotification]
    };
  }),

  // Game loop update
  gameUpdate: (deltaTime) => {
    const state = get();
    if (state.gameState !== 'playing') return;

    get().updatePlayerPosition(deltaTime);
    get().updateSkillCooldowns(deltaTime);
    get().updateEnemies(deltaTime);
    get().updateProjectiles(deltaTime);
    get().updateExplosions(deltaTime);
    get().updateParticles(deltaTime);
    get().updatePowerups();

    // Enemy spawning
    const newSpawnTimer = state.enemySpawnTimer + deltaTime;
    set({ enemySpawnTimer: newSpawnTimer });

    if (newSpawnTimer >= state.enemySpawnRate) {
      const enemyTypes = Object.keys(ENEMY_TYPES);
      let type;

      // Boss every 10 waves
      if (state.wave % 10 === 0 && state.enemies.length === 0 && newSpawnTimer < state.enemySpawnRate + 1) {
        type = 'boss';
      } else {
        // Increase variety with wave progression
        const availableTypes = enemyTypes.filter(t => {
          if (t === 'boss') return false;
          if (t === 'destroyer' && state.wave < 5) return false;
          if (t === 'heavy' && state.wave < 3) return false;
          return true;
        });
        type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      }

      get().spawnEnemy(type);
      set({ enemySpawnTimer: 0 });
    }

    // Check wave completion
    if (newSpawnTimer > 30) {
      get().checkWaveComplete();
    }
  },

  // Save/Load
  saveGame: () => {
    const state = get();
    const saveData = {
      level: state.level,
      wave: state.wave,
      score: state.score,
      credits: state.credits,
      player: state.player,
      difficulty: state.difficulty
    };
    localStorage.setItem('starwars_save', JSON.stringify(saveData));
  },

  loadGame: () => {
    const saved = localStorage.getItem('starwars_save');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        set({
          level: data.level,
          wave: data.wave,
          score: data.score,
          credits: data.credits,
          player: data.player,
          difficulty: data.difficulty || 'normal',
          gameState: 'playing'
        });
        return true;
      } catch (e) {
        console.error('Failed to load save:', e);
        return false;
      }
    }
    return false;
  },

  deleteSave: () => {
    localStorage.removeItem('starwars_save');
  }
}));

export default useGameStore;
export { ENEMY_TYPES, ITEM_TYPES };
