# modern-js-plugin-module-transform-paths

## 安装

```bash
pnpm add modern-js-plugin-module-transform-paths
```

## 配置

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

## 说明

插件基于 [`typescript-transform-paths`](https://www.npmjs.com/package/typescript-transform-paths) 来处理别名，运行构建会修改项目的 `tsconfig.json` 文件，添加 `typescript-transform-paths` 插件

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
