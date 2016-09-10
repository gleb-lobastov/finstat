// Точка входа приложения finstat
require(["config"], function (document) {
   // Чтобы резолвить зависимости сначала подгружаем конфиг requirejs.
   require([
      "jquery", "backbone", "moment",
      "finstat/adapters/selectable/selectize",
      "finstat/adapters/datepicker/airDatepicker",
      "finstat/adapters/editable/x-editable",
      "finstat/adapters/editable/bootbox",
      "unit!finstat/components/header",
      "unit!finstat/components/transactions",
      "unit!finstat/extensions/navigable",
      'moment/locale/ru'
   ], function ($, Backbone, moment, selectable, datepicker, editableLegacy, editable, headerUnit, transactionsUnit) {
      moment.locale('ru');

      // Вынесено сюда для загрузки позже bootstrap.css
      require(["css!finstat/styles/finstat.css", "css!finstat/styles/components.css"]);

      var plugins = {
         editable: editable,
         editableLegacy: editableLegacy,
         datepicker: datepicker,
         selectable: selectable
      };
      var header = new headerUnit.View();
      var Workspace = Backbone.Router.extend({
         routes: {
            "(/)": "index",
            "transactions(/:groupBy)(/:page)(/)": "transactions"
         },

         index: function () {
            $('#finstat__header').html(new Header({
               title: 'Финстат',
               select: false
            }).render());
            $('#finstat__content').html('ololo');
         },

         transactions: function (groupBy, page) {
            var view;
            header.model.update({
               title: 'Список операций ',
               baseUrl: 'transactions',
               sections: [{
                  title: 'Все'
               }, {
                  title: 'По датам',
                  url: '/daily'
               }, {
                  title: 'По месяцам',
                  url: '/monthly'
               }, {
                  title: 'По годам',
                  url: '/annual'
               }]
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
         }

      });

      $(document).ready(function () {
         new Workspace;
         Backbone.history.start({
            pushState: true,
            root: "/finstat/"
         });
         $('#finstat__header').html(header.$el);
      });

   });
});