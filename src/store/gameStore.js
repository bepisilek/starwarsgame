import { create } from 'zustand';

const GRAVITY = 1500; // pixels per second squared
const JUMP_FORCE = -600; // pixels per second
const PLAYER_SPEED = 300; // pixels per second
const GROUND_Y = 550; // ground level

const INITIAL_STATE = {
  gameState: 'menu',
  level: 1,
  score: 0,
  lives: 3,

  player: {
    position: { x: 100, y: GROUND_Y - 80 },
    velocity: { x: 0, y: 0 },
    width: 40,
    height: 80,
    direction: 'right',
    isGrounded: false,
    isJumping: false,
    isAttacking: false,
    attackCooldown: 0,
    hp: 100,
    maxHp: 100,
    invulnerable: false,
    invulnerableTimer: 0,
  },

  platforms: [
    { x: 0, y: GROUND_Y, width: 2000, height: 50, type: 'ground' },
    { x: 300, y: 450, width: 150, height: 20, type: 'platform' },
    { x: 500, y: 350, width: 150, height: 20, type: 'platform' },
    { x: 700, y: 250, width: 200, height: 20, type: 'platform' },
    { x: 1000, y: 350, width: 150, height: 20, type: 'platform' },
    { x: 1200, y: 450, width: 150, height: 20, type: 'platform' },
  ],

  enemies: [],
  enemySpawnTimer: 0,

  projectiles: [],
  particles: [],

  powerups: [],

  camera: {
    x: 0,
    y: 0
  },

  keys: {
    left: false,
    right: false,
    jump: false,
    attack: false,
  },

  notifications: [],
};

const ENEMY_TEMPLATES = {
  stormtrooper: {
    type: 'stormtrooper',
    width: 40,
    height: 70,
    hp: 30,
    damage: 10,
    speed: 80,
    canFly: false,
    attackRange: 300,
    attackCooldown: 2.0,
    points: 100,
  },
  probeDroid: {
    type: 'probeDroid',
    width: 35,
    height: 35,
    hp: 20,
    damage: 15,
    speed: 100,
    canFly: true,
    attackRange: 250,
    attackCooldown: 1.5,
    points: 150,
  },
  scoutTrooper: {
    type: 'scoutTrooper',
    width: 38,
    height: 70,
    hp: 25,
    damage: 12,
    speed: 120,
    canFly: false,
    attackRange: 350,
    attackCooldown: 1.8,
    points: 125,
  },
};

