# modern-js-plugin-module-transform-paths

[中文文档](./README.zh-CN.md)

Currently, modernjs struggles with processing alias translations in the form of  `Promise<import('@common/utils')>` As a solution, this plugin was created to utilize `typescript-transform-paths` for handling alias.

## Installation

```bash
pnpm add modern-js-plugin-module-transform-paths
```

## Configuration

```ts
import { moduleTools, defineConfig } from '@modern-js/module-tools';
import { modulePluginTransformPaths } from 'modern-js-plugin-module-transform-paths';

export default defineConfig({
  plugins: [
    moduleTools(),
    modulePluginTransformPaths(),
  ],
  // ...
});
```

## Description

This plugin is built upon [`typescript-transform-paths`](https://www.npmjs.com/package/typescript-transform-paths). It processes aliases and modifies the project's `tsconfig.json` file to incorporate the `typescript-transform-paths` plugin.

```jsonc
{
  // ...
  "compilerOptions": {
    // ...
    "plugins": [
      {
        "transform": "typescript-transform-paths",
        "afterDeclarations": true
      }
    ]
  },
}
```

After running the build, the tsconfig.json file is restored.
