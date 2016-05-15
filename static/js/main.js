requirejs.config({
    baseUrl: '/static/dev/js/vendor',
    paths: {
        finstat: '../../../js/finstat',
        addon: '../../../components/addons'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
        'bootstrap-datepicker': {
            deps: ['bootstrap', 'jquery']
        },
        'underscore': {
            exports: '_'
        },
        'angular': {
            exports: 'angular'
        },
        'jquery.pjax': {
            deps: ['jquery']
        },
        'datepicker': {
            deps: ['jquery']
        },
        'bootstrap-editable': {
            deps: ['bootstrap', 'jquery']
        }
    }
});