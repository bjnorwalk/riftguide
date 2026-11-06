import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_ENEMIES, readStateFromUrl, writeStateToUrl } from './urlState';

function openUrl(search = '') {
  const location = new URL(`https://riftguide.test/riftguide/${search}`);
  const replaceState = vi.fn((_state: unknown, _unused: string, url?: string | URL | null) => {
    if (url != null) location.href = new URL(url, location).href;
  });
  vi.stubGlobal('window', { location, history: { replaceState } });
  return { location, replaceState };
}

beforeEach(() => openUrl());
afterEach(() => vi.unstubAllGlobals());

describe('shared build URLs', () => {
  it('keeps the default team for existing links without an enemies parameter', () => {
    expect(readStateFromUrl()).toEqual({
      championId: 'Ahri', role: 'Mid', gameState: 'Even', gameMode: 'Ranked',
      enemyIds: DEFAULT_ENEMIES
    });
  });

  it('reads an explicitly empty enemy team without restoring defaults', () => {
    openUrl('?champion=Lux&enemies=');
    expect(readStateFromUrl().enemyIds).toEqual([]);
  });

  it.each([
    { enemyIds: [] },
    { enemyIds: ['Zed'] },
    { enemyIds: ['Zed', 'Soraka', 'Malphite', 'Lux', 'Ahri'] }
  ])(
    'preserves a selected team through a write/read round trip: $enemyIds',
    ({ enemyIds }) => {
      writeStateToUrl('Lux', 'Support', 'Behind', 'Ranked', enemyIds);
      expect(readStateFromUrl()).toEqual({
        championId: 'Lux', role: 'Support', gameState: 'Behind', gameMode: 'Ranked',
        enemyIds
      });
      expect(window.location.pathname).toBe('/riftguide/');
      expect(new URLSearchParams(window.location.search).has('enemies')).toBe(true);
    }
  );

  it('ignores blank enemy slots and limits shared teams to five champions', () => {
    openUrl('?enemies=Zed,,Soraka,Malphite,Lux,Ahri,Garen');
    expect(readStateFromUrl().enemyIds).toEqual(['Zed', 'Soraka', 'Malphite', 'Lux', 'Ahri']);
  });

  it('does not replace history again when the selected build URL is unchanged', () => {
    const { replaceState } = openUrl();
    writeStateToUrl('Lux', 'Support', 'Even', 'Ranked', []);
    writeStateToUrl('Lux', 'Support', 'Even', 'Ranked', []);
    expect(replaceState).toHaveBeenCalledTimes(1);
  });
});
