define([
   'backbone',
   'underscore',
   'moment',
   'finstat/single/collections',
   'text!finstat/interval/transaction.html',
   'text!finstat/interval/header.html',
   'text!finstat/interval/addRow.html',
   'text!finstat/interval/form.html',
   'finstat/defaults'
], function (Backbone, _, moment, single, transactionTpl, headerTpl, addRow, formTpl, finstatDefaults) {
   var deps;

   var Transaction = Backbone.Model.extend({
      _alwaysNew: false,
      defaults: {
         amount: 10,
         date: new Date().toISOString().substr(0, 10),
         account_from: null,
         account_to: null
      },
      urlRoot: 'api/transactions',
      initialize: function (attributes, options) {
         this._alwaysNew = options && options.alwaysNew;
      },
      isNew: function () {
         return this._alwaysNew || Backbone.Model.prototype.isNew.call(this);
      },
      create: function (data) {
         this.set(data);
         this.save();
      },
      resolveAttributes: function () {
         var
            values = this.toJSON(),
            resolved = {};
         switch (values.transaction_type) {
            case single.consts.TT_INCOME:
               resolved.rowClass = 'finstat__bar-income';
               break;
            case single.consts.TT_OUTCOME:
               resolved.rowClass = 'finstat__bar-outcome';
               break;
            default:
               resolved.rowClass = '';
         }
         resolved.account_from = single.accounts.getName(values.fk_account_from);
         resolved.account_to = single.accounts.getName(values.fk_account_to);
         resolved.category = single.categories.getName(values.fk_category);
         resolved.id = values.id;
         resolved.amount = values.amount;
         resolved.comment = values.comment;
         return resolved;
      },
      sign: function () {
         var transactionType = this.get('transaction_type');
         if (transactionType === single.consts.TT_INCOME) {
            return +1;
         } else if (transactionType === single.consts.TT_OUTCOME) {
            return -1
         } else {
            return 0
         }
      },
      delta: function () {
         return this.sign() * (this.previous('amount') - this.get('amount'));
      },
      cases: function (returnIfIncome, returnIfOutcome, returnElse) {
         var sign = this.sign();
         return sign ? (sign > 0 ? returnIfIncome : returnIfOutcome) : returnElse;
      }
   });

   var Transactions = Backbone.Collection.extend({
      url: 'api/transactions',
      comparator: function (collection) {
         return -collection.get('id');
      },
      initialize: function () {
      },
      calcAmount: function (transaction_type) {
         return this.reduce(function (total, currentItem) {
            var matches = !transaction_type || currentItem.get('transaction_type') === transaction_type;
            return total + (matches ? +currentItem.get('amount') : 0);
         }, 0);
      },
      calcIncome: function () {
         return this.calcAmount(single.consts.TT_INCOME)
      },
      calcOutcome: function () {
         return this.calcAmount(single.consts.TT_OUTCOME)
      }
   });

   var TransactionView = Backbone.View.extend({
      className: "row finstat__show-on-hover_area finstat__highlight-row",
      events: {
         'click .finstat__remove-icon': "destroy"
      },
      template: _.template(transactionTpl),
      dateSplitterTpl: _.template(headerTpl),
      render: function () {
         this.$el.html(this.template(this.model.resolveAttributes()));
         deps.turnEditable.call(this);
         return this;
      },
      destroy: function () {
         this.model.destroy();
         this.remove();
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

   var TransactionFormView = Backbone.View.extend({
      className: "form-inline",
      events: {
         'click .finstat__submit-icon': 'submit'
      },
      id: 'finstat__form-edit-transaction',
      model: Transaction,
      tagName: 'form',
      template: _.template(formTpl),
      initialize: function () {
      },
      render: function () {
         this.$el.html(this.template({
            amount: 100,
            date: (new Date()).toISOString().substring(0, 10)
         }));
         return this;
      },
      collectFormData: function () {
         return $('#finstat__form-edit-transaction').serializeArray().reduce(
            function (attributes, item) {
               attributes[item.name] = item.value;
               return attributes;
            }, {}
         );
      },
      submit: function () {
         this.model.create(this.collectFormData());
      }
   });


   var Interval = Backbone.Model.extend({
      defaults: {
         income: 0,
         outcome: 0,
         date: null,
         transactions: undefined
      },
      initialize: function () {
         this.set('income', this.get('transactions').calcIncome());
         this.set('outcome', this.get('transactions').calcOutcome());
         this.listenTo(this.get('transactions'), 'change:amount', this.recalculate)
         this.listenTo(this.get('transactions'), 'remove', this.subtract)
      },
      recalculate: function (transactionModel) {
         var affectedParam = transactionModel.cases('income', 'outcome');
         if (affectedParam) {
            this.set(affectedParam, this.get(affectedParam) + transactionModel.delta());
         }
         this.trigger('recalculated:amount');
      },
      subtract: function (transactionModel) {
         var affectedParam = transactionModel.cases('income', 'outcome');
         if (affectedParam) {
            this.set(affectedParam, this.get(affectedParam) - transactionModel.get('amount'));
         }
         this.trigger('recalculated:amount');
      }
   });

   var Intervals = Backbone.Collection.extend({
      model: Interval,
      url: 'api/transactions',
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
      }
   });

   var IntervalHeaderView = Backbone.View.extend({
      className: "row finstat__tall-row finstat__highlight-row",
      model: Interval,
      template: _.template(headerTpl),
      initialize: function () {
         this.listenTo(this.model, 'recalculated:amount', this.updateStats);
      },
      render: function () {
         this.$el.html(this.template({date: this.model.get('date')}));
         this.updateStats();
         return this;
      },
      updateStats: function () {
         this.$('.finstat__bar-income').text(this.model.get('income'));
         this.$('.finstat__bar-outcome').text(this.model.get('outcome'));
      }
   });

   var IntervalsView = Backbone.View.extend({
      events: {
         'click .finstat__add-icon': 'showForm'
      },
      template: _.template(addRow),
      url: 'api/transactions',
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
         this.$el.html(this.template());
         this.collection.each(function (interval) {
            var intervalHeaderView = new IntervalHeaderView({model: interval});
            var transactionsView = new TransactionsView({
               collection: interval.get('transactions')
            });
            this.$el.append(intervalHeaderView.render().el);
            this.$el.append(transactionsView.render().el);
         }, this);
         this.trigger('rendered');
         return this;
      },
      showForm: function () {
         this.$('.finstat__add-icon').hide();
         var form = new TransactionFormView({
            model: new Transaction({}, {alwaysNew: true})
         }).render();
         this.listenTo(form.model, 'sync', this.insertNewItem);
         this.$el.prepend(form.el);
      },
      insertNewItem: function (transactionFormModel) {
         var transactionsCollection = this.getByDate(transactionFormModel.get('date'));
         transactionFormModel.set(
            'transaction_type',
            single.accounts.getOperationType(
               transactionFormModel.get('fk_account_from'),
               transactionFormModel.get('fk_account_to')
            ));

         if (transactionsCollection) {
            transactionsCollection.get('transactions').add(transactionFormModel.clone());
         }
      },
      getByDate: function (date) {
         return this.collection.find(function (interval) {
            return interval.get('date') === date;
         })
      }
   });
   return {
      init: function (dependencies) {
         deps = dependencies;
      },
      IntervalsView: IntervalsView
   };
});