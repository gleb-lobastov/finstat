define([
   "jquery",
   "backbone"
], function ($, Backbone) {
   $.fn.extend({
      navigable: function () {
         return this.on("click", "a[data-nav]", function (event) {
            var href = $(this).attr("href");
            if (href) {
               event.preventDefault();
               if (href != Backbone.history.getPath()) {
                  Backbone.history.navigate(href, true);
               }
            }
         });
      }
   });
});