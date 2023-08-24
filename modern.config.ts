import { moduleTools, defineConfig } from '@modern-js/module-tools';

export default defineConfig({
  plugins: [moduleTools()],
  buildConfig: {
    buildType: 'bundleless',
    format: 'cjs',
    target: 'es2019',
    outDir: './dist',
    externalHelpers: true,
  },
});
