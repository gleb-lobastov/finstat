define([
   "jquery",
   "moment",
   "finstat/core"
], function ($, moment, core) {
   "use strict";

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
         getCookie: getCookie,
         addPeriodChangesRow: addPeriodChangesRow
      }
   };

   function getCookie(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
   }

   function addPeriodChangesRow(arrayOfObjects, originalField, fieldToSave, precision) {
      if (!core.enums.Interval.hasOwnProperty(precision)) {
         throw new Error('Unsupported type of interval')
      }

      var
         current,
         previous,
         track,
         formats = {
            upToDay: 'LL',
            upToMonth: 'MMMM YYYY',
            upToYear: 'YYYY'
         };

      for (var index=0; index < arrayOfObjects.length; index++) {
         current = new moment(arrayOfObjects[index][originalField]);
         if (previous) {
            if (precision === core.enums.Interval.daily && current.date() !== previous.date()) {
               track = 'upToDay';
            } else if (precision !== core.enums.Interval.annual && current.month() !== previous.month()) {
               track = 'upToMonth';
            } else if (current.year() !== previous.year()) {
               track = 'upToYear';
            }

         // Logic for first item of arrayOfObjects
         } else if (precision === core.enums.Interval.daily) {
            track = 'upToDay';
         } else if (precision === core.enums.Interval.monthly) {
            track = 'upToMonth';
         } else {
            track = 'upToYear';
         }

         arrayOfObjects[index][fieldToSave] = track ? current.format(formats[track]) : '';
         previous = current;
      }

      return arrayOfObjects;
   }

});