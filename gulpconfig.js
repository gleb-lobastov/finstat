var
   debug = true,

   _ = require('underscore'),
   pluginsLoader = require('gulp-load-plugins'),
   util = require('gulp-util'),
   mainBowerFiles = require('main-bower-files'),

   environment = util.env.env || 'dev',

   buildConfig = {
      apps: ['finstat', 'layouts', 'face'],
      gulpPlugins: ['gulp-*', 'gulp.*', 'browser-sync', 'pug'],
      inputDir: 'client',
      outputDir: 'static',
      mainBowerFiles: {

      }
   },
   pluginEnvConfig = {
      concat: 'prod',
      formatPath: 'dev'
   };

module.exports = {
   env: environment,
   inputPaths: inputPaths,
   outputPaths: outputPaths,
   rootAppOutput: buildConfig.outputDir,
   job: concern(availableActions())
};


function paths(options, dir) {
   if (!_.isObject(options)) {
      options = {ext: options}
   }

   var
      ext = options.ext ? '.' + options.ext : '',
      sub = options.sub ? options.sub + '/' : '',
      search = options.hasOwnProperty('search') ? options.search : true,
      apps = options.rootOnly ? [''] : buildConfig.apps.concat(['']);

   return _.map(apps, function (app) {
      return './' + (app ? app + '/' : '') + dir + '/' + sub + (search ? '**/*' + ext : '');
   })[options.rootOnly ? 'pop' : 'slice']();
}

function inputPaths(options) {
   return paths(options, buildConfig.inputDir);
}

function outputPaths(options) {
   return paths(options, buildConfig.outputDir);
}



/**
 * Функция получающая список плагинов через gulp-load-plugins и расширяющая этот список
 * дополнительными действиям, на основе загруженных плагинов
 *
 */
function availableActions() {
   var
      inputDirRE = new RegExp('(' + buildConfig.inputDir + ')'),
      plugins = pluginsLoader({pattern: buildConfig.gulpPlugins});

   plugins.formatPath = function formatPath() {
      // Направляет вывод в папку static. В проекте принято, что клиентские исходники хранятся в папке client,
      // а сборку django берет из папки static. Поэтому переименовываем client в static
      return plugins.rename(function (path) {
         var before = path.dirname;
         path.dirname = path.dirname.replace(inputDirRE, buildConfig.outputDir);
         if (debug) {
            console.log(before + ' => ' + path.dirname);
         }
      });
   };

   plugins.mainBowerFiles = function _mainBowerFiles(filter) {
      var options = {
         env: environment,
         overrides: buildConfig.mainBowerFiles
      };
      return filter ? mainBowerFiles(filter, options) : mainBowerFiles(options);
   };

   return plugins;
}

function concern(actions) {
   return _.defaults(
      {},
      _.mapObject(pluginEnvConfig, function (taskConfig, name) {
         var acceptedEnv = _.isArray(taskConfig) ? taskConfig : [taskConfig];
         if (debug) {
            console.log(name + ' ' + (acceptedEnv.indexOf(environment) !== -1 ? 'indclued' : 'excluded'));
         }
         return acceptedEnv.indexOf(environment) === -1 ? util.noop : actions[name];
      }),
      actions
   );
}
