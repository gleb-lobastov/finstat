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
      detailsFetched = $.when(single.accounts.fetched, single.categories.fetched);

   // Models

   var Transaction = Backbone.Model.extend({
      schema: {
         "$schema": "http://json-schema.org/draft-04/schema#",
         "type": "object",
         "title": "Transaction model.",
         "description": "Транзакция описывает один акт перевода денег между счетами.",
         "properties": {
            "amount": {
               "type": "integer",
               "minimum": 0,
               "title": "Сумма перевода."
            },
            "date": {
               "type": "string",
               "format": "date-time",
               "title": "Дата исполнения транзакции."
            },
            "account_from": {
               "type": "integer",
               "multipleOf": 1,
               "minimum": 0,
               "title": "Идентификатор счета списания.",
               "description": "Счет с которого деньги были списаны."
            },
            "account_to": {
               "type": "integer",
               "multipleOf": 1,
               "minimum": 0,
               "title": "Идентификатор счета зачисления.",
               "description": "Счет на которы были зачисленны деньги."
            }
         },
         "required": [
            "amount",
            "date"
         ]
      },
      defaults: {
         date: moment().format('YYYY-MM-DD'),
         amount: undefined
      },
      urlRoot: 'api/transactions',

      _alwaysNew: false,

      initialize: function (attributes, options) {
         this._alwaysNew = options && options.alwaysNew;
      },

      /**
       * Для модейлей с опцией alwaysNew обеспечивает принудительное
       * создание новой записи на сервере при сохранении модели.
       *
       * @override
       * @returns {boolean} Флаг "создавать ли новую запись"
       */
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

   var Interval = Backbone.Model.extend({
      schema: {
         "$schema": "http://json-schema.org/draft-04/schema#",
         "type": "object",
         "title": "Модель интервала транзакций.",
         "description": "В интервале храниться одна и более транзакций. " +
         "Интервал объединяет транзакции относящиеся к одному промежутку времени (по датам).",
         "properties": {
            "dateMoment": {
               "type": "object",
               "title": "Дата начала интервала (объект moment).",
               "description": "Транзакции в интервале должны быть между датой начала и окончания (включительно).",
               "properties": {}
            },
            "endDateMoment": {
               "type": "object",
               "title": "Дата окончания интервала (объект moment.",
               "description": "Если не указана, то принимается равной дате начала. " +
               "Ответственность за неперекрытие интервалов лежит на сервере",
               "properties": {}
            },
            "transactions": {
               "type": "object",
               "title": "Backbone коллекция транзакций.",
               "description": "Коллекция соответствующая модели Transaction.",
               "properties": {}
            }
         },
         "required": [
            "dateMoment",
            "transactions"
         ]
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
         return -model.get('dateMoment');
      },

      /**
       * Преобразует ответ сервера к формута понятному Backbone
       *
       * @param response ответ сервера
       * @returns {Array} массив интервалов
       */
      parse: function (response) {
         var dates = [],
            dateStrSQL = null,
            transactionsOfInterval = [],
            transactionData;

         for (var i = 0; i < response.results.length; i++) {
            transactionData = response.results[i];
            if (dateStrSQL != transactionData.date) {

               // Новая коллекция транзакций создается при смене дат.
               // Подразумевается что список отсортирован по дате.
               if (dateStrSQL) {
                  dates.push({
                     dateMoment: moment(dateStrSQL),
                     transactions: new Transactions(transactionsOfInterval)
                  });
               }
               dateStrSQL = transactionData.date;
               transactionsOfInterval = [];
            }
            transactionsOfInterval.push(new Transaction(transactionData));
         }
         return dates;
      },
      appendTransaction: function (transaction) {
         var
            dateMoment = moment(transaction.get('date')),
            interval = this.getByDate(dateMoment);

         if (!interval && this.isDateInDisplayedInterval(dateMoment)) {
            interval = new Interval({
               dateMoment: dateMoment,
               transactions: new Transactions([])
            });
            this.add(interval);
         }
         if (interval) {

            // Выставляем тип новой транзакции (доход/расход)
            transaction.set(
               'transaction_type',
               single.accounts.getOperationType(
                  transaction.get('fk_account_from'),
                  transaction.get('fk_account_to')
               ));
            interval.get('transactions').add(transaction);
         }
      },
      getByDate: function (dateMoment) {
         return this.find(function (interval) {
            return interval.get('dateMoment').isSame(dateMoment, 'day');
         })
      },
      isDateInDisplayedInterval: function (dateMoment) {
         function getDate(model) {
            return model.get('dateMoment');
         }

         // todo учитывать пагинацию
         var page = 1;
         return (
            dateMoment >= getDate(this.min(getDate)) ||
            page >= 1 && dateMoment <= getDate(this.max(getDate))
         );
      }
   });

   // Views

   var TransactionView = Backbone.View.extend({
      className: "row finstat__show-on-hover_area finstat__highlight-row",
      events: {
         'click .finstat__remove-icon': "destroy"
      },
      template: _.template(transactionTpl),
      dateSplitterTpl: _.template(headerTpl),
      render: function () {
         this.$el.html(this.template(this.model.resolveAttributes()));
         deps.editable.init({
            $target: this.$('.ext__editable-for-update'),
            model: this.model
         });
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

   var AwaitMixin = {
      _storage: {},
      _wait: function (key) {
         if (!this._storage[key]) {
            this._storage[key] = new $.Deferred();
         }
         return this._storage[key];
      },
      wait: function (key) {
         return this._wait(key).promise();
      },
      achieve: function (key, result) {
         var self = this;
         $.when(result).then(function (resolved) {
            self._wait(key).resolve(resolved);
         });
      }
   };

   var TransactionFormView = Backbone.View.extend( 
      _.extend({}, AwaitMixin, {
      className: "row finstat__show-on-hover_area finstat__highlight-row",
      events: {
         'click #finstat__form-submit': 'submit',
         'click #finstat__form-date-dec': 'dateDec',
         'click #finstat__form-date-inc': 'dateInc',
         'change input': 'onUserChange'
      },
      template: _.template(formTpl),
      model: new Transaction(null, {alwaysNew: true}),
      config: {
         datepicker: {
            id: 'date'
         },
         selectable: [{
            id: 'fk_category',
            annotations: 'categories'
         }, {
            id: 'fk_account_from',
            annotations: 'accounts'
         }, {
            id: 'fk_account_to',
            annotations: 'accounts'
         }]
      },
      initialize: function () {
         var self = this;
         this.listenTo(this.model, 'change', this.onChange);
         this.listenTo(this, 'rendered', function () {
            var datepickerAPI = deps.datepicker.init({
               $target: self.$('#id_date'),
               model: self.model
            });
            self.achieve('datepicker', datepickerAPI);
            detailsFetched.then(function () {
               _.map(self.config.selectable, function (itemConfig) {
                  deps.selectable.init({
                     $target: self.$('#id_' + itemConfig.id),
                     canCreate: true,
                     annotations: single[itemConfig.annotations],
                     model: self.model,
                     attribute: itemConfig.id
                  });
               });
            });
         });
      },
      render: function () {
         this.$el.html(this.template(this.model.toJSON()));
         this.trigger('rendered');
         return this;
      },
      //todo убрать в модель и изменить формат времени в модели на moment ( + методы parse и toJSON )
      dateDec: function () {
         this.model.set('date', moment(this.model.get('date')).subtract(1, 'days').format('YYYY-MM-DD'))
      },
      dateInc: function () {
         this.model.set('date', moment(this.model.get('date')).add(1, 'days').format('YYYY-MM-DD'))
      },
      onUserChange: function (jqEvent) {
         console.dir({func: arguments.callee.name, args: arguments, ctx: this});
         var
            $input = $(jqEvent.target),
            updated = {};
         updated[$input.attr('name')] = $input.val();
         this.model.set(updated, {silent: true});
      },
      onChange: function (model, options) {
         var
            self = this,
            changes = this.model.changedAttributes();
         if (changes && 'date' in changes) {
            this.wait('datepicker').then(function (datepicker) {
               datepicker.selectDate(moment(self.model.get('date')).toDate());
            })
         }
      },
      submit: function () {
         var newTransaction = this.model.clone();
         this.collection.appendTransaction(newTransaction);
         newTransaction.save();
      }
   }));

   var IntervalHeaderView = Backbone.View.extend({
      className: "row finstat__tall-row finstat__highlight-row",
      model: Interval,
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
      events: {
         'clicked:date': function (jqEvent, intervalHeader) {
            this.form.model.set('date', intervalHeader.model.get('dateMoment').format("YYYY-MM-DD"));
         }
      },
      initialize: function () {
         var intervals = new Intervals();
         this.intervalsView = new IntervalsView({collection: intervals});
         this.form = new TransactionFormView({collection: intervals});
      },
      render: function () {
         this.$el.empty().append(this.form.render().$el).append(this.intervalsView.$el); // рендер по событию
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