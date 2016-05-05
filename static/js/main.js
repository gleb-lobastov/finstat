requirejs.config({
    baseUrl: '/static/dev/js/vendor',
    paths: {
        finstat: '../../js/finstat'
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
        }
    }
});