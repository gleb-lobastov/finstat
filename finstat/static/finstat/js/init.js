/*
static
   lib
      jquery  // lib/jquery
      bootstrap
   app_name
      style
         format
      adapters
         selectable
      components
         transactions
            list
      main.js
      config.js

 */
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
      transactionsListUnit.init({
         editable: editable,
         datepicker: datepicker,
         selectable: selectable
      });

      var transactionsListView = new transactionsListUnit.View();
      $(document).ready(function () {
         $('#finstat__transactions-content').append(transactionsListView.render().$el);
      });
   });
});

// $('#id_amount').on('keydown', function (e) {
//                var keyCode = e.keyCode || e.which;
//                if (keyCode == 9) {
//                    e.preventDefault();
//                    $(this).closest('.form-group').find('.finstat__extra-switcher').popover('show');
//                }
//            });


// $('.finstat__extra-switcher').popover({
//                placement: 'bottom',
//                 content: $('#finstat__extra-popup-tpl').html(),
//                html: true
//            }).on('shown.bs.popover', function () {
//                 $('.ext__chosen').selectize();
//            });

//            $(".form-control").on('keydown', 'input', function (e) {
//                var keyCode = e.keyCode || e.which;
//
//                if (keyCode == 9) {
//                    e.preventDefault();
//                    console.log($(this).closest('.form-control').next('.form-control').find('input').attr('id'))
//                     call custom function here
//                }
//            });
//



//            require(["jquery.pjax"], function () {
//                $(document).pjax('a[data-pjax]', '#finstat__data-container');
//            });
//
//            $('.lgv__ajax-form').submit(function () {
//                var
//                    container = $(this),
//                    form = container.find('form');
//
//                $.ajax({
//                    data: form.serialize(),
//                    type: form.attr('method'),
//                    url: form.attr('action'),
//                    success: function (response) {
//                        container.html(response);
//                    }
//                });
//                return false;
//            });
//        });
//            });
//        });