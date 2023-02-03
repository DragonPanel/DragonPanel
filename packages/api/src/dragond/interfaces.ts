export interface SystemdUnitListEntry {
  name: string;
  description: string;
  loadState: string;
  activeState: string;
  subState: string;
  followed: string;
  objectPath: string;
  queuedJobId: string;
  queuedJobType: string;
  queuedJobObjectPath: string;
}
