"use strict";

import { spawnSync } from 'child_process';
import * as fs from 'fs';

import { ChangeLogVersion } from "./ChangeLogVersion";
import { GameData, GitVersionData } from "./GameData";
import { Git } from "./Git";

class MainProcessor {
  processDir: string;
  doDownload: boolean;
  doSprites: boolean;
  doSounds: boolean;
  doEdge: boolean;
  doLastRelease: boolean;
  constructor(processDir: string) {
    this.processDir = processDir;
  }

  staticDir(edge: boolean): string {
    if (edge && !process.env.ONETECH_MOD_NAME) {
      return this.processDir + "/../public/static-edge";
    }
    return this.processDir + "/../public/static";
  }

  dataDir(): string {
    return process.env.ONETECH_PROCESS_GIT_PATH || (this.processDir + "/OneLifeData7");
  }

  gitUrl(): string {
    return process.env.ONETECH_PROCESS_GIT_URL || "https://github.com/twohoursonelife/OneLifeData7.git";
  }

  process(version: GitVersionData | null): GitVersionData {
    // double-equals used to cover undefined case too.
    const gameData = new GameData(this.processDir, this.dataDir(), this.staticDir(version == null));
    console.time("Processing took");

    if (this.doDownload) {
      console.log("\nDownloading data...");
      console.time("Downloading data took");
      gameData.download(this.gitUrl());
      console.timeEnd("Downloading data took");
    } else {
      gameData.verifyDownloaded();
    }

    if (version) {
      console.log(`Checking out v${version.id}...`);
      console.time(`Checking out v${version.id} took`);
      gameData.checkoutVersion(version);
      console.timeEnd(`Checking out v${version.id} took`);
    } else {
      gameData.checkoutMaster();
    }

    console.log("\nPreparing directories...");
    console.time("Preparing directories took");
    gameData.prepareStaticDir();
    console.timeEnd("Preparing directories took");

    console.log("\nImporting objects...");
    console.time("Importing objects took");
    gameData.importObjects();
    console.timeEnd("Importing objects took");

    console.log("\nImporting categories...");
    console.time("Importing categories took");
    gameData.importCategories();
    console.timeEnd("Importing categories took");

    console.log("\nImporting transitions...");
    console.time("Importing transitions took");
    gameData.importTransitions();
    console.timeEnd("Importing transitions took");

    console.log("\nImporting biomes...");
    console.time("Importing biomes took");
    gameData.importBiomes();
    console.timeEnd("Importing biomes took");

    console.log("\nPopulating versions...");
    console.time("Populating versions took");
    gameData.populateVersions();
    console.timeEnd("Populating versions took");

    console.log("\nCalculating object depth...");
    console.time("Calculating object depth took");
    gameData.calculateObjectDepth();
    console.timeEnd("Calculating object depth took");

    if (this.doSprites) {
      console.log("\nConverting sprite images...");
      console.time("Converting sprite images took");
      gameData.convertSpriteImages();
      console.timeEnd("Converting sprite images took");

      console.log("\nConverting ground images...");
      console.time("Converting ground images took");
      gameData.convertGroundImages();
      console.timeEnd("Converting ground images took");

      console.log("\nProcessing sprites...");
      console.time("Processing sprites took");
      gameData.processSprites();
      console.timeEnd("Processing sprites took");
    }

    if (this.doSounds) {
      console.log("\nConverting sound files...");
      console.time("Converting sound files took");
      gameData.convertSounds();
      console.timeEnd("Converting sound files took");
    }

    console.log("\nExporting objects...");
    console.time("Exporting objects took");
    gameData.exportObjects();
    console.timeEnd("Exporting objects took");

    // console.log("\nExporting versions...");
    // gameData.exportVersions();

    console.log("\nExporting biomes...");
    console.time("Exporting biomes took");
    gameData.exportBiomes();
    console.timeEnd("Exporting biomes took");

    if (version) {
      console.log("\nGenerating sitemap...");
      console.time("Generating sitemap took");
      gameData.generateSitemap();
      console.timeEnd("Generating sitemap took");
      return null;
    }

    console.timeEnd("Processing took");

    if (process.env.ONETECH_MOD_NAME) {
      return null;
    }

    let lastReleasedVersion = gameData.unprocessedVersion(this.staticDir(false), !this.doDownload);
    return {id: lastReleasedVersion.id, tag: lastReleasedVersion.tag()};
  }

  lastReleasedVersion(): GitVersionData {
    let git = new Git(this.dataDir());
    if (fs.existsSync(this.dataDir())) {
      spawnSync("git", ["checkout", "master"], {cwd: this.dataDir()});
      spawnSync("git", ["pull"], {cwd: this.dataDir()});
    } else {
      spawnSync("git", ["clone", this.gitUrl(), this.dataDir()]);
    }
    let tag = git.run("describe", "--tags", "--match", "2HOL_v[0-9]*").trim();
    let id = tag.slice(6);
    return {id, tag};
  }
}

export { MainProcessor }
