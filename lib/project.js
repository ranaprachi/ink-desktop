import { basename } from 'path';
import uuid from 'uuid/v4';
import Git from 'nodegit';
import * as projectStore from './store/project-store';
import { manageResource } from './resource';
import {
  gitCheckAndInit,
  gitStatus,
  gitCommit,
  gitAddRemote,
} from './git/utils';
import { initInkFile, loadInkFile, applyDiff } from './ink-file';
import { getGraph } from './git/graph';
import { ParserManager } from './parser';
import { GitServer } from './git-server';

export async function initProject(path) {
  // Check if the project is Unique and doesnt already exsist.
  if (projectStore.getByPath(path) != undefined) {
    console.error('PROJECT ALREADY EXISTS', projectStore.getByPath(path));
    return;
  }
  let name = basename(path);
  // Check if git is already initialized, if not then do it.
  await gitCheckAndInit(path);
  // TODO: Handle the case where the projects have same name.
  let gitServer = new GitServer();
  let remoteUrl = await gitServer.createRepo(name);
  gitAddRemote(path, 'origin', remoteUrl);
  initInkFile(name, path, remoteUrl);
  return new projectStore.Project(uuid(), name, path, 'ableton-project');
}

export async function addProject(path) {
  let project = await initProject(path);
  return projectStore.append(project);
}

export async function getProjectState(projectPath) {
  try {
    loadInkFile(projectPath);

    const repo = await Git.Repository.open(`${projectPath}/.git`);
    // TODO: Use the state of the ink file
    const status = await gitStatus(repo);
    const graph = await getGraph(repo);
    const parser = await ParserManager.getInstance(projectPath);
    const delta = parser.getDiff();
    // TODO: To Some how use this resource modified value.
    const deltaResource = manageResource(projectPath);
    return { status, graph, delta };
  } catch (err) {
    console.error('Bad Error:', err);
    return {};
  }
}

export async function commitProject(projectPath, commitMessage, userEmail) {
  const parser = await ParserManager.getInstance(projectPath);
  applyDiff(parser.getDiff());
  return await gitCommit(projectPath, commitMessage, userEmail);
}
