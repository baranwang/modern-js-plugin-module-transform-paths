# modern-js-plugin-module-transform-paths

[中文文档](./README.zh-CN.md)

In its current form, modernjs has difficulty processing code structures like `Promise<import('@common/utils')>`. To address this, we utilize `typescript-transform-paths`.

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
