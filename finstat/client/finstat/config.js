requirejs.config({
   baseUrl: '/static/vendor',
   paths: {
      finstat: '../finstat',
      unit: '../finstat/extensions/require-unit-plugin'
   },
   shim: {
      'moment': {
         deps: []
      },
      'bootstrap': {
         deps: ['jquery', 'css!bootstrap']
      },
      'underscore': {
         exports: '_'
      },
      'datepicker': {
         deps: ['jquery', 'css!datepicker']
      },
      'bootstrap-editable': {
         deps: ['bootstrap', 'jquery']
      },
      'backbone': {
         deps: ['underscore']
      }
   }
});