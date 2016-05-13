// Точка входа приложения finstat
require(["../main"], function (document) {
    // Чтобы резолвить зависимости сначала подгружаем конфиг requirejs.
    // Для корректной работы angular нужно что-бы DOM был уже загружен
    require(["jquery", "bootstrap", "selectize"], function($) {
        $(document).ready(function () {

            $('.ext__chosen').selectize();
            $('.ext__chosen').find('.selectize-input').addClass('form-control')

            require(["datepicker"], function () {
                $('.ext__air-datepicker').datepicker({'class': "datepicker-here"});
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