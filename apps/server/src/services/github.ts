const GITHUB_API_BASE = "https://api.github.com";

export class GitHubApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "GitHubApiError";
  }
}

export class GitHubClient {
  constructor(private accessToken: string) {}

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${GITHUB_API_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...init.headers,
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new GitHubApiError(res.status, `GitHub API ${path} failed: ${res.status} ${body}`);
    }

    return res.json() as Promise<T>;
  }

  getAuthenticatedUser() {
    return this.request<{
      id: number;
      login: string;
      name: string | null;
      email: string | null;
      avatar_url: string;
    }>("/user");
  }

  getRepo(owner: string, repo: string) {
    return this.request<{
      id: number;
      full_name: string;
      default_branch: string;
      private: boolean;
    }>(`/repos/${owner}/${repo}`);
  }

  listPullRequests(owner: string, repo: string, state: "open" | "closed" | "all" = "all") {
    return this.request<unknown[]>(
      `/repos/${owner}/${repo}/pulls?state=${state}&per_page=100`
    );
  }

  listPullRequestReviews(owner: string, repo: string, prNumber: number) {
    return this.request<unknown[]>(
      `/repos/${owner}/${repo}/pulls/${prNumber}/reviews?per_page=100`
    );
  }

  listIssues(owner: string, repo: string, state: "open" | "closed" | "all" = "all") {
    return this.request<unknown[]>(`/repos/${owner}/${repo}/issues?state=${state}&per_page=100`);
  }

  listCommits(owner: string, repo: string, since?: string) {
    const q = since ? `?since=${encodeURIComponent(since)}&per_page=100` : "?per_page=100";
    return this.request<unknown[]>(`/repos/${owner}/${repo}/commits${q}`);
  }

  listCheckRunsForRef(owner: string, repo: string, ref: string) {
    return this.request<{ check_runs: unknown[] }>(
      `/repos/${owner}/${repo}/commits/${ref}/check-runs`
    );
  }
}

export function createGitHubClient(accessToken: string): GitHubClient {
  return new GitHubClient(accessToken);
}
