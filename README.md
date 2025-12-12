# ⚔️ Star Wars: Galaxy Defense ⚔️

An epic, detailed Star Wars-themed defense game built with **React + Vite**. Defend the galaxy against endless waves of Imperial forces!

## 🎮 Game Features

### 🌟 Core Gameplay
- **Endless Wave System**: Face increasingly challenging waves of Imperial enemies
- **Dynamic Combat**: Real-time action with responsive controls
- **Progression System**: Level up, gain XP, and become stronger
- **Multiple Enemy Types**: 7+ unique enemy types including bosses
- **Boss Battles**: Epic AT-ST Walker boss fights every 10 waves

### ⚔️ Combat System
- **4 Unique Skills**:
  - **Blaster (1/Q)**: Rapid-fire projectile weapon
  - **Thermal Detonator (2/E)**: Area-of-effect explosion
  - **Energy Shield (3/R)**: Temporary shield boost
  - **Combat Roll (4/F)**: Quick evasive dash

- **Advanced Stats**:
  - HP, Shield, and Energy systems
  - Damage, Attack Speed, Crit Chance, Crit Damage
  - Real-time stat tracking

### 🎨 Visual Features
- **Stunning Animations**: Powered by Framer Motion
- **Particle Effects**: Explosions, hits, and environmental effects
- **Dynamic Starfield Background**: Animated space environment
- **Smooth UI**: Responsive and animated interface elements
- **Health & Shield Bars**: Visual feedback for all units
- **Skill Cooldown Indicators**: Clear visual feedback

### 💾 Progression & Persistence
- **Save/Load System**: Continue your progress anytime
- **Character Progression**: Level up to increase stats
- **Statistics Tracking**: Detailed combat and performance stats
- **Powerups**: Collect health, shield, energy, and credit drops
- **Difficulty Modes**: Easy, Normal, Hard, Extreme

### 🎯 Polish & UX
- **Detailed HUD**: All information at a glance
- **Notification System**: Real-time feedback
- **Multiple Menus**: Main menu, pause, victory, defeat screens
- **Keyboard Controls**: Full keyboard support
- **Responsive Design**: Works on different screen sizes

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 How to Play

### Controls
- **A/D or Arrow Keys**: Move left/right
- **1 or Q**: Use Blaster
- **2 or E**: Use Thermal Detonator
- **3 or R**: Use Energy Shield
- **4 or F**: Use Combat Roll
- **ESC or P**: Pause game

### Objective
Survive endless waves of Imperial forces. Each wave increases in difficulty with more enemies and tougher opponents. Every 10 waves, face a powerful boss!

### Tips
- 💰 Collect powerups dropped by defeated enemies
- ⚡ Manage your energy - skills require energy to use
- 🛡️ Use shield before taking heavy damage
- 💨 Dash to avoid enemy fire
- 📈 Level up to increase your stats
- 💾 Save your progress regularly

## 🛠️ Tech Stack

- **React 18**: Modern React with hooks
- **Vite**: Lightning-fast build tool
- **Zustand**: Lightweight state management
- **Framer Motion**: Smooth animations
- **CSS3**: Custom animations and effects
- **Canvas API**: Game rendering (for enemies, projectiles, particles)

## 📊 Game Architecture

### State Management (Zustand)
- Centralized game state
- Real-time updates
- Efficient re-renders

### Component Structure
```
src/
├── components/
│   ├── GameCanvas.jsx      # Main game rendering
│   ├── HUD.jsx             # Heads-up display
│   ├── MainMenu.jsx        # Main menu screen
│   ├── PauseMenu.jsx       # Pause screen
│   ├── VictoryScreen.jsx   # Wave completion screen
│   ├── DefeatScreen.jsx    # Game over screen
│   ├── Notifications.jsx   # Toast notifications
│   └── Starfield.jsx       # Animated background
├── store/
│   └── gameStore.js        # Zustand store
├── styles/
│   ├── global.css          # Global styles & animations
│   ├── App.css             # Main app styles
│   ├── HUD.css             # HUD component styles
│   └── ...                 # Other component styles
├── App.jsx                 # Main app component
└── main.jsx               # Entry point
```

## 🎯 Enemy Types

1. **Stormtrooper**: Basic infantry unit
2. **Scout Trooper**: Fast, light unit
3. **Heavy Trooper**: Slow but tanky
4. **Imperial Officer**: Mid-range specialist
5. **Battle Droid**: Balanced combat unit
6. **Destroyer Droid**: Heavy shield unit
7. **AT-ST Walker**: Massive boss unit

## 💡 Advanced Features

### Particle System
- Hit effects
- Explosion particles
- Projectile trails
- Environmental effects

### AI System
- Enemy pathfinding
- Attack patterns
- Range-based behavior
- Boss mechanics

### Progression System
- XP-based leveling
- Stat increases per level
- Wave-based difficulty scaling
- Boss waves every 10 waves

## 🎨 Customization

The game is highly customizable through the store configuration:
- Enemy stats and behavior
- Player abilities and stats
- Difficulty multipliers
- Wave progression
- Visual effects

## 📝 Future Enhancements

Potential features for future versions:
- 🎵 Sound effects and music
- 🛒 Equipment and upgrade shop
- 🏆 Achievement system
- 📱 Mobile touch controls
- 🌐 Online leaderboards
- 🎭 Multiple playable characters
- 🗺️ Different map environments

## 🤝 Contributing

This is a showcase project demonstrating advanced React game development. Feel free to fork and build upon it!

## 📄 License

MIT License - Feel free to use this project as a learning resource or base for your own games.

## 🌟 Credits

Built with ❤️ using modern web technologies.

**May the Force be with you!**
