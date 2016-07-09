define([
   'backbone',
   'underscore',
   'finstat/interval/data',
   'text!finstat/interval/transaction.html',
   'text!finstat/interval/header.html',
   'finstat/manager',
   'finstat/defaults',
//   'bootstrap-editable'
], function (Backbone, _, data, transactionTpl, headerTpl, finstatManger, finstatDefaults) {
   var deps;

   var TransactionView = Backbone.View.extend({
      tagName: 'div',
      template: _.template(transactionTpl),
      dateSplitterTpl: _.template(headerTpl),
      initialize: function (options) {
//         _.bindAll(this, "render");
         this.model.bind('change', options.header.render, options.header);
      },
      render: function () {
         var values = this.model.toJSON();
         values.rowClass = values.income > 0 ? finstatDefaults.css.rowIncome : finstatDefaults.css.rowOutcome;
         values.amount = values.income > 0 ? values.income : values.outcome;
         values.account_from = deps.accountsCollection.getName(values.fk_account_from);
         values.account_to = deps.accountsCollection.getName(values.fk_account_to);
         this.$el.html(this.template(values));
         deps.turnEditable.call(this);
         return this;
      }
   });

   var TransactionsView = Backbone.View.extend({
      tagName: 'div',
      initialize: function (options) {
         this.header = options.header;
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
      }
   });

   var IntervalHeaderView = Backbone.View.extend({
      tagName: 'div',
      template: _.template(headerTpl),
      render: function () {
         var params = this.model.toJSON();
         this.$el.html(this.template({
            date: params.date,
            income: params.transactions.calcIncome(),
            outcome: params.transactions.calcOutcome()
         }));
         return this;
      }
   });

   var IntervalsView = Backbone.View.extend({
      tagName: 'div',
      url: 'api/transactions',
      initialize: function () {
         var self = this;
         if (!this.collection) {
            this.collection = new data.Collection();
         }
         this.collection.fetch({
            success: function () {
               if (deps.accountsCollection.fetched) {
                  self.render();
               } else {
                  self.listenToOnce(deps.accountsCollection, 'sync', self.render);
               }
            }
         });
      },
      render: function () {
         this.collection.each(function (interval) {
            var intervalHeaderView = new IntervalHeaderView({model: interval});
            var transactionsView = new TransactionsView({
               collection: interval.get('transactions'),
               header: intervalHeaderView
            });
            this.$el.append(intervalHeaderView.render().el);
            this.$el.append(transactionsView.render().el);
         }, this);
         this.trigger('rendered');
         return this;
      }
   });
   return {
      init: function (dependencies) {
         deps = dependencies;
      },
      IntervalsView: IntervalsView
   };
//      setEditInPlace: function (plugin, config) {
//         
//      },
//      IntervalsView
//   };
});