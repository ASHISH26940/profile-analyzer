import { Octokit } from "octokit";

const octokit = new Octokit();

export async function getRepos(username: string) {
    const { data } = await octokit.request("GET /users/{username}/repos", {
        username,
        headers: { "X-GitHub-Api-Version": "2022-11-28" }
    });
    return data;
}

export async function getCommitActivity(owner: string, repo: string) {
    try {
        const { data } = await octokit.request(
            "GET /repos/{owner}/{repo}/stats/commit_activity",
            { owner, repo, headers: { "X-GitHub-Api-Version": "2022-11-28" } }
        );
        return data;
    } catch (error) {
        return null;
    }
}