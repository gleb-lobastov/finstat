// Точка входа приложения finstat
require(["config"], function (document) {
   // Чтобы резолвить зависимости сначала подгружаем конфиг requirejs.
   // Для корректной работы angular нужно что-бы DOM был уже загружен
   require([
      "jquery",
      "finstat/helpers",
      "finstat/interval/view",
//      "finstat/accounts/collection",
      "bootstrap",
      "bootstrap-editable"
   ], function ($, helpers, intervals) {

      intervals.init({
         turnEditable: turnEditable
      });
      var intervalsView = new intervals.IntervalsView();
      intervalsView.on('rendered', function () {
         var self = this;
         $(document).ready(function () {
            $('#finstat__transactions-content').append(self.$el);
         });
      });

      function turnEditable() {
         var self = this;
         $.fn.editable.defaults.ajaxOptions = {
            beforeSend: function (xhr) {
               xhr.setRequestHeader("X-CSRFToken", helpers.getCookie('csrftoken'));
            }
         };

         this.$el.find('.ext__editable-for-insert').editable();

         this.$el.find('.ext__editable-for-update').editable({
            ajaxOptions: {
               type: "PUT",
               beforeSend: $.fn.editable.defaults.ajaxOptions.beforeSend
            },
            send: 'always',
//            mode: 'inline',
            params: function (params) {
               var result = {};
               result[params.name] = params.value;
               return result;
            },
            success: function (response, newValue) {
               self.model.set('amount', newValue); //update backbone model
            }
         });
      }
   });
});
//        IntervalsView.init({
//            target: '#finstat__transactions-content',
//            onAfterRender: function () {
//                require(["datepicker"], function () {
//                     $('.ext__air-datepicker').datepicker({
//                        'class': "datepicker-here",
//                        'dateFormat': 'yyyy-mm-dd'
//                    });
//                });
//                

//        $(document).ready(function () {
//            $().append($transactions);
//        });
// $('.ext__chosen').selectize();
// $('.ext__chosen').find('.selectize-input').addClass('form-control')

// $('#id_amount').on('keydown', function (e) {
//                var keyCode = e.keyCode || e.which;
//                if (keyCode == 9) {
//                    e.preventDefault();
//                    $(this).closest('.form-group').find('.finstat__extra-switcher').popover('show');
//                }
//            });

// $('.finstat__submit-icon').click(function () {
//                $.post('/finstat/api/transactions/list', $('form#finstat__form-edit-transaction').serialize(), function (data) {
//                    console.dir(this);
//                });
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
//            require(["datepicker"], function () {
//                 $('.ext__air-datepicker').datepicker({
//                    'class': "datepicker-here",
//                    'dateFormat': 'yyyy-mm-dd'
//                });
//            });


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