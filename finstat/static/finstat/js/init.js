// Точка входа приложения finstat
require(["config"], function (document) {
   // Чтобы резолвить зависимости сначала подгружаем конфиг requirejs.
   require([
      "jquery",
      "finstat/adapters/selectable/selectize",
      "finstat/adapters/datepicker/airDatepicker",
      "finstat/adapters/editable/x-editable",
      "finstat/interval/view",
      "bootstrap",
      "bootstrap-editable"
   ], function ($, selectable, datepicker, editable, transactionsListUnit) {
      var transactionsListView = new transactionsListUnit.View({
         dependencies: {
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