/**
 * Адаптер для UI компонента — надстройки над select'ами
 *
 * API для всех адаптеров: метод init с параметром options.
 */
define([
   "underscore",
   "selectize",
   "css!styles/selectize.bootstrap3",
   "css!finstat/adapters/selectable/selectize"
], function (_) {
   return {
      init: init
   };

   /**
    *
    * @param options {Object} Набор опций в формате независимом от используемого компонента
    * @param options.$target {JQuery} Селектор для инициализации selectize.
    * @param options.canCreate {boolean} Можно ли добавлять новые записи
    * @param options.annotations {Backbone.Collection} Коллекция типа AnnotationsCollection определяющая
    *    соответствие между ключом и описанием выбираемого параметра
    * @param options.model {Backbone.Model} Модель к которой применяется выборка
    * @param options.attribute {string} Аттрибут модели
    */
   function init(options) {
      var annotated = !!options.annotations;

      // Если options.annotations заданно, то выполняем только после загрузки данных, иначе сразу
      $.when(annotated ? options.annotations.fetched : true).then(function () {
         var settings = {};

         if (annotated) {
            settings.options = _.map(options.annotations.toObject(), _converter);
            settings.onOptionRemove = _createRemoveAnnotationHandler(options.annotations);
            if (options.canCreate) {
               settings.create = _createAddAnnotationHandler(options.annotations);
            }
         } else if (options.canCreate) {
            settings.create = true;
         }

         if (options.model && options.attribute) {
            settings.onChange = _createOnChangeHandler(options.model, options.attribute)
         }

         options.$target.selectize(settings);
      });
   }

   function _converter(label, id) {
      return {
         value: +id,
         text: label
      }
   }

   function _createOnChangeHandler(model, attribute) {
      return function onChangeHandler(value) {
         model.set(attribute, value)
      }
   }

   function _createAddAnnotationHandler(annotations) {
      return function addAnnotation(input, callback) {
         var 
            attributes = {},
            model;
         attributes[annotations.annotationField] = input;
         model = new annotations.model(attributes);
         annotations.listenTo(model, 'sync', function (model) {
            annotations.add(model);
            callback({
               value: model.id,
               text: input
            });
         });
         model.save();
      };
   }

   function _createRemoveAnnotationHandler(annotations) {
      return function removeAnnotation(value) {
         annotations.remove(value);
      };
   }
});