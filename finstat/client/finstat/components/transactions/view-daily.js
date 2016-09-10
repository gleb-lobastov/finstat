define([
   'backbone'
], function (Backbone) {
   var ViewDaily = Backbone.View.extend({
      initialize: function (options) {
         options.collection = new models.Intervals();
         this.intervalsView = new IntervalsView(options);
         this.form = new TransactionFormView(options);
      },
      render: function () {
         this.$el.empty().append(this.form.render().$el).append(this.intervalsView.$el);
         return this;
      }
   });
   return ViewDaily;
});