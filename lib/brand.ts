export const BRAND_VIEW_BOX = '0 0 38 38';
export const BRAND_MUTED_LIGHT = '#c8c8c8';
export const BRAND_MUTED_DARK = '#424242';
export const BRAND_ACCENT_LIGHT = '#fb7100';
export const BRAND_ACCENT_DARK = '#ffc799';

export const BRAND_FRAMES = [
  ['11111', '00100', '00100', '00100', '00100'],
  ['10000', '10000', '10000', '10000', '11111'],
  ['11111', '10000', '11111', '00001', '11111'],
  ['10001', '10001', '11111', '00100', '00100'],
] as const;

export const BRAND_CELLS = Array.from({ length: 25 }, (_, index) => ({
  x: (index % 5) * 8,
  y: Math.floor(index / 5) * 8,
}));

export const SOLID_Y_PATH = 'M0 0H6V16H32V0H38V22H22V38H16V22H0Z';

type TilePose = { time: number; cell: number; opacity: number };

// Slide one lit tile into a neighbouring empty cell at a time. The letters
// contain different numbers of lit cells. Adjust the count one tile at a time
// before any sliding begins, then rearrange the resulting set of tiles.
export function buildBrandTimeline() {
  const letters = BRAND_FRAMES.map((rows) =>
    BRAND_CELLS.flatMap((_, i) =>
      rows[Math.floor(i / 5)][i % 5] === '1' ? [i] : [],
    ),
  );
  const count = Math.max(...letters.map((cells) => cells.length));
  const board: (number | null)[] = Array(25).fill(null);
  const tracks: TilePose[][] = Array.from({ length: count }, (_, tile) => {
    const cell = letters[0][tile];
    if (cell !== undefined) {
      board[cell] = tile;
    }
    return [{ time: 0, cell: cell ?? 0, opacity: cell === undefined ? 0 : 1 }];
  });
  let time = 0;
  const pose = (
    tile: number,
    cell: number,
    opacity: number,
    duration: number,
  ) => {
    const track = tracks[tile];
    track.push({ ...track[track.length - 1], time });
    track.push({ time: time + duration, cell, opacity });
  };
  const swap = (a: number, b: number) => {
    // Equal states need no movement. Every visible move is into an empty cell.
    if ((board[a] === null) === (board[b] === null)) {
      return;
    }
    const from = board[a] === null ? b : a;
    const to = from === a ? b : a;
    const tile = board[from]!;
    pose(tile, to, 1, 0.1);
    board[to] = tile;
    board[from] = null;
    time += 0.1;
  };
  const holds: { time: number; frame: number }[] = [{ time, frame: 0 }];
  for (let step = 1; step < letters.length; step++) {
    time += 1.2;
    const frame = step % letters.length;
    const target = new Set(letters[frame]);
    const occupied = () =>
      board.flatMap((tile, cell) => (tile === null ? [] : [cell]));
    const surplus = () => occupied().filter((cell) => !target.has(cell));
    const excess = occupied().length - target.size;
    if (excess > 0) {
      for (const cell of surplus().slice(0, excess)) {
        pose(board[cell]!, cell, 0, 0.18);
        board[cell] = null;
        time += 0.18;
      }
    }
    if (excess < 0) {
      const additions = [...target]
        .filter((cell) => board[cell] === null)
        .slice(0, -excess);
      for (const cell of additions) {
        const tile = tracks.findIndex((_, i) => !board.includes(i));
        // Reposition while invisible, then light each new tile in sequence.
        tracks[tile].push({ time, cell, opacity: 0 });
        pose(tile, cell, 1, 0.18);
        board[cell] = tile;
        time += 0.18;
      }
    }
    while (surplus().length) {
      const missing = [...target].filter((cell) => board[cell] === null);
      const distance = (a: number, b: number) =>
        Math.abs((a % 5) - (b % 5)) +
        Math.abs(Math.floor(a / 5) - Math.floor(b / 5));
      const pairs = surplus().flatMap((a) => missing.map((b) => ({ a, b })));
      pairs.sort((a, b) => distance(a.a, a.b) - distance(b.a, b.b));
      const { a, b } = pairs[0];
      const path = [a];
      let cell = a;
      while (cell % 5 !== b % 5) {
        cell += Math.sign((b % 5) - (cell % 5));
        path.push(cell);
      }
      while (cell !== b) {
        cell += Math.sign(b - cell) * 5;
        path.push(cell);
      }
      // Adjacent swaps exchange the endpoints and restore interior occupancy.
      for (let i = 0; i < path.length - 1; i++) {
        swap(path[i], path[i + 1]);
      }
      for (let i = path.length - 3; i >= 0; i--) {
        swap(path[i], path[i + 1]);
      }
    }
    holds.push({ time, frame });
  }
  for (const track of tracks) {
    track.push({ ...track[track.length - 1], time });
  }
  return { tracks, duration: time, holds };
}

