/**
 * Адаптер для UI компонента — надстройки над select'ами
 *
 * API для всех адаптеров: метод init с параметром options.
 */
define([
   "underscore",
   "bootbox",
   "finstat/misc/tools",
   'finstat/components/single/collections',
   "finstat/components/helpers",
   "bootstrap"
], function (_, bootbox, tools, single, helpers) {

   return {
      init: init
   };

   function init(view) {
      view.on('rendered', function () {
         _.map(this.editableConfig, function (options, selector) {
            var settings = {$target: view.$(selector)};
            if (!options.use || options.use === 'collection') {
               settings.collection = view.collection
            }
            if (!options.use || options.use === 'model') {
               settings.model = view.model
            }
            _editable(_.extend(settings, options));
         }, view);
      });
   }

   /**
    *
    * @param options {Object} Набор опций в формате независимом от используемого компонента
    * @param options.$target {JQuery} Селектор для инициализации editable.
    * @param options.collection {Intervals} Коллекция интервалов на изменения в транзакциях которых вешается x-editable
    */

   function _editable(options) {
      var
         annotated = !!options.annotations,
         settings = {};
      options.mode = options.mode || 'update';

      // Если options.annotations заданно, то выполняем только после загрузки данных, иначе сразу
      $.when(annotated ? options.annotations.fetched : true).then(function () {
         if (options.mode === 'update') {
            options.$target.click(function (event) {
               var
                  $target = $(event.target),
                  model,
                  field = options.field || $target.attr('data-field'),
                  question;

               if (options.collection) {
                  model = options.collection.get(pk || $target.attr('data-pk'));
               } else if (options.model) {
                  model = options.model;
               }

               if ($.isFunction(options.question)) {
                  question = options.question(model);
               } else {
                  question = options.question;
               }

               bootbox.prompt({
                  title: question,
                  value: field ? model.get(field) : (options.value || ''),
                  callback: _createHandler($target, model, field)
               })
            });
         }
      });
   }

   function _createHandler($target, model, field) {
      return function answer(response) {
         if (field && response !== null) {
            model.set(field, response);
         }
      }
   }

});