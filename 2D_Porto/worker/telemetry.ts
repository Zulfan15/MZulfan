export interface Env {
  STATS_KV?: KVNamespace;
  AI?: any;
}

export async function fetchLiveStats(env: Env) {
  try {
    // 1. Check KV cache first
    if (env.STATS_KV) {
      const cached = await env.STATS_KV.get('telemetry_data', 'json');
      if (cached) return cached;
    }

    // 2. Fetch fresh GitHub data
    const ghRes = await fetch('https://api.github.com/users/Zulfan15/repos?per_page=6&sort=updated', {
      headers: { 'User-Agent': 'Zulfan-Town-Telemetry' },
    });

    let activeRepos = [];
    if (ghRes.ok) {
      const repos = (await ghRes.json()) as any[];
      activeRepos = repos.slice(0, 4).map((r) => ({
        name: r.name,
        description: r.description || 'Open source engineering project',
        url: r.html_url,
        language: r.language || 'Code',
        stars: r.stargazers_count,
      }));
    }

    const payload = {
      github: {
        username: 'Zulfan15',
        streak: 14,
        contributionsYear: 348,
        activeRepos,
      },
      leetcode: {
        username: 'zulfan',
        totalSolved: 128,
        easy: 64,
        medium: 52,
        hard: 12,
        acceptanceRate: '78.4%',
      },
      spotify: {
        connected: false,
      },
      updatedAt: new Date().toISOString(),
    };

    // Cache in KV for 24 hours
    if (env.STATS_KV) {
      await env.STATS_KV.put('telemetry_data', JSON.stringify(payload), {
        expirationTtl: 86400,
      });
    }

    return payload;
  } catch (err) {
    return { error: 'Failed to fetch telemetry stats' };
  }
}
