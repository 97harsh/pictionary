# Claude.md - AI Agent Guide for Pictionary App

## Project Overview

This is a Next.js-based web application that provides offline Pictionary game modes with timer, scoring, and word management. The app serves as a digital assistant for physical Pictionary games where players draw on real paper/whiteboards.

### Core Philosophy

**This app is a companion tool, not a digital drawing game.** Players draw in the real world; the app only:
- Manages timers
- Displays words to drawers (hidden from guessers)
- Tracks scores
- Manages game flow and rounds

## Project Structure

```
/src/
├── app/
│   ├── page.tsx                           # App hub (landing page)
│   └── apps/
│       ├── offline-pictionary/            # Team-based mode
│       │   └── page.tsx
│       └── one-vs-all-pictionary/         # Individual player mode
│           ├── page.tsx
│           ├── components/                # Mode-specific components
│           └── hooks/                     # Mode-specific game engine
├── components/
│   ├── game/                              # Shared game components
│   └── ui/                                # shadcn/ui components
├── hooks/
│   └── useGameEngine.ts                   # Team mode game logic
└── lib/
    ├── apps.ts                            # App registry
    └── words.ts                           # Shared word database
```

## Architecture Principles

### 1. **Separation of Concerns**
- **Game Logic**: Isolated in `useGameEngine` hooks using React reducer pattern
- **UI Components**: Presentational components that receive state and dispatch functions
- **Word Management**: Centralized in `/lib/words.ts` and shared across all modes

### 2. **Game State Management**
Each game mode has its own reducer-based engine:
- State is persisted to localStorage automatically
- Immutable state updates using spread operators
- Clear action types for all game transitions

### 3. **Component Reusability**
- **Shared Components** (`/components/game/`): Used across multiple game modes
  - `Scoreboard`, `CategorySelectionScreen`, `GameOverScreen`
- **Mode-Specific Components** (`/apps/{mode}/components/`): Unique to each mode
  - `OneVsAllSetupScreen`, `GuesserSelectionScreen`

### 4. **Physical World Optimization**
The UI is designed for real-world gameplay:
- Large text (readable from 10+ feet away)
- High contrast colors
- Large touch targets for timed gameplay
- Screen wake lock to prevent dimming
- Haptic feedback for tactile confirmation

## Key Design Patterns

### Game Engine Pattern

```typescript
// Each game mode follows this structure:
export interface GameState {
  status: 'setup' | 'turn_start' | 'playing' | 'round_end' | 'game_over';
  // ... game-specific state
  settings: GameSettings;
  currentTurn: { /* turn tracking */ };
  currentRound: { /* round data */ };
}

type GameAction =
  | { type: 'START_GAME'; /* ... */ }
  | { type: 'ADVANCE_TURN' }
  // ... other actions

function gameReducer(state: GameState, action: GameAction): GameState {
  // Pure function that returns new state
}
```

### Screen Flow Pattern

Each game mode follows a consistent screen flow:
1. **Setup** → Configure players, settings, categories
2. **Turn Start** → Show who's playing this turn
3. **Playing** → Display word, timer, controls
4. **Round End** → Show results, scoreboard
5. **Game Over** → Final scores, winner

## Game Modes

### Team-Based Pictionary (`/apps/offline-pictionary`)
- 2-6 teams compete
- Each team takes turns drawing
- 10 points per correct guess
- Rounds-based gameplay

### One vs All Pictionary (`/apps/one-vs-all-pictionary`)
- 3-8 individual players
- One drawer, all others guess
- First to shout wins +1 point
- Optional drawer penalty (-0.5 if no one guesses)
- Includes guesser selection screen

## Important Implementation Details

### 1. **Rounds & Scoring System**
- Games are **rounds-based only** (no score-based win conditions)
- Optional tiebreaker: Continue rounds until a clear winner
- Round increments when cycling back to first player/team

### 2. **Word Management**
- Words organized by category → subcategory → difficulty
- Used words tracked to prevent repetition
- Shared across all game modes via `/lib/words.ts`

### 3. **LocalStorage Persistence**
- State auto-saves on every change (except 'setup' status)
- State auto-loads on mount
- Uses unique storage keys per mode:
  - `'offline_pictionary_state'` (team mode)
  - `'one_vs_all_pictionary_state'` (one-vs-all)

### 4. **Forfeit vs End Game**
- **During gameplay**: "Forfeit Round" button (advances to next turn)
- **At round end**: "End Game" button (force game over)
- Forfeit applies tiebreaker logic if enabled

## Development Guidelines for AI Agents

