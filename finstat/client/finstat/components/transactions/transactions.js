define([
   'backbone',
   './resources/models',
   './view-each',
   'text!./resources/row-daily.html',
   'text!./resources/row-monthly.html',
   'text!./resources/row-annual.html'
], function (Backbone, models, ViewEach, rowDailyTpl, rowMonthlyTpl, rowAnnualTpl) {
   var templates = {
      daily: rowDailyTpl,
      monthly: rowMonthlyTpl,
      annual: rowAnnualTpl
   };

   var AggregateView = Backbone.View.extend({
      tagName: 'table',
      className: 'finstat__agg-table',
      initialize: function () {
         this.template = _.template(templates[this.interval]);
         this.collection = new models.Aggregates(null, {
            interval: this.interval
         });
         this.collection.fetch();
         this.listenTo(this.collection, 'reset update', this.render)
      },
      interval: undefined,
      template: undefined,
      render: function () {
         var $tableBody = $('<tbody>').appendTo(this.$el.empty());
         this.collection.each(function (model) {
            $tableBody.append(this.template(model.toJSON()));
         }, this);
         return this;
      }
   });

   var ViewDaily = AggregateView.extend({
      interval: 'daily'
   });

   var ViewMonthly = AggregateView.extend({
      interval: 'monthly'
   });

   var ViewAnnual = AggregateView.extend({
      interval: 'annual'
   });

   return {
      ViewAnnual: ViewAnnual,
      ViewMonthly: ViewMonthly,
      ViewDaily: ViewDaily,
      ViewEach: ViewEach
   };
});