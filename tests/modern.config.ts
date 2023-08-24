import { moduleTools, defineConfig } from '@modern-js/module-tools';
import { modulePluginTransformPaths } from 'modern-js-plugin-module-transform-paths';

export default defineConfig({
  plugins: [moduleTools(), modulePluginTransformPaths()],
  buildPreset: 'npm-component',
});
