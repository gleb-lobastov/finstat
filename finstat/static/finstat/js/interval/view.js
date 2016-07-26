define([
   'backbone',
   'underscore',
   'moment',
   'finstat/single/collections',
   'text!finstat/interval/transaction.html',
   'text!finstat/interval/header.html',
   'text!finstat/interval/form.html',
   'locale/ru'
], function (Backbone, _, moment, single, transactionTpl, headerTpl, formTpl) {
   moment.locale('ru');
   var
      deps,
      details = $.when(single.acccounts, single.categories);

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
      resolveAttributes: function () { // to view and presenter
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
      comparator: function (model) {
         return -model.get('id');
      },
      initialize: function () {
         this.listenTo(this, 'remove', this.checkEmptiness);
      },
      checkEmptiness: function () {
         if (!this.length) {
            this.trigger('empty');
         }
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
      className: "row",
      // collection: Intervals
      events: {
         'click .finstat__add-icon': 'toggleForm',
         'click .finstat__submit-icon': 'submit'
      },
      template: _.template(formTpl),
      expanded: false,
      initialize: function () {
      },
      render: function () {
         this.$el.html(this.template({
            amount: 100,
            date: (new Date()).toISOString().substring(0, 10)
         }));
         this.toggleForm(this.expanded);
//         this.delegateEvents(this.events());
         return this;
      },
      toggleForm: function (value) {
         this.expanded = value;
         this.$('.finstat__add-icon').toggle(!value);
         this.$('#finstat__form-edit-transaction').toggle(value);
      },
      submit: function () {
         var transaction = new Transaction(this.collectFormData());
         this.collection.appendTransaction(transaction);
         transaction.save();
      },
      collectFormData: function () {
         return this.$('#finstat__form-edit-transaction').serializeArray().reduce(
            function (attributes, item) {
               attributes[item.name] = item.value;
               return attributes;
            }, {}
         );
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
         this.listenTo(this.get('transactions'), 'change:amount', this.delta);
         this.listenTo(this.get('transactions'), 'add', this.append);
         this.listenTo(this.get('transactions'), 'remove', this.subtract);
         this.listenTo(this.get('transactions'), 'empty', this.destroy);
      },
      recalculate: function (transaction, delta) {
         var affectedParam = transaction.cases('income', 'outcome');
         if (affectedParam) {
            this.set(affectedParam, this.get(affectedParam) + delta);
         }
         this.trigger('recalculated:amount');
      },
      delta: function (transaction) {
         this.recalculate(transaction, transaction.delta());
      },
      append: function (transaction) {
         this.recalculate(transaction, +transaction.get('amount'));
      },
      subtract: function (transaction) {
         this.recalculate(transaction, -transaction.get('amount'));
      }
   });

   var Intervals = Backbone.Collection.extend({
      model: Interval,
      url: 'api/transactions',
      initialize: function () {
      },
      comparator: function (model) {
         return -model.get('date');
      },
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
                     date: moment(currentDate),
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
      appendTransaction: function (transaction) {
         var
            date = moment(transaction.get('date')),
            interval = this.getByDate(date);

         if (!interval && this.isDateInDisplayedInterval(date)) {
            interval = new Interval({
               date: date,
               transactions: new Transactions([])
            });
            this.add(interval, {consecutive: false});
         }
         if (interval) {
            transaction.set(
               'transaction_type',
               single.accounts.getOperationType(
                  transaction.get('fk_account_from'),
                  transaction.get('fk_account_to')
               ));
            interval.get('transactions').add(transaction);
         }
      },
      getByDate: function (date) {
         return this.find(function (interval) {
            return interval.get('date').isSame(date, 'day');
         })
      },
      isDateInDisplayedInterval: function (date) {
         function getDate(model) {
            return model.get('date');
         }

         var page = 1;
         return (
            date >= getDate(this.min(getDate)) ||
            page >= 1 && date <= getDate(this.max(getDate))
         );
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
         this.$el.html(this.template({date: this.model.get('date').format('DD MMMM YYYY')}));
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
      render: function () {
         var intervalHeaderView = new IntervalHeaderView({model: this.model});
         var transactionsView = new TransactionsView({
            collection: this.model.get('transactions')
         });
         this.$el.append(intervalHeaderView.render().el);
         this.$el.append(transactionsView.render().el);
         return this;
      }
   });

   var IntervalsView = Backbone.View.extend({
      formTemplate: _.template(formTpl),
      url: 'api/transactions',
      initialize: function () {
         this.listenTo(this.collection, 'reset update', function () {
            $.when(
               single.accounts.fetched,
               single.categories.fetched
            ).then(this.render.bind(this))
         });
         this.collection.fetch();
      },
      render: function () {
         this.$el.empty();
         this.collection.each(function (model) {
            var intervalView = new IntervalView({model: model});
            this.$el.append(intervalView.render().$el);
         }, this);
         return this;
      }
   });

   /* Список транзакций. Состоит из формы добавления транзакции и списка интервалов */
   var TransactionsListView = Backbone.View.extend({
      initialize: function () {
         var intervals = new Intervals();
         this.intervalsView = new IntervalsView({collection: intervals});
         this.form = new TransactionFormView({collection: intervals});
      },
      render: function () {
         this.$el.empty().
            append(this.form.render().$el).
            append(this.intervalsView.$el); // рендер по событию
         return this;
      }
   });

   return {
      init: function (dependencies) {
         deps = dependencies;
      },
      View: TransactionsListView
   };
});