import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { BaseBuildConfig, CliPlugin, ModuleTools } from '@modern-js/module-tools';

const TYPESCRIPT_TRANSFORM_PATHS = 'typescript-transform-paths';

export const modulePluginTransformPaths = (): CliPlugin<ModuleTools> => {
  const tsconfigMap = new Map<string, string>();

  const handleConfig = async (config: BaseBuildConfig) => {
    if (config.dts) {
      const { tsconfigPath } = config.dts;
      const tsconfigText = fs.readFileSync(tsconfigPath, 'utf-8');
      tsconfigMap.set(tsconfigPath, tsconfigText);
      let tsconfig: any;
      try {
        tsconfig = JSON.parse(tsconfigText);
      } catch (error) {
        console.error('tsconfig parse error', error);
        return;
      }
      if (
        !tsconfig.compilerOptions?.plugins?.some(
          (item: any) => item.transform === TYPESCRIPT_TRANSFORM_PATHS && item.afterDeclarations,
        )
      ) {
        tsconfig.compilerOptions ??= {};
        tsconfig.compilerOptions.plugins ??= [];
        tsconfig.compilerOptions.plugins.push({
          transform: TYPESCRIPT_TRANSFORM_PATHS,
          afterDeclarations: true,
        });
        fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
      }
    }
  };

  return {
    name: 'transform-paths-plugin',
    setup(api) {
      return {
        beforeBuild(options) {
          /**
           * install ts-patch
           */
          execSync(`node ${require.resolve('ts-patch/bin/ts-patch.js')} install -s`);

          /**
           * fake install typescript-transform-paths
           */
          const { nodeModulesDirectory } = api.useAppContext();
          const targetPath = path.dirname(require.resolve(`${TYPESCRIPT_TRANSFORM_PATHS}/package.json`));
          const linkPath = path.resolve(nodeModulesDirectory, TYPESCRIPT_TRANSFORM_PATHS);
          if (!fs.existsSync(linkPath)) {
            fs.symlinkSync(targetPath, linkPath);
          }

          /**
           * handle tsconfig.json
           */
          const { config } = options;
          if (Array.isArray(config)) {
            config.forEach(handleConfig);
          } else {
            handleConfig(config);
          }
        },

        afterBuild() {
          /**
           * restore tsconfig.json
           */
          tsconfigMap.forEach((tsconfigText, tsconfigPath) => {
            fs.writeFileSync(tsconfigPath, tsconfigText);
            tsconfigMap.delete(tsconfigPath);
          });
        },
      };
    },
  };
};
