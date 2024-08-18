"use strict";

import { ChangeLogCommit, ExportedChangeLogCommitData } from "./ChangeLogCommit";
import { GameObject } from "./GameObject";
import { Git } from "./Git";

class ChangeLogVersion {
  git: Git;
  objects: Record<string, GameObject>;
  id: string;
  previous: ChangeLogVersion;
  commits: ChangeLogCommit[];
  constructor(git: Git, objects: Record<string, GameObject>, id: string, previous: ChangeLogVersion) {
    this.git = git;
    this.objects = objects;
    this.id = id;
    this.previous = previous;
  }

  tag(): string {
    if (this.id == '0') return "OneLife_vStart";
    if (this.isUnreleased()) return "master";
    if (parseInt(this.id) < 20269) return "OneLife_v" + this.id;
    return "2HOL_v" + this.id;
  }

  populateObjects(): void {
    const differences = this.diff();
    for (let difference of differences) {
      if (difference[0] == "A")
        this.populateObjectAtPath(difference[1]);
      else if (difference[0].startsWith("R"))
        this.populateObjectAtPath(difference[2]);
    }
  }

  diff(): string[][] {
    if (!this.previous) return [];
    return this.git.fileChanges(this.previous.tag(), this.tag());
  }

  populateObjectAtPath(path: string): void {
    const parts = path.split("/");
    if (parts[0] == "objects") {
      const object = this.objects[parts[1].split(".")[0]];
      if (object)
        object.version = this.id;
    }
  }

  jsonData(): ExportedChangeLogVersionData {
    const data: ExportedChangeLogVersionData = {id: this.id};
    const commits = this.fetchCommits();
    if (this.isReleased() && commits[0]) {
      data.date = commits[0].date;
    }
    data.commits = commits.filter(c => c.isRelevant()).map(c => c.jsonData());
    return data;
  }

  fetchCommits(): ChangeLogCommit[] {
    if (!this.previous) return [];
    if (!this.commits) {
      console.log(`Log length: ${this.git.log(this.previous.tag(), this.tag()).length}`);
      this.commits = this.git.log(this.previous.tag(), this.tag()).map(entry => {
        try {
          console.log(`Processing log entry: ${entry.sha}`);
          let changeLogCommit = new ChangeLogCommit(this, entry);
          return changeLogCommit;
        } catch(e) {
          console.log("ERROR!!! Ignoring ChangeLogCommit");
          return null;
        }
      })
      .filter(v => v);
    }
    console.log("\n\n\nFetched commits!\n\n\n")
    return this.commits;
  }

  isUnreleased(): boolean {
    return this.id === "unreleased";
  }

  isReleased(): boolean {
    return this.id !== "unreleased";
  }
}

interface ExportedChangeLogVersionData {
  id: string;
  date?: Date;
  commits?: ExportedChangeLogCommitData[];
}

export { ChangeLogVersion, ExportedChangeLogVersionData }
