// Точка входа приложения finstat
require(["config"], function (document) {
   // Чтобы резолвить зависимости сначала подгружаем конфиг requirejs.
   require([
      "jquery",
      "finstat/adapters/selectable/selectize",
      "finstat/adapters/datepicker/airDatepicker",
      "finstat/adapters/editable/x-editable",
      "finstat/adapters/editable/bootbox",
      "finstat/components/header/main",
      "finstat/components/transactions/list"
   ], function ($, selectable, datepicker, editableLegacy, editable, Header, transactionsListUnit) {

      // Вынесено сюда для загрузки позже bootstrap.css
      require(["css!finstat/styles/finstat.css", "css!finstat/styles/components.css"]);

      var Workspace = Backbone.Router.extend({

         routes: {
            "finstat(/)": "index",
            "finstat/transactions(/:groupBy)(/:page)(/)": "transactions"
         },

         index: function () {
            $('#finstat__content').html('ololo');
         },

         transactions: function (groupBy, page) {
            if (!groupBy) {
               var transactionsListView = new transactionsListUnit.View({
                  plugins: {
                     editable: editable,
                     editableLegacy: editableLegacy,
                     datepicker: datepicker,
                     selectable: selectable
                  }
               });
               $('#finstat__header').html(new Header({title: 'Список транзакций '}).render());
               $('#finstat__content').html(transactionsListView.render().$el);
            }
         }

      });

      $(document).ready(function () {
         new Workspace;
         Backbone.history.start({pushState: true});
      });

   });
});