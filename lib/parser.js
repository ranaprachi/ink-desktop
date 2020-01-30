import { parseFile as abletonParseFile } from 'als-parser';
import { defaultInkFile } from './ink-file';
import { getByPath } from './store/project-store';
import glob from 'glob';
import { diffArrayTooSimple } from './utils/array';

const getTrackEffectiveName = track => track.Name[0].EffectiveName[0].$.Value;

export class ParserManager {
  constructor(path) {
    this.path = path;
  }
  async init() {
    this.project = getByPath(this.path);
    if (this.project.type === 'ableton-project') {
      let projectFile = this.getProjectFile(this.project);
      if (projectFile.length < 1) {
        throw new Error('Unable to find project file');
      }
      this.parser = await abletonParseFile(projectFile[0]);
    } else {
      throw new Error('Invalid Project Type');
    }
  }
  getDiff() {
    let delta = {}
    const tracks = this.parser.getTracks()[0].AudioTrack;
    const trackNames = tracks.map(getTrackEffectiveName);
    const diffedTrackNames = !Array.isArray(defaultInkFile.tracks)
      ? trackNames
      : diffArrayTooSimple(defaultInkFile.tracks, trackNames);
    if (diffedTrackNames.length > 0) {
      delta.tracks = trackNames;
    }
    return delta;
  }
  getResources() {
    return this.parser.getResourceLocations();
  }
  changeResource(path) {
    return this.parser.changeResourceLocations(path);
  } 
  getProjectFile() {
    let option = {
      cwd: this.project.path,
      absolute: true,
    };
    if (this.project.type == 'ableton-project') {
      return glob.sync('*.als', option);
    } else {
      return [];
    }
  }
  static async getInstance(path) {
    if(this.instances[path] == null) {
      this.instances[path] = new ParserManager(path);
      await this.instances[path].init();
    }
    return this.instances[path];
  }
}

ParserManager.instances = {};
