import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fakeInstall } from 'fake-install';
import { CliPlugin, ModuleTools, PartialBaseBuildConfig } from '@modern-js/module-tools';

const TYPESCRIPT_TRANSFORM_PATHS = 'typescript-transform-paths';

export const modulePluginTransformPaths = (): CliPlugin<ModuleTools> => {
  const tsconfigMap = new Map<string, string>();

  return {
    name: 'transform-paths-plugin',
    setup(api) {
      const { appDirectory, nodeModulesDirectory } = api.useAppContext();

      const handleConfig = async (config: PartialBaseBuildConfig) => {
        if (config.dts) {
          const { tsconfig: tsconfigPath = path.resolve(appDirectory, 'tsconfig.json') } = config;
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
      const restoreTsconfig = () => {
        /**
         * restore tsconfig.json
         */
        tsconfigMap.forEach((tsconfigText, tsconfigPath) => {
          fs.writeFileSync(tsconfigPath, tsconfigText);
          tsconfigMap.delete(tsconfigPath);
        });
      };

      /**
       * restore tsconfig.json when exit
       */
      process.once('exit', () => {
        restoreTsconfig();
      });

      return {
        beforeBuild(options) {
          /**
           * install ts-patch
           */
          execSync(`node ${require.resolve('ts-patch/bin/ts-patch.js')} install -s`);

          /**
           * fake install typescript-transform-paths
           */

          fakeInstall(TYPESCRIPT_TRANSFORM_PATHS, path.resolve(nodeModulesDirectory, '..'));

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
          restoreTsconfig();
        },
      };
    },
  };
};