export function brandSvg(active: string, muted: string, animated = true) {
  const rect = ({ x, y }: { x: number; y: number }) =>
    `<rect x="${x}" y="${y}" width="6" height="6"/>`;
  const background = `<g${animated ? ' class="tlsy-background"' : ''} fill="${muted}">${BRAND_CELLS.map(rect).join('')}</g>`;
  if (!animated) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${BRAND_VIEW_BOX}" fill="${active}"><path d="${SOLID_Y_PATH}"/></svg>\n`;
  }
  const { css, tileCount } = buildBrandAnimation();
  const tiles = Array.from({ length: tileCount })
    .map(
      (_, tile) =>
        `<rect class="tlsy-tile" style="animation-name:tlsy-tile-${tile}" width="6" height="6"/>`,
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${BRAND_VIEW_BOX}" fill="${active}"><style>${css}</style>${background}<g class="tlsy-moving">${tiles}</g><path class="tlsy-still" d="${SOLID_Y_PATH}"/></svg>\n`;
}

export function buildBrandAnimation() {
  const { tracks, duration: assemblyDuration } = buildBrandTimeline();
  const mergeStart = assemblyDuration + 1.2;
  const duration = mergeStart + 0.65;
  const mergePercent = ((mergeStart / duration) * 100).toFixed(5);
  const keyframes = tracks
    .map((track, tile) => {
      // Last pose wins when an invisible tile is repositioned at the same instant.
      const last = track[track.length - 1];
      const { x: finalX, y } = BRAND_CELLS[last.cell];
      const row = Math.floor(last.cell / 5);
      const column = last.cell % 5;
      // The crossbar extends right; the stem extends up with its bottom
      // edges fixed. No tile changes both dimensions, including the junction.
      const extendsUp = column === 2 && row >= 3;
      const extendsRight = BRAND_FRAMES[3][row][column + 1] === '1';
      const extendsDown =
        !extendsRight &&
        !extendsUp &&
        BRAND_FRAMES[3][row + 1]?.[column] === '1';
      const finalY = extendsUp ? y - 2 : y;
      const finalWidth = extendsRight ? 8 : 6;
      const finalHeight = extendsUp || extendsDown ? 8 : 6;
      const poses = new Map(
        [...track, { ...last, time: mergeStart }].map((pose) => [
          pose.time.toFixed(5),
          pose,
        ]),
      );
      return `@keyframes tlsy-tile-${tile}{${[...poses.values()]
        .map((pose) => {
          const { x, y } = BRAND_CELLS[pose.cell];
          return `${((pose.time / duration) * 100).toFixed(5)}%{transform:translate(${x}px,${y}px);opacity:${pose.opacity};width:6px;height:6px}`;
        })
        .join(
          '',
        )}100%{transform:translate(${finalX}px,${finalY}px);opacity:${last.opacity};width:${finalWidth}px;height:${finalHeight}px}}`;
    })
    .join('\n');
  const css = `${keyframes}
@keyframes tlsy-background{0%,${mergePercent}%{opacity:1}100%{opacity:0}}
@keyframes tlsy-moving{0%{opacity:1}100%{opacity:0}}
@keyframes tlsy-still{0%{opacity:0}100%{opacity:1}}
.tlsy-tile,.tlsy-background,.tlsy-moving,.tlsy-still{animation-duration:${duration.toFixed(2)}s;animation-iteration-count:1;animation-fill-mode:both}
.tlsy-tile{animation-timing-function:linear}
.tlsy-background{animation-name:tlsy-background;animation-timing-function:linear}
.tlsy-moving{animation-name:tlsy-moving;animation-timing-function:steps(1,end)}
.tlsy-still{animation-name:tlsy-still;animation-timing-function:steps(1,end)}
@media(prefers-reduced-motion:reduce){.tlsy-moving,.tlsy-background{display:none}.tlsy-still{animation:none;opacity:1}}`;
  return { css, tileCount: tracks.length };
}
