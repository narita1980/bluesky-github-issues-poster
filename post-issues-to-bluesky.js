require('dotenv').config();
const { BskyAgent } = require('@atproto/api');
const axios = require('axios');
const fs = require('fs');
const path = './last_issue_id.txt';

(async () => {
  const { GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN } = process.env;
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`;

  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'MyBlueskyBot'
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  const { data: issues } = await axios.get(url, { headers });

  // 前回処理したIssue IDを取得
  let lastIssueId = '';
  if (fs.existsSync(path)) {
    lastIssueId = fs.readFileSync(path, 'utf-8').trim();
  }

  // 新しいIssueを判定
  // issuesは新しいものから順に返されることが多いが確実ではないのでfilterを使用
  const newIssues = lastIssueId
    ? issues.filter(i => i.id.toString() !== lastIssueId)
    : issues;

  if (newIssues.length === 0) {
    console.log('No new issues.');
    return;
  }

  // 最初の新規Issueを投稿対象とする
  const latestIssue = newIssues[0];

  // Blueskyログイン
  const agent = new BskyAgent({ service: 'https://bsky.social' });
  await agent.login({
    identifier: process.env.BLUESKY_IDENTIFIER,
    password: process.env.BLUESKY_PASSWORD,
  });

  const text = `新しいIssueが投稿されました！\n\nタイトル: ${latestIssue.title}\nURL: ${latestIssue.html_url}\n#LifeIsBeautifulIdea2025`;
  await agent.post({ text });
  console.log('Posted to Bluesky:', latestIssue.title);

  // 処理したIssueのIDを記録して次回の重複投稿を防ぐ
  fs.writeFileSync(path, latestIssue.id.toString());
})().catch(console.error);
