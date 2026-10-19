// Default for all future MVs: original Clawd; acting is allowed, wearable overlays are not.
function cleanClawdOptions(options, policy = 'original') {
  if (policy === 'custom') return { ...options };
  const o = { ...options };
  for (const key of ['hat', 'glasses', 'headphones', 'clothes', 'costume', 'hairpin',
    'draw', 'armL', 'armR', 'col', 'dk', 'lt', 'tint', 'tintK']) delete o[key];
  return o;
}
