define([
   'backbone',
   'moment',
   'unit!finstat/components/annotations',
   'finstat/misc/tools',
   './resources/models',
   './resources/form-add-transaction',
   'text!./resources/row-transaction.html',
   'text!./resources/interval-header.html',
   'css!./resources/row-transaction'
], function (Backbone, moment, annotations, tools, models, TransactionFormView, transactionTpl, headerTpl) {
   var detailsFetched = $.when(annotations.accounts.fetched, annotations.categories.fetched);

   var TransactionView = Backbone.View.extend({
      className: "row finstat__show-on-hover_area finstat__highlight-row",
      events: {
         'click .finstat__remove-icon': "destroy",
         'click #finstat__form-category-filler': "fillCategory"
      },
      template: _.template(transactionTpl),
      dateSplitterTpl: _.template(headerTpl),
      render: function () {
         this.$el.html(this.template(this.model.resolveAttributes()));
         return this;
      },
      destroy: function () {
         this.model.destroy();
         this.remove();
      },
      fillCategory: function () {
         this.$el.trigger('clicked:categoryFiller', this);
      }
   });

   var TransactionsView = Backbone.View.extend({
      initialize: function () {
         var self = this;
         this.collection.on('add', function (model) {
            self.createElement.call(self, model)
         });
      },
      render: function () {
         this.collection.each(function (transaction) {
            var transactionView = new TransactionView({
               model: transaction,
               header: this.header
            });
            this.$el.append(transactionView.render().el);
         }, this);
         return this;
      },
      createElement: function (transaction) {
         var transactionView = new TransactionView({
            model: transaction
         });
         this.$el.prepend(transactionView.render().el);
      }
   });

   var IntervalHeaderView = Backbone.View.extend({
      className: "row finstat__tall-row finstat__highlight-row",
      model: models.Interval,
      template: _.template(headerTpl),
      initialize: function () {
         this.listenTo(this.model, 'recalculated:amount', this.updateStats);
      },
      render: function () {
         this.$el.html(this.template({dateStr: this.model.get('dateMoment').format('DD MMMM YYYY')}));
         this.updateStats();
         return this;
      },
      updateStats: function () {
         var
            income = this.model.get('income'),
            outcome = this.model.get('outcome');
         this.$('.finstat__bar-income').toggle(!!income).text(income);
         this.$('.finstat__bar-outcome').toggle(!!outcome).text(outcome);
         this.$('.finstat__bar-no_changes').toggle(!income && !outcome);
      }
   });

   var IntervalView = Backbone.View.extend({
      events: {
         'click .finstat__interval-date': 'clickOnDate'
      },
      render: function () {
         var intervalHeaderView = new IntervalHeaderView({model: this.model});
         var transactionsView = new TransactionsView({
            collection: this.model.get('transactions')
         });
         this.$el.append(intervalHeaderView.render().el);
         this.$el.append(transactionsView.render().el);
         return this;
      },
      clickOnDate: function () {
         this.$el.trigger('clicked:date', this);
      }
   });

   var IntervalsView = Backbone.View.extend(_.extend({}, tools.PluginsMixin, {
      editableLegacy: undefined,
      editableLegacyConfig: {
         '.finstat__element-amount, .finstat__element-comment': {
            mode: 'update'
         },
         '.finstat__element-category': {
            mode: 'update',
            annotations: annotations.categories
         },
         '.finstat__element-account': {
            mode: 'update',
            annotations: annotations.accounts
         }
      },
      url: 'api/transactions',
      initialize: function (options) {
         this.initPlugins(options.plugins, ['editableLegacy']);
         this.listenTo(this.collection, 'reset update', function () {
            $.when(detailsFetched).then(this.render.bind(this))
         });
         this.collection.fetch();
      },
      render: function () {
         this.$el.empty();
         this.collection.each(function (model) {
            var intervalView = new IntervalView({model: model});
            this.$el.append(intervalView.render().$el);
         }, this);
         this.trigger('rendered');
         return this;
      }
   }));

   var TransactionsListView = Backbone.View.extend({
      events: {
         'clicked:date': function (jqEvent, intervalHeader) {
            this.form.model.set('date', intervalHeader.model.get('dateMoment').format("YYYY-MM-DD"));
         },
         'clicked:categoryFiller': function (jqEvent, interval) {
            this.form.model.set('fk_category', interval.model.get('fk_category'));
         }
      },
      initialize: function (options) {
         options = options || {};
         options.collection = new models.Intervals();
         this.intervalsView = new IntervalsView(options);
         this.form = new TransactionFormView(options);
      },
      render: function () {
         this.$el.empty().append(this.form.render().$el).append(this.intervalsView.$el);
         return this;
      }
   });

   return TransactionsListView;
});