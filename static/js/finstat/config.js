// Точка входа приложения finstat
require(["../main"], function (document) {
    // Чтобы резолвить зависимости сначала подгружаем конфиг requirejs.
    // Для корректной работы angular нужно что-бы DOM был уже загружен
    require(["jquery", "finstat/helpers", "bootstrap", "selectize"], function($, helpers) {
        $(document).ready(function () {

            // $('.ext__chosen').selectize();
            // $('.ext__chosen').find('.selectize-input').addClass('form-control')

            $('#id_amount').on('keydown', function(e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 9) {
                    e.preventDefault();
                    $(this).closest('.form-group').find('.finstat__extra-switcher').popover('show');
                }
            });

            // $('.finstat__extra-switcher').popover({
//                placement: 'bottom',
//                 content: $('#finstat__extra-popup-tpl').html(),
//                html: true
//            }).on('shown.bs.popover', function () {
//                 $('.ext__chosen').selectize();
//            });

            require(["datepicker"], function () {
                $('.ext__air-datepicker').datepicker({'class': "datepicker-here"});
            });

            require(['bootstrap-editable', 'addon/x-editable/transactionXFields'], function () {
                $.fn.editable.defaults.ajaxOptions = {
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("X-CSRFToken", helpers.getCookie('csrftoken'));
                    }
                };    

                $('.ext__editable-for-insert').editable();

                $('.ext__editable-for-update').editable({
                    ajaxOptions: {
                        type: "PUT",
                        beforeSend: $.fn.editable.defaults.ajaxOptions.beforeSend
                    },
                    send: 'always',
                    params: function (params) {
                        var result = {};
                        result[params.name] = params.value;
                        return result;
                    }
                });
            });
            
            require(["jquery.pjax"], function () {
                $(document).pjax('a[data-pjax]', '#finstat__data-container');
            });

            $('.lgv__ajax-form').submit(function () {
                var
                    container = $(this),
                    form = container.find('form');

                $.ajax({
                    data: form.serialize(),
                    type: form.attr('method'),
                    url: form.attr('action'),
                    success: function (response) {
                        container.html(response);
                    }
                });
                return false;
            });
        });
    });
});