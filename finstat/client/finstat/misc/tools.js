define([
   "jquery"
], function ($) {

   function Waiting() {
      this._storage = {}
   }

   Waiting.prototype._wait = function (key) {
      if (!this._storage[key]) {
         this._storage[key] = new $.Deferred();
      }
      return this._storage[key];
   };

   Waiting.prototype.wait = function (key) {
      return this._wait(key).promise();
   };

   Waiting.prototype.achieve = function (key, result) {
      var self = this;
      $.when(result).then(function (resolved) {
         self._wait(key).resolve(resolved);
      });
   };

   function FutureApi() {
      this._waiting = new Waiting()
   }

   FutureApi.prototype.init = function (resolvedApi, controlId) {
      this._waiting.achieve(controlId || 'default_api', resolvedApi);
   };

   FutureApi.prototype.method = function (methodName, controlId) {
      var api = this;
      return function forwarder() {
         var
            context = this,
            args = arguments;
         return api._waiting.wait(controlId || 'default_api').then(function (resolvedApi) {
            return resolvedApi[methodName].apply(context, args);
         });
      }
   };

   var PluginsMixin = {
      pluginsApi: {},
      initPlugins: function (plugins, required) {
         _.each(required, function (name) {
            this.pluginsApi[name] = plugins[name].init(this);
         }, this);
      }
   };

   return {
      Waiting: Waiting,
      FutureApi: FutureApi,
      PluginsMixin: PluginsMixin,
      helpers: {
         getCookie: getCookie
      }
   };

   function getCookie(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
   }
});