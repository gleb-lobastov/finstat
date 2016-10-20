// Точка входа приложения finstat

// Загрузка конфига requirejs, без него файлы зависимостей не будут найдены.
require(["config"], function (document) {

   // Загрузка и настройка библиотек. Делается до запуска приложения что-бы его логика гарантированно учла настройки.
   require([
      "jquery",
      "backbone",
      "moment",
      "moment/locale/ru",
      "bootstrap",
      "unit!finstat/extensions/navigable" // Включает роутинг Backbone для ссылок <a href=...> вместо прямого перехода
   ], function ($, Backbone, moment) {
      moment.locale('ru');

      var backboneSync = Backbone.sync;
      var relativeRoot = '/finstat/';
      var absoluteRoot = window.location.origin + relativeRoot;
      Backbone.sync = function (method, model, options) {
         /*
          * Change the `url` property of options to begin
          * with the URL from settings
          * This works because the options object gets sent as
          * the jQuery ajax options, which includes the `url` property
          */
         options = _.extend(options, {
            url: absoluteRoot + _.result(model, 'url')
         });

         /*
          *  Call the stored original Backbone.sync
          * method with the new url property
          */
         backboneSync(method, model, options);
      };

      // Запуск приложения
      require([
         // Компоненты
         "unit!finstat/components/header",
         "unit!finstat/components/transactions",
         "unit!finstat/components/accounting",

         // Плагины
         "finstat/adapters/selectable/selectize",
         "finstat/adapters/datepicker/airDatepicker",
         "finstat/adapters/editable/x-editable",
         "finstat/adapters/editable/bootbox",

         // Стили, должны загружаться позже bootstrap.css
         "css!finstat/styles/finstat.css",
         "css!finstat/styles/components.css"
      ], function (headerUnit, transactionsUnit, accountingUnit, selectable, datepicker, editableLegacy, editable) {

         var header = new headerUnit.View();
         var plugins = {
            editable: editable,
            editableLegacy: editableLegacy,
            datepicker: datepicker,
            selectable: selectable
         };

         var Workspace = Backbone.Router.extend({
            routes: {
               "(/)": "index",
               "transactions(/:groupBy)(/:page)(/)": "transactions",
               "accounting(/:page)(/)": "accounting"
//               "statistics(/:groupBy)(/:page)(/)": "statistics",
//               "forecasting(/:groupBy)(/:page)(/)": "forecasting"
            },

            index: function () {
               header.model.update({
                  title: 'Главная страница ',
                  baseUrl: '',
                  sections: false
               });

               $('#finstat__content').html('<p>Выберите реестр</p>');
            },

            transactions: function (groupBy, page) {
               var view;
               header.model.update({
                  title: 'Список операций ',
                  baseUrl: 'transactions',
                  sections: [
                     {title: 'Полный'},
                     {title: 'По датам', url: '/daily'},
                     {title: 'По месяцам', url: '/monthly'},
                     {title: 'По годам', url: '/annual'}
                  ]
               }, groupBy ? '/' + groupBy : '');

               if (groupBy === 'annual') {
                  view = new transactionsUnit.ViewAnnual({plugins: plugins});
               } else if (groupBy === 'monthly') {
                  view = new transactionsUnit.ViewMonthly({plugins: plugins});
               } else if (groupBy === 'daily') {
                  view = new transactionsUnit.ViewDaily({plugins: plugins});
               } else {
                  view = new transactionsUnit.ViewEach({plugins: plugins});
               }

               $('#finstat__content').html(view.render().$el);
            },

            accounting: function () {
               header.model.update({
                  title: 'Состояние счетов ',
                  baseUrl: 'accounting',
                  sections: false
               });

               var view = new accountingUnit.ViewAccounting();
               $('#finstat__content').html(view.render().$el);
            },

            statistics: function () {
               header.model.update({
                  title: 'Статистика ',
                  baseUrl: 'statistics',
                  sections: false
               });

               $('#finstat__content').html('<p>Выберите реестр</p>');
            },

            forecasting: function () {
               header.model.update({
                  title: 'Прогноз ',
                  baseUrl: 'forecasting',
                  sections: false
               });

               $('#finstat__content').html('<p>Выберите реестр</p>');
            }

         });

         $(document).ready(function () {
            new Workspace;
            Backbone.history.start({
               pushState: true,
               root: relativeRoot
            });
            $('#finstat__header').html(header.$el);
         });
      });
   });
});