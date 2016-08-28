// Точка входа приложения finstat
require(["config"], function (document) {
   // Чтобы резолвить зависимости сначала подгружаем конфиг requirejs.
   require([
      "jquery",
      "finstat/adapters/selectable/selectize",
      "finstat/adapters/datepicker/airDatepicker",
      "finstat/adapters/editable/x-editable",
      "finstat/components/transactions/list"
   ], function ($, selectable, datepicker, editable, transactionsListUnit) {

      // Вынесено сюда для загрузки позже bootstrap.css
      require(["css!finstat/styles/finstat.css", "css!finstat/styles/components.css"]);

      var transactionsListView = new transactionsListUnit.View({
         plugins: {
            editable: editable,
            datepicker: datepicker,
            selectable: selectable
         }
      });
      $(document).ready(function () {
         $('#finstat__transactions-content').append(transactionsListView.render().$el);
      });
   });
});