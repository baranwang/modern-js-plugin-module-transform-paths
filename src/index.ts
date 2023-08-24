import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import {
  BaseBuildConfig,
  CliPlugin,
  ModuleTools,
} from '@modern-js/module-tools';

const handleConfig = async (config: BaseBuildConfig) => {
  if (config.dts) {
    const { default: tsconfig } = await import(config.dts.tsconfigPath);
    if (
      !tsconfig.compilerOptions?.plugins?.some(
        (item: any) =>
          item.transform === 'typescript-transform-paths' &&
          item.afterDeclarations,
      )
    ) {
      tsconfig.compilerOptions ??= {};
      tsconfig.compilerOptions.plugins ??= [];
      tsconfig.compilerOptions.plugins.push({
        transform: 'typescript-transform-paths',
        afterDeclarations: true,
      });
      writeFileSync(config.dts.tsconfigPath, JSON.stringify(tsconfig, null, 2));
    }
  }
};

export const modulePluginTransformPaths = (): CliPlugin<ModuleTools> => {
  return {
    name: 'transform-paths-plugin',
    setup() {
      return {
        beforeBuild(options) {
          execSync(
            `node ${require.resolve('ts-patch/bin/ts-patch.js')} install -s`,
          );
          const { config } = options;
          if (Array.isArray(config)) {
            config.forEach(handleConfig);
          } else {
            handleConfig(config);
          }
        },
      };
    },
  };
};
