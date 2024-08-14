"use strict";

import { GameData } from "./GameData";

class MainProcessor {
  processDir: any;
  doDownload: any;
  doSprites: any;
  doSounds: any;
  constructor(processDir) {
    this.processDir = processDir;
  }

  staticDir(edge) {
    if (edge && !process.env.ONETECH_MOD_NAME) {
      return this.processDir + "/../public/static-edge";
    }
    return this.processDir + "/../public/static";
  }

  dataDir() {
    return process.env.ONETECH_PROCESS_GIT_PATH || (this.processDir + "/OneLifeData7");
  }

  gitUrl() {
    return process.env.ONETECH_PROCESS_GIT_URL || "https://github.com/twohoursonelife/OneLifeData7.git";
  }

  process(version) {
    const gameData = new GameData(this.processDir, this.dataDir(), this.staticDir(!version));

    if (this.doDownload) {
      console.log("Downloading data...");
      gameData.download(this.gitUrl());
    } else {
      gameData.verifyDownloaded();
    }

    if (version) {
      console.log(`Checking out v${version.id}...`);
      gameData.checkoutVersion(version);
    } else {
      gameData.checkoutMaster();
    }

    console.log("Preparing directories...");
    gameData.prepareStaticDir();

    console.log("Importing objects...");
    gameData.importObjects();
    gameData.importCategories();
    gameData.importTransitions();
    gameData.importBiomes();

    console.log("Populating versions...");
    gameData.populateVersions();

    console.log("Calculating object depth...");
    gameData.calculateObjectDepth();

    if (this.doSprites) {
      console.log("Converting sprite images...");
      gameData.convertSpriteImages();
      gameData.convertGroundImages();

      console.log("Processing sprites...");
      gameData.processSprites();
    }

    if (this.doSounds) {
      console.log("Converting sound files...");
      gameData.convertSounds();
    }

    console.log("Exporting objects...");
    gameData.exportObjects();

    // console.log("Exporting versions...");
    // gameData.exportVersions();

    console.log("Exporting biomes...");
    gameData.exportBiomes();

    if (version) {
      console.log("Generating sitemap...");
      gameData.generateSitemap();
      return null;
    }

    if (process.env.ONETECH_MOD_NAME) {
      return null;
    }

    return gameData.unprocessedVersion(this.staticDir(false), !this.doDownload);
  }
}

export { MainProcessor }
