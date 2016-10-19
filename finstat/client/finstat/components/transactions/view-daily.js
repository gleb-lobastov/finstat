define([
   'backbone',
   './resources/models',
   'text!./resources/row-daily.html',
   'css!./resources/row-transaction'
], function (Backbone, models, rowDailyTpl) {
   var templates = {
      daily: rowDailyTpl
   };

   var AggregateView = Backbone.View.extend({
      tagName: 'tbody',
      initialize: function (options) {
         var interval = options && options.interval;
         this.template = _.template(templates[interval]);
         this.collection.fetch();
         this.listenTo(this.collection, 'reset update', this.render)
      },
      template: undefined,
      render: function () {
         this.$el.empty();
         this.collection.each(function (model) {
            this.$el.append(this.template(model.toJSON()));
         }, this);
         return this;
      }
   });

   var ViewDaily = Backbone.View.extend({
      tagName: 'table',
      className: 'finstat__agg-table',
      initialize: function () {
         this.aggregateView = new AggregateView({
            interval: 'daily',
            collection: new models.Aggregates({
               interval: 'daily'
            })
         });
      },
      render: function () {
         this.$el.empty().append(this.aggregateView.$el);
         return this;
      }
   });

   return ViewDaily;
});