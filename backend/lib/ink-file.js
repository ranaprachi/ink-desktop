import fs from 'fs';
import { join as pathJoin } from 'path';

export class InkFile {
  constructor(name, path, tracks = []) {
    this.name = name;
    this.path = path;
    this.tracks = tracks;
  }

  save() {
    let jsonObj = JSON.stringify(this, null, 2);
    let configPath = pathJoin(this.path, 'ink.json');
    fs.writeFileSync(configPath, jsonObj);
    console.log('Config saved at:', configPath);
  }
}
export var defaultInkFile;

export function initInkFile(name, path) {
  let inkFile = new InkFile(name, path);
  inkFile.save();
  defaultInkFile = inkFile;
}

export function loadInkFile(path) {
  let configPath = pathJoin(path, 'ink.json');
  let config = JSON.parse(fs.readFileSync(configPath));
  defaultInkFile = new InkFile(config.name, config.path, config.tracks);
}

export function applyDiff(delta) {
  defaultInkFile.tracks = defaultInkFile.tracks.concat(delta.tracks);
  defaultInkFile.save();
}