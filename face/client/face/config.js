requirejs.config({
    baseUrl: '/static/dev/js/vendor',
    paths: {
        styles: '../../styles/vendor'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        }
    }
});