const useGameStore = create((set, get) => ({
  ...INITIAL_STATE,

  startGame: () => set({
    ...INITIAL_STATE,
    gameState: 'playing',
  }),

  pauseGame: () => set({ gameState: 'paused' }),
  resumeGame: () => set({ gameState: 'playing' }),
  setGameState: (state) => set({ gameState: state }),

  // Input handling
  setKey: (key, value) => set((state) => ({
    keys: { ...state.keys, [key]: value }
  })),

  // Player actions
  playerJump: () => set((state) => {
    if (state.player.isGrounded && !state.player.isJumping) {
      return {
        player: {
          ...state.player,
          velocity: { ...state.player.velocity, y: JUMP_FORCE },
          isJumping: true,
          isGrounded: false,
        }
      };
    }
    return state;
  }),

  playerAttack: () => set((state) => {
    if (state.player.attackCooldown > 0 || state.player.isAttacking) {
      return state;
    }

    // Create lightsaber attack hitbox
    const hitboxWidth = 60;
    const hitboxX = state.player.direction === 'right'
      ? state.player.position.x + state.player.width
      : state.player.position.x - hitboxWidth;

    // Check for enemy hits
    state.enemies.forEach(enemy => {
      if (enemy.isDead) return;

      const enemyHit = hitboxX < enemy.position.x + enemy.width &&
                       hitboxX + hitboxWidth > enemy.position.x &&
                       state.player.position.y < enemy.position.y + enemy.height &&
                       state.player.position.y + state.player.height > enemy.position.y;

      if (enemyHit) {
        get().damageEnemy(enemy.id, 50);
      }
    });

    // Create attack particles
    get().createAttackParticles(hitboxX + hitboxWidth / 2, state.player.position.y + state.player.height / 2);

    return {
      player: {
        ...state.player,
        isAttacking: true,
        attackCooldown: 0.5,
      }
    };
  }),

  damagePlayer: (damage) => set((state) => {
    if (state.player.invulnerable) return state;

    const newHp = Math.max(0, state.player.hp - damage);
    const newLives = newHp <= 0 ? state.lives - 1 : state.lives;

    if (newHp <= 0 && newLives <= 0) {
      setTimeout(() => set({ gameState: 'defeat' }), 100);
    } else if (newHp <= 0) {
      // Respawn
      return {
        player: {
          ...INITIAL_STATE.player,
          hp: 100,
          invulnerable: true,
          invulnerableTimer: 2.0,
        },
        lives: newLives,
      };
    }

    return {
      player: {
        ...state.player,
        hp: newHp,
        invulnerable: true,
        invulnerableTimer: 1.0,
      }
    };
  }),

  healPlayer: (amount) => set((state) => ({
    player: {
      ...state.player,
      hp: Math.min(state.player.maxHp, state.player.hp + amount)
    }
  })),

  // Enemy management
  spawnEnemy: (type) => set((state) => {
    const template = ENEMY_TEMPLATES[type];
    if (!template) return state;

    const spawnX = Math.random() > 0.5 ? window.innerWidth + 100 : -100;
    const spawnY = template.canFly
      ? Math.random() * 300 + 100
      : GROUND_Y - template.height;

    const enemy = {
      id: Date.now() + Math.random(),
      ...template,
      position: { x: spawnX, y: spawnY },
      velocity: { x: 0, y: 0 },
      currentAttackCooldown: 0,
      patrolDirection: spawnX > window.innerWidth / 2 ? -1 : 1,
      isDead: false,
      deathTimer: 0,
    };

    return {
      enemies: [...state.enemies, enemy]
    };
  }),

  updateEnemies: (deltaTime) => set((state) => {
    const player = state.player;

    const updatedEnemies = state.enemies.map(enemy => {
      if (enemy.isDead) {
        const newDeathTimer = enemy.deathTimer + deltaTime;
        return { ...enemy, deathTimer: newDeathTimer };
      }

      const dx = player.position.x - enemy.position.x;
      const distance = Math.abs(dx);

      let velocityX = 0;
      let velocityY = enemy.velocity.y;

      // AI behavior
      if (distance < enemy.attackRange) {
        // Attack mode
        if (distance > 50) {
          velocityX = dx > 0 ? enemy.speed : -enemy.speed;
        }

        // Shooting logic
        let newCooldown = Math.max(0, enemy.currentAttackCooldown - deltaTime);
        if (newCooldown === 0) {
          // Shoot at player
          setTimeout(() => {
            const projectile = {
              id: Date.now() + Math.random(),
              type: 'enemyBlaster',
              position: {
                x: enemy.position.x + enemy.width / 2,
                y: enemy.position.y + enemy.height / 2
              },
              velocity: { x: dx > 0 ? 400 : -400, y: 0 },
              damage: enemy.damage,
              owner: 'enemy',
              radius: 6,
            };
            set(s => ({ projectiles: [...s.projectiles, projectile] }));
          }, 50);

          newCooldown = enemy.attackCooldown;
        }

        enemy = { ...enemy, currentAttackCooldown: newCooldown };
      } else {
        // Patrol mode
        velocityX = enemy.patrolDirection * enemy.speed;
      }

      // Apply gravity for ground enemies
      if (!enemy.canFly) {
        velocityY += GRAVITY * deltaTime;
      } else {
        // Flying enemies hover
        const targetY = 150 + Math.sin(Date.now() / 1000 + enemy.id) * 50;
        velocityY = (targetY - enemy.position.y) * 2;
      }

      // Update position
      let newX = enemy.position.x + velocityX * deltaTime;
      let newY = enemy.position.y + velocityY * deltaTime;

      // Platform collision for ground enemies
      if (!enemy.canFly) {
        let isGrounded = false;
        state.platforms.forEach(platform => {
          if (newX + enemy.width > platform.x &&
              newX < platform.x + platform.width &&
              enemy.position.y + enemy.height <= platform.y &&
              newY + enemy.height >= platform.y) {
            newY = platform.y - enemy.height;
            velocityY = 0;
            isGrounded = true;
          }
        });

        // Reverse direction at platform edges
        if (isGrounded) {
          const onPlatform = state.platforms.find(p =>
            newX + enemy.width > p.x && newX < p.x + p.width &&
            Math.abs(newY + enemy.height - p.y) < 5
          );

          if (onPlatform) {
            if (newX < onPlatform.x + 10 || newX + enemy.width > onPlatform.x + onPlatform.width - 10) {
              enemy.patrolDirection *= -1;
            }
          }
        }
      }

      return {
        ...enemy,
        position: { x: newX, y: newY },
        velocity: { x: velocityX, y: velocityY },
      };
    });

    // Remove dead enemies after animation
    const filtered = updatedEnemies.filter(e => !e.isDead || e.deathTimer < 0.5);

    return { enemies: filtered };
  }),

  damageEnemy: (enemyId, damage) => set((state) => {
    const enemies = state.enemies.map(enemy => {
      if (enemy.id !== enemyId || enemy.isDead) return enemy;

      const newHp = Math.max(0, enemy.hp - damage);
      const isDead = newHp <= 0;

      if (isDead) {
        get().addScore(enemy.points);

        // Spawn powerup chance
        if (Math.random() < 0.2) {
          get().spawnPowerup(enemy.position);
        }

        // Death particles
        get().createDeathParticles(enemy.position.x + enemy.width / 2, enemy.position.y + enemy.height / 2);
      }

      return {
        ...enemy,
        hp: newHp,
        isDead,
        deathTimer: isDead ? 0 : enemy.deathTimer,
      };
    });

    return { enemies };
  }),

  // Projectiles
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
        // Remove off-screen
        if (proj.position.x < -100 || proj.position.x > window.innerWidth + 100) {
          return false;
        }

        // Check collision with player
        if (proj.owner === 'enemy') {
          const hit = Math.abs(proj.position.x - (state.player.position.x + state.player.width / 2)) < 30 &&
                     Math.abs(proj.position.y - (state.player.position.y + state.player.height / 2)) < 40;

          if (hit) {
            get().damagePlayer(proj.damage);
            get().createHitParticles(proj.position.x, proj.position.y);
            return false;
          }
        }

        return true;
      });

    return { projectiles: updatedProjectiles };
  }),

  // Powerups
  spawnPowerup: (position) => set((state) => {
    const types = ['health', 'life'];
    const type = types[Math.floor(Math.random() * types.length)];

    return {
      powerups: [...state.powerups, {
        id: Date.now(),
        type,
        position: { ...position },
        velocity: { x: 0, y: -100 },
      }]
    };
  }),

  updatePowerups: (deltaTime) => set((state) => {
    const player = state.player;
    let collected = [];

    const updatedPowerups = state.powerups.map(powerup => {
      // Gravity
      const newVelocityY = powerup.velocity.y + GRAVITY * deltaTime * 0.5;
      let newY = powerup.position.y + newVelocityY * deltaTime;

      // Platform collision
      state.platforms.forEach(platform => {
        if (powerup.position.x + 15 > platform.x &&
            powerup.position.x < platform.x + platform.width &&
            powerup.position.y + 15 <= platform.y &&
            newY + 15 >= platform.y) {
          newY = platform.y - 15;
          powerup.velocity.y = 0;
        }
      });

      // Collision with player
      const dx = player.position.x + player.width / 2 - powerup.position.x;
      const dy = player.position.y + player.height / 2 - powerup.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 40) {
        collected.push(powerup);
        return null;
      }

      return {
        ...powerup,
        position: { x: powerup.position.x, y: newY },
        velocity: { ...powerup.velocity, y: newVelocityY }
      };
    }).filter(Boolean);

    // Apply powerup effects
    collected.forEach(powerup => {
      switch (powerup.type) {
        case 'health':
          get().healPlayer(30);
          get().addNotification({ type: 'success', message: '+30 HP', duration: 2000 });
          break;
        case 'life':
          set(s => ({ lives: s.lives + 1 }));
          get().addNotification({ type: 'success', message: '+1 Life!', duration: 2000 });
          break;
      }
    });

    return { powerups: updatedPowerups };
  }),

  // Particles
  createAttackParticles: (x, y) => set((state) => {
    const newParticles = [];
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      newParticles.push({
        id: Date.now() + i + Math.random(),
        position: { x, y },
        velocity: {
          x: Math.cos(angle) * 200,
          y: Math.sin(angle) * 200
        },
        color: '#00FFFF',
        lifetime: 0.4,
        size: 4
      });
    }
    return { particles: [...state.particles, ...newParticles] };
  }),

  createHitParticles: (x, y) => set((state) => {
    const newParticles = [];
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10;
      newParticles.push({
        id: Date.now() + i + Math.random(),
        position: { x, y },
        velocity: {
          x: Math.cos(angle) * 150,
          y: Math.sin(angle) * 150
        },
        color: '#FF6600',
        lifetime: 0.5,
        size: 3
      });
    }
    return { particles: [...state.particles, ...newParticles] };
  }),

  createDeathParticles: (x, y) => set((state) => {
    const newParticles = [];
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      newParticles.push({
        id: Date.now() + i + Math.random(),
        position: { x, y },
        velocity: {
          x: Math.cos(angle) * 250,
          y: Math.sin(angle) * 250 - 100
        },
        color: i % 2 === 0 ? '#FFE81F' : '#FF0000',
        lifetime: 1.0,
        size: 5
      });
    }
    return { particles: [...state.particles, ...newParticles] };
  }),

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
          y: p.velocity.y + GRAVITY * deltaTime * 0.5
        },
        lifetime: p.lifetime - deltaTime,
        size: p.size * 0.98
      }))
      .filter(p => p.lifetime > 0 && p.size > 0.5)
  })),

  // Score
  addScore: (points) => set((state) => ({
    score: state.score + points
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

  // Physics update
  updatePlayer: (deltaTime) => set((state) => {
    const player = state.player;
    let velocityX = 0;
    let velocityY = player.velocity.y;

    // Horizontal movement
    if (state.keys.left) {
      velocityX = -PLAYER_SPEED;
    } else if (state.keys.right) {
      velocityX = PLAYER_SPEED;
    }

    // Apply gravity
    velocityY += GRAVITY * deltaTime;

    // Update position
    let newX = player.position.x + velocityX * deltaTime;
    let newY = player.position.y + velocityY * deltaTime;

    // Constrain to screen horizontally
    newX = Math.max(0, Math.min(1900, newX));

    // Platform collision
    let isGrounded = false;
    state.platforms.forEach(platform => {
      // Vertical collision (landing on platform)
      if (newX + player.width > platform.x &&
          newX < platform.x + platform.width &&
          player.position.y + player.height <= platform.y &&
          newY + player.height >= platform.y &&
          velocityY >= 0) {
        newY = platform.y - player.height;
        velocityY = 0;
        isGrounded = true;
      }
    });

    // Update direction based on movement
    let direction = player.direction;
    if (velocityX < 0) direction = 'left';
    if (velocityX > 0) direction = 'right';

    // Update attack cooldown
    const newAttackCooldown = Math.max(0, player.attackCooldown - deltaTime);
    const newIsAttacking = newAttackCooldown > 0.3 ? player.isAttacking : false;

    // Update invulnerability
    const newInvulnerableTimer = Math.max(0, player.invulnerableTimer - deltaTime);
    const newInvulnerable = newInvulnerableTimer > 0;

    return {
      player: {
        ...player,
        position: { x: newX, y: newY },
        velocity: { x: velocityX, y: velocityY },
        direction,
        isGrounded,
        isJumping: !isGrounded,
        attackCooldown: newAttackCooldown,
        isAttacking: newIsAttacking,
        invulnerableTimer: newInvulnerableTimer,
        invulnerable: newInvulnerable,
      }
    };
  }),

  // Camera update
  updateCamera: () => set((state) => {
    const player = state.player;
    const screenWidth = window.innerWidth;

    let targetCameraX = player.position.x - screenWidth / 2 + player.width / 2;
    targetCameraX = Math.max(0, Math.min(2000 - screenWidth, targetCameraX));

    return {
      camera: {
        x: targetCameraX,
        y: 0
      }
    };
  }),

  // Main game loop
  gameUpdate: (deltaTime) => {
    const state = get();
    if (state.gameState !== 'playing') return;

    get().updatePlayer(deltaTime);
    get().updateEnemies(deltaTime);
    get().updateProjectiles(deltaTime);
    get().updateParticles(deltaTime);
    get().updatePowerups(deltaTime);
    get().updateCamera();

    // Enemy spawning
    const newSpawnTimer = state.enemySpawnTimer + deltaTime;
    set({ enemySpawnTimer: newSpawnTimer });

    if (newSpawnTimer >= 3.0 && state.enemies.length < 5) {
      const types = Object.keys(ENEMY_TEMPLATES);
      const type = types[Math.floor(Math.random() * types.length)];
      get().spawnEnemy(type);
      set({ enemySpawnTimer: 0 });
    }
  },
}));

export default useGameStore;
export { GROUND_Y };
