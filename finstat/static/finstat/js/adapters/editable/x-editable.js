/**
 * Адаптер для UI компонента — надстройки над select'ами
 *
 * API для всех адаптеров: метод init с параметром options.
 */
define([
   "underscore",
   "finstat/helpers",
   "bootstrap-editable"
], function (_, helpers) {

   $.fn.editable.defaults.ajaxOptions = {
      beforeSend: function (xhr) {
         xhr.setRequestHeader("X-CSRFToken", helpers.getCookie('csrftoken'))
      }
   };

   return {
      init: init
   };

   /**
    *
    * @param options {Object} Набор опций в формате независимом от используемого компонента
    * @param options.$target {JQuery} Селектор для инициализации selectize.
    * @param options.model {Backbone.Model} Модель к которой применяется выборка
    * @param options.attribute {string} Аттрибут модели
    */

   function init(options) {
      var settings = {};
      options.mode = options.mode || 'update';
      if (options.mode === 'update') {
         settings = {
            ajaxOptions: {
               type: "PATCH",
               beforeSend: $.fn.editable.defaults.ajaxOptions.beforeSend
            },
            send: 'always',
            params: function (params) {
               var result = {};
               result[params.name] = params.value;
               return result;
            }
         };

         if (options.collection) {
            settings.success = _createSuccessHandler(options.collection);
            options.$target.on('init', function (e, edt) {
               edt.options.url = options.collection.url + '/' + edt.options.pk;
            }).editable(settings);
         }
      }
   }

   function _createSuccessHandler(collection) {
      return function success(response) {
         collection.getTransactionById(response.id).set(response);
      }
   }

});