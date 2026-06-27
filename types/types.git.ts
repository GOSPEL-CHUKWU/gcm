export interface GitContext {
  diff: string;
  stat: string;
  recentCommits: string;
  projectName: string;
  projectDescription: string;
  diffTruncated: boolean;
}