### When Adding New Features

1. **Preserve Physical World Focus**
   - Don't add digital drawing features
   - Maintain large text/buttons for visibility
   - Keep UI simple and fast

2. **Maintain Separation**
   - New game modes get their own `/apps/{mode}` directory
   - Share components only when truly reusable
   - Don't merge game engines - keep them separate

3. **Follow Existing Patterns**
   - Use reducer pattern for game logic
   - Persist state to localStorage
   - Create screen components for each game phase

4. **Test Real-World Usage**
   - Can text be read from 10 feet away?
   - Are buttons easy to tap during timed rounds?
   - Does the flow work with physical drawing?

### When Modifying Existing Code

1. **Read First, Then Modify**
   - Always read existing files before making changes
   - Understand current patterns before introducing new ones
   - Check both game modes if changing shared logic

2. **Avoid Breaking Changes**
   - Don't rename core types (Team, Player, GameState)
   - Preserve localStorage structure (users have saved games)
   - Maintain backward compatibility when possible

3. **Keep It Simple**
   - Don't over-engineer solutions
   - Avoid unnecessary abstractions
   - Only add features explicitly requested

4. **Update Both Modes Consistently**
   - Changes to shared concepts should apply to both modes
   - Keep UI patterns consistent across modes
   - Test both team and one-vs-all modes

### Common Pitfalls to Avoid

❌ **Don't:**
- Add drawing/canvas features (use physical drawing)
- Implement online multiplayer (offline-first design)
- Create complex scoring algorithms (keep scoring simple)
- Make text smaller to fit more content (prioritize readability)
- Merge game engines into one (keep modes independent)

✅ **Do:**
- Maintain large, readable UI elements
- Keep game logic in reducers
- Share word database across modes
- Test on mobile devices (primary use case)
- Follow existing screen flow patterns

## Code Style & Conventions

### TypeScript
- Use explicit interface definitions for state and actions
- Prefer `interface` over `type` for object shapes
- Use union types for action definitions

### React
- Use functional components with hooks
- Prefer `useReducer` for complex state (game engines)
- Use `useState` for local component state
- Memoize callbacks with `useCallback` in game engines

### File Naming
- Components: PascalCase (e.g., `SetupScreen.tsx`)
- Hooks: camelCase with "use" prefix (e.g., `useGameEngine.ts`)
- Utilities: camelCase (e.g., `words.ts`)

### Component Structure
```tsx
// Imports
import React, { useState } from 'react';

// Types
type ComponentProps = {
  // ...
};

// Component
export default function Component({ props }: ComponentProps) {
  // State
  const [state, setState] = useState();

  // Handlers
  const handleAction = () => {
    // ...
  };

  // Render
  return (
    // JSX
  );
}
```

## Testing Philosophy

- **Manual Testing**: Primary testing method (it's a physical game)
- **Build Checks**: Ensure TypeScript compiles without errors
- **Real Device Testing**: Test on phones/tablets at table distance
- **Edge Cases**: Test with minimum/maximum players, tie scenarios

## Git & Deployment

### Branch Strategy
- `main`: Production-ready code
- `feature/*`: New features (create PR to main)
- Feature branches should be atomic and focused

### Commit Messages
- Clear, descriptive commit messages
- Explain "why" not just "what"
- Include co-authoring tag when AI-assisted

### Pull Requests
- Include summary of changes
- List key improvements and benefits
- Add testing checklist
- Reference related issues/PRs

## Future Considerations

### Potential Expansions
- Additional game modes (e.g., relay pictionary, charades)
- More word categories and subcategories
- Customizable themes and color schemes
- Multi-language support

### Technical Debt to Watch
- State persistence migration if schema changes significantly
- Performance with large word databases
- Mobile browser compatibility (wake lock, haptics)

## Questions to Ask When Uncertain

Before implementing a feature, ask:
1. **Does this support physical world gameplay?** (Core purpose)
2. **Is this usable during timed, active gameplay?** (UX)
3. **Does this add complexity without clear benefit?** (Simplicity)
4. **Will this work on mobile devices at table distance?** (Primary use case)
5. **Does this duplicate existing functionality?** (DRY principle)

## Contact & Contribution

This app is designed for personal/group use. When making changes:
- Focus on enhancing the physical gameplay experience
- Maintain simplicity and ease of use
- Test with real players in real game scenarios
- Keep the app fast and responsive

---

**Remember**: This app's purpose is to enhance physical Pictionary games, not replace them. Every feature should support people drawing on real paper/whiteboards while having fun together in person.
