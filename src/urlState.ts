import type { GameMode, GameState, Role } from './types';
import { gameModes } from './data/modes';

export const roles: Role[] = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];
export const gameStates: GameState[] = ['Ahead', 'Even', 'Behind'];
export const DEFAULT_ENEMIES = ['Zed', 'Soraka', 'Malphite'];

export type UrlBuildState = {
  championId: string;
  role: Role;
  gameState: GameState;
  gameMode: GameMode;
  enemyIds: string[];
};

/*
 * The URL is the share format for the app. Keeping this logic isolated makes it
 * easier to evolve later if we add runes, lane opponent, or Riot ID data.
 */

export function readStateFromUrl(): UrlBuildState {
  const params = new URLSearchParams(window.location.search);
  const roleParam = params.get('role');
  const gameStateParam = params.get('state');
  const gameModeParam = params.get('mode');
  const enemyParam = params.get('enemies');

  return {
    championId: params.get('champion') || 'Ahri',
    role: isRole(roleParam) ? roleParam : 'Mid',
    gameState: isGameState(gameStateParam) ? gameStateParam : 'Even',
    gameMode: isGameMode(gameModeParam) ? gameModeParam : 'Ranked',
    enemyIds: enemyParam !== null ? enemyParam.split(',').filter(Boolean).slice(0, 5) : DEFAULT_ENEMIES
  };
}

export function writeStateToUrl(championId: string, role: Role, gameState: GameState, gameMode: GameMode, enemyIds: string[]) {
  const params = new URLSearchParams();
  params.set('champion', championId);
  params.set('role', role);
  params.set('state', gameState);
  params.set('mode', gameMode);
  // An empty parameter preserves a cleared team; an absent one uses defaults.
  params.set('enemies', enemyIds.join(','));

  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
    window.history.replaceState(null, '', nextUrl);
  }
}

function isRole(value: string | null): value is Role {
  return roles.includes(value as Role);
}

function isGameState(value: string | null): value is GameState {
  return gameStates.includes(value as GameState);
}

function isGameMode(value: string | null): value is GameMode {
  return gameModes.includes(value as GameMode);
}
