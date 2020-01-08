import * as userStore from './lib/user-store';
import * as projectStore from './lib/project-store';
import {
  addProject,
  commitProject,
  getProjectState,
} from './lib/project';

const handlers = new Map();
function registerHandler(event, handler) {
  handlers.set(event, handler);
}
export async function handleRequest(event, data) {
  if (handlers.has(event) && typeof handlers.get(event) === 'function') {
    return handlers.get(event)(data);
  }
  // FIXME: what if there is no handler registered?
}

registerHandler('fetch-user', () => userStore.get());
registerHandler('set-user', ({ email }) => {
  const user = new userStore.User(email);
  return userStore.set(user);
});

registerHandler('fetch-projects', () => projectStore.list());
registerHandler('reset-projects', () => projectStore.reset());
registerHandler(
  'add-project',
  async projectPath => await addProject(projectPath)
);
registerHandler(
  'get-project-state',
  async projectPath => await getProjectState(projectPath)
);
registerHandler('commit-project', async ({ projectPath, commitMessage }) => {
  const user = userStore.get();
  return await commitProject(projectPath, commitMessage, user.email);
});
