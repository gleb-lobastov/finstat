requirejs.config({
   baseUrl: '/static/js/vendor',
   paths: {
      styles: '../../styles/vendor',
      finstat: '../../finstat/js',
      addon: '../../components/addons',
      typeahead: './typeahead.jquery'
   },
   shim: {
      'moment': {
         deps: []
      },
      'bootstrap': {
         deps: ['jquery']
      },
//      'bootstrap-datepicker': {
//         deps: ['bootstrap', 'jquery']
//      },
      'underscore': {
         exports: '_'
      },
//      'jquery.pjax': {
//         deps: ['jquery']
//      },
      'datepicker': {
         deps: ['jquery', 'css!styles/datepicker']
      },
      'bootstrap-editable': {
         deps: ['bootstrap', 'jquery']
      },
//      'typeahead': {
//         deps: ['jquery'],
//         init: function ($) {
//            return require.s.contexts._.registry['typeahead.js'].factory($);
//         }
//      },
      'backbone': {
         deps: ['underscore']
      }
   }
});