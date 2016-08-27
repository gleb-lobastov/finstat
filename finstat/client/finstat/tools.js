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

   FutureApi.prototype.init = function (resolvedApi) {
      this._waiting.achieve('api', resolvedApi);
   };

   FutureApi.prototype.method = function (methodName) {
      var api = this;
      return function forwarder() {
         var
            context = this,
            args = arguments;
         return api._waiting.wait('api').then(function (resolvedApi) {
            return resolvedApi[methodName].apply(context, args);
         });
      }
   };

   return {
      Waiting: Waiting,
      FutureApi: FutureApi
   }
});