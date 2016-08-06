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
    * @param options.$target {JQuery} Селектор для инициализации editable.
    * @param options.collection {Intervals} Коллекция интервалов на изменения в транзакциях которых вешается x-editable
    */

   function init(options) {
      var
         annotated = !!options.annotations,
         settings = {};
      options.mode = options.mode || 'update';

      // Если options.annotations заданно, то выполняем только после загрузки данных, иначе сразу
      $.when(annotated ? options.annotations.fetched : true).then(function () {
         if (options.mode === 'update') {
            settings = {
               ajaxOptions: {
                  type: "PATCH",
                  beforeSend: $.fn.editable.defaults.ajaxOptions.beforeSend
               },
               type: annotated ? 'select' : 'text',
               send: 'always',
               params: function (params) {
                  var result = {};
                  result[params.name] = params.value;
                  return result;
               }
            };

            if (annotated) {
               settings.source = options.annotations.toObject();
            }
            if (options.collection) {
               settings.success = _createSuccessHandler(options.collection);
               options.$target.on('init', function (e, edt) {
                  edt.options.url = options.collection.url + '/' + edt.options.pk;
               });
            }
            options.$target.editable(settings);
         }
      });
   }

   function _createSuccessHandler(collection) {
      return function success(response) {
         collection.getTransactionById(response.id).set(response);
      }
   }

});