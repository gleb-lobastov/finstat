define([
   'backbone',
   'underscore',
   'moment',
   'finstat/single/collections',
   'text!finstat/interval/transaction.html',
   'text!finstat/interval/header.html',
   'text!finstat/interval/addRow.html',
   'text!finstat/interval/form.html',
   'finstat/defaults',
], function (Backbone, _, moment, single, transactionTpl, headerTpl, addRow, formTpl, finstatDefaults) {
   var deps;

   var Transaction = Backbone.Model.extend({
      url: 'api/transactions',
      initialize: function () {
         this.on('change', function () {
            if (this.income > 0) {
               this.set('income', +this.get('amount'), {slient: true})
            } else {
               this.set('outcome', +this.get('amount'), {slient: true})
            }
         }, this)
      },
      defaults: {
         amount: 10,
         date: new Date().toISOString().substr(0, 10),
         account_from: null,
         account_to: null
      }
   });

   var Transactions = Backbone.Collection.extend({
      calcIncome: function () {
         return this.reduce(function (total, currentItem) {
            return total + (
                  currentItem.get('transaction_type') === single.consts.TT_INCOME ? currentItem.get('amount') : 0
               );
         }, 0);
      },
      calcOutcome: function () {
         return this.reduce(function (total, currentItem) {
            return total + (
                  currentItem.get('transaction_type') === single.consts.TT_OUTCOME ? currentItem.get('amount') : 0
               );
         }, 0);
      }
   });

   var Interval = Backbone.Model.extend({});

   var Intervals = Backbone.Collection.extend({
      url: finstatDefaults.endpoints.transactions,
      model: Interval,
      dates: {},
      parse: function (response) {
         var dates = [],
            currentDate = null,
            currentTransactions = [],
            thisTransaction;

         for (var i = 0; i < response.results.length; i++) {
            thisTransaction = response.results[i];
            if (currentDate != thisTransaction.date) {
               if (currentDate) {
                  dates.push({
                     date: currentDate,
                     transactions: new Transactions(currentTransactions)
                  });
               }
               currentDate = thisTransaction.date;
               currentTransactions = [];
            }
            currentTransactions.push(new Transaction(thisTransaction));
         }
         return dates;
      },
      initialize: function () {
      }
   });

   var TransactionView = Backbone.View.extend({
      className: "row",
      template: _.template(transactionTpl),
      dateSplitterTpl: _.template(headerTpl),
      initialize: function (options) {
         this.model.bind('change', options.header.render, options.header);
      },
      render: function () {
         var
            values = this.model.toJSON();
         switch (values.transaction_type) {
            case single.consts.TT_INCOME:
               values.rowClass = 'finstat__bar-income';
               break;
            case single.consts.TT_OUTCOME:
               values.rowClass = 'finstat__bar-outcome';
               break;
            default:
               values.rowClass = '';
         }
         values.account_from = single.accounts.getName(values.fk_account_from);
         values.account_to = single.accounts.getName(values.fk_account_to);
         values.category = single.categories.getName(values.fk_category);
         this.$el.html(this.template(values));
         deps.turnEditable.call(this);
         return this;
      }
   });

   var TransactionsView = Backbone.View.extend({
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
      className: "row finstat__tall-row",
      template: _.template(headerTpl),
      render: function () {
         var
            params = this.model.toJSON(),
            income = params.transactions.calcIncome(),
            outcome = params.transactions.calcOutcome();
         this.$el.html(this.template({
            date: params.date,
            income: income ? '+' + income : '',
            outcome: outcome || ''
         }));
         return this;
      }
   });

   var TransactionFormView = Backbone.View.extend({
      tagName: 'form',
      id: 'finstat__form-edit-transaction',
      className: "form-inline",
      template: _.template(formTpl),
      initialize: function () {
         this.$el.attr({
            action: "/finstat/api/transactions/list",
            method: "post"
         })
      },
      render: function () {
         var self = this;
         this.$el.html(this.template({
            amount: 100,
            date: (new Date()).toISOString().substring(0, 10)
         })).find('.finstat__submit-icon').click(function () {
            self.model.save();
         });
         return this;
      }
   });

   var IntervalsView = Backbone.View.extend({
      url: 'api/transactions',
      addRowTemplate: _.template(addRow),
      initialize: function () {
         var self = this;
         if (!this.collection) {
            this.collection = new Intervals();
         }
         this.collection.fetch({
            success: function () {
               var
                  waitFor = [single.accounts, single.categories],
                  renderAfterFetch = _.after(waitFor.length, self.render.bind(self));
               _.each(waitFor, function (collection) {
                  if (collection.fetched) {
                     renderAfterFetch();
                  } else {
                     self.listenToOnce(collection, 'sync', renderAfterFetch);
                  }
               });
            }
         });
      },
      render: function () {
         var intervalsView = this;
         this.$el.html(this.addRowTemplate()).find('.finstat__add-icon').click(function () {
            $(this).hide();
            var form = new TransactionFormView({
               model: new Transaction()
            }).render();
            intervalsView.$el.prepend(form.el);
         });
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
});