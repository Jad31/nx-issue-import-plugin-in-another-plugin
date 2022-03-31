import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('second-plugin e2e', () => {
  it('should create second-plugin', async () => {
    const plugin = uniq('second-plugin');
    ensureNxProject('@workspace-poc/second-plugin', 'dist/libs/second-plugin');
    await runNxCommandAsync(
      `generate @workspace-poc/second-plugin:second-plugin ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('second-plugin');
      ensureNxProject(
        '@workspace-poc/second-plugin',
        'dist/libs/second-plugin'
      );
      await runNxCommandAsync(
        `generate @workspace-poc/second-plugin:second-plugin ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const plugin = uniq('second-plugin');
      ensureNxProject(
        '@workspace-poc/second-plugin',
        'dist/libs/second-plugin'
      );
      await runNxCommandAsync(
        `generate @workspace-poc/second-plugin:second-plugin ${plugin} --tags e2etag,e2ePackage`
      );
      const project = readJson(`libs/${plugin}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
