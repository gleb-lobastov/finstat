/**
 * Адаптер для UI компонента выбирающего дату
 *
 * API для всех адаптеров: метод init с параметром options.
 */
define([
   "underscore"
], function (_) {
   return {
      init: init
   };

   /**
    *
    * @param options {Object} Набор опций в формате независимом от используемого компонента
    * @param options.$target {JQuery} Селектор для инициализации selectize.
    * @param options.model {Backbone.Model} Модель к которой применяется выборка
    */
   function init(options) {
      var $deferred = new $.Deferred();
      
      // при открытии страницы datepicker скрыт, поэтому загружаем отложенно
      require(["datepicker"], function () {
         var 
            datepicker,
            api = {},
            settings = {
               'class': "datepicker-here",
               dateFormat: 'yyyy-mm-dd',
               autoClose: true
            };
         
         if (options.model) {
            settings['onSelect'] = _createOnChangeHandler(options.model)
         }
         
         datepicker = options.$target.datepicker(settings).data('datepicker');
         api.selectDate = datepicker.selectDate.bind(datepicker);
         $deferred.resolve(api);
      });
      
      return $deferred.promise();
   }

   function _createOnChangeHandler(model, attribute) {
      return function (formattedDate) {
          model.set({'date': formattedDate}, {silent: true});
      }
   }
});