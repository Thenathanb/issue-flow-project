export type IssueStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";
export type IssuePriority = "LOW" | "MEDIUM" | "HIGH";

export type StaticUser = {
  id: string;
  name: string;
};

export type StaticIssue = {
  id: string;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  assignedToId: string | null;
  assignedTo: StaticUser | null;
  createdBy: StaticUser;
  createdAt: string;
  updatedAt: string;
};

export const users: StaticUser[] = [
  { id: "user-alice", name: "Alice Johnson" },
  { id: "user-marcus", name: "Marcus Lee" },
  { id: "user-priya", name: "Priya Shah" },
];

export const issues: StaticIssue[] = [
  {
    id: "login-rate-limit",
    title: "Add rate limiting to login attempts",
    description:
      "Credential login should throttle repeated failed attempts and surface a clear lockout message.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    assignedToId: "user-alice",
    assignedTo: users[0],
    createdBy: users[1],
    createdAt: "2026-05-28T15:30:00.000Z",
    updatedAt: "2026-05-31T19:12:00.000Z",
  },
  {
    id: "dashboard-empty-state",
    title: "Improve dashboard empty state",
    description:
      "Show practical next steps when there are no issues instead of a blank metrics screen.",
    status: "OPEN",
    priority: "MEDIUM",
    assignedToId: "user-priya",
    assignedTo: users[2],
    createdBy: users[0],
    createdAt: "2026-05-25T11:45:00.000Z",
    updatedAt: "2026-05-25T11:45:00.000Z",
  },
  {
    id: "issue-sort-regression",
    title: "Fix issue table sorting regression",
    description:
      "Sorting by priority should keep the current filters and reset pagination to the first page.",
    status: "CLOSED",
    priority: "HIGH",
    assignedToId: "user-marcus",
    assignedTo: users[1],
    createdBy: users[2],
    createdAt: "2026-05-20T09:15:00.000Z",
    updatedAt: "2026-05-29T16:04:00.000Z",
  },
  {
    id: "mobile-sidebar",
    title: "Make sidebar responsive on mobile",
    description:
      "The navigation should collapse cleanly on narrow screens without hiding primary actions.",
    status: "OPEN",
    priority: "LOW",
    assignedToId: null,
    assignedTo: null,
    createdBy: users[0],
    createdAt: "2026-05-18T18:05:00.000Z",
    updatedAt: "2026-05-18T18:05:00.000Z",
  },
  {
    id: "toast-accessibility",
    title: "Audit toast accessibility labels",
    description:
      "Confirm success and error notifications are announced correctly by screen readers.",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    assignedToId: "user-priya",
    assignedTo: users[2],
    createdBy: users[1],
    createdAt: "2026-05-16T13:22:00.000Z",
    updatedAt: "2026-05-30T10:40:00.000Z",
  },
  {
    id: "seed-script-docs",
    title: "Document database seed script",
    description:
      "Add setup notes that explain how to seed local users, issues, and credentials.",
    status: "CLOSED",
    priority: "LOW",
    assignedToId: "user-alice",
    assignedTo: users[0],
    createdBy: users[2],
    createdAt: "2026-05-12T08:10:00.000Z",
    updatedAt: "2026-05-21T14:18:00.000Z",
  },
];
