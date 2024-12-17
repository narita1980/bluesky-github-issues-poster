# bluesky-github-issues-poster

GitHubリポジトリの新規Issueを定期的にチェックし、Blueskyに自動投稿するためのNode.jsスクリプトです。

## 概要

このスクリプトはGitHubのREST APIを用いて対象リポジトリのIssue一覧を取得し、新しいIssueが見つかった場合、Blueskyへ自動的に投稿します。  
cronなどを利用して定期実行することで、最新Issueを継続的にBlueskyへ共有できます。

## 特徴

- 指定したGitHubリポジトリの新規Issueを自動検知
- Blueskyへの投稿は簡潔なテキストメッセージ形式
- `last_issue_id.txt`で前回投稿済みのIssueを追跡し、重複投稿を防止
- `.env`ファイルでBluesky認証情報や対象リポジトリを設定可能

## 必要要件

- Node.js（バージョン16以上推奨）
- npm（Node.jsインストール時に同梱）
- BlueskyアカウントおよびApp Password
- 公開リポジトリであればGitHub Tokenは必須ではありませんが、レートリミット超過が気になる場合は[Personal Access Token](https://docs.github.com/ja/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)の利用を推奨

## 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、以下を記入してください。

```env
BLUESKY_IDENTIFIER=あなたのBlueskyハンドル (例: handle.bsky.social)
BLUESKY_PASSWORD=BlueskyのApp Password
GITHUB_OWNER=リポジトリ所有者 (例: snakajima)
GITHUB_REPO=リポジトリ名 (例: life-is-beautiful)
# GITHUB_TOKEN=必要に応じて設定（rate limit回避用）
```

`.env`には認証情報が含まれるため、`.gitignore`でリポジトリに含めないようご注意ください。

## インストール手順

```bash
git clone https://github.com/あなたのユーザー名/bluesky-github-issues-poster.git
cd bluesky-github-issues-poster
npm install
```

## 実行方法

```bash
node post-issues-to-bluesky.js
```

初回実行時、最新のIssueがBlueskyに投稿され、`last_issue_id.txt`が生成されます。  
以後同じIssueは再投稿されません。

## 定期実行（cron）の例

MacやLinux環境で5分おきにチェックしたい場合は以下を参考にします。

```bash
crontab -e
```

エディタが開いたら、以下を追加（Node.jsやスクリプトのパスは環境に合わせて修正）:

```cron
*/5 * * * * /usr/local/bin/node /path/to/bluesky-github-issues-poster/post-issues-to-bluesky.js
```

これで5分ごとに新しいIssueを確認し、あればBlueskyへ投稿します。

## 注意点

- `node_modules` や `last_issue_id.txt` はGit管理から除外しましょう（`.gitignore`推奨）。
- `.env`ファイルやApp Passwordなどの機密情報をGithub上に公開しないようにしてください。
- 公開リポジトリの場合、GitHub TokenなしでもIssues取得は可能ですが、レート制限で問題が出る可能性があります。その際はPATの利用を検討してください。
