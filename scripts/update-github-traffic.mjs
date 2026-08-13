import { readFile, writeFile } from 'node:fs/promises';

const repository = process.env.GITHUB_TRAFFIC_REPOSITORY || 'yuaiccc/HDU-xiaoyuananquantong';
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const outputPath = new URL('../data/github_traffic.json', import.meta.url);

if (!token) {
  throw new Error('GITHUB_TOKEN is required to read repository traffic');
}

const response = await fetch(`https://api.github.com/repos/${repository}/traffic/clones`, {
  headers: {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  },
});

if (!response.ok) {
  const body = await response.text();
  throw new Error(`GitHub traffic API ${response.status}: ${body.slice(0, 200)}`);
}

const traffic = await response.json();
let current = null;
try {
  current = JSON.parse(await readFile(outputPath, 'utf8'));
} catch {
  // The first scheduled run creates the snapshot.
}

const latestTimestamp = (rows) =>
  rows.reduce((latest, row) => (row.timestamp > latest ? row.timestamp : latest), '');
const latestTrafficTimestamp = latestTimestamp(traffic.clones ?? []);
const countedThrough = current?.counted_through || latestTimestamp(current?.clones ?? []) || latestTrafficTimestamp;
const newCloneCount = current
  ? (traffic.clones ?? [])
      .filter((row) => row.timestamp > countedThrough)
      .reduce((total, row) => total + row.count, 0)
  : 0;
const cumulativeCount =
  typeof current?.cumulative_count === 'number' ? current.cumulative_count + newCloneCount : traffic.count;
const cumulativeSince = current?.cumulative_since || current?.fetched_at || new Date().toISOString();
const next = {
  repository,
  window_days: 14,
  count: traffic.count,
  uniques: traffic.uniques,
  cumulative_count: cumulativeCount,
  cumulative_since: cumulativeSince,
  counted_through: latestTrafficTimestamp || countedThrough,
  clones: traffic.clones,
  fetched_at: new Date().toISOString(),
};

const metricsChanged =
  current?.count !== next.count ||
  current?.uniques !== next.uniques ||
  current?.cumulative_count !== next.cumulative_count ||
  current?.cumulative_since !== next.cumulative_since ||
  current?.counted_through !== next.counted_through ||
  JSON.stringify(current?.clones ?? []) !== JSON.stringify(next.clones);

if (!metricsChanged) {
  console.log(`GitHub traffic unchanged: ${next.cumulative_count} cumulative clone events`);
  process.exit(0);
}

await writeFile(outputPath, `${JSON.stringify(next, null, 2)}\n`);
console.log(`Updated GitHub traffic: ${next.cumulative_count} cumulative clone events`);
