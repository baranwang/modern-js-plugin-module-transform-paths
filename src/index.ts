import { CliPlugin, ModuleTools } from '@modern-js/module-tools';

export const modulePluginTransformPaths = (): CliPlugin<ModuleTools> => {
  return {
    name: 'transform-paths-plugin',
    setup() {
      return {
        beforeBuild(options) {
          console.log(options);
        },
      };
    },
  };
};
