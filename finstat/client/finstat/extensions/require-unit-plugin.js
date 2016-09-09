(function () {

    function update(name) {
       return name + '/' + name.split('/').slice(-1);
    }

    define({
        load: function (name, req, onload, config) {
            req([update(name)], function (value) {
                onload(value);
            });
        }
    });

}());