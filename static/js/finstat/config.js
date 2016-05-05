require(["../main"], function () {
    require(["jquery", "jquery.pjax", "bootstrap"], function($) {
        $(document).ready(function () {

            $(document).pjax('a[data-pjax]', '#finstat__data-container');

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