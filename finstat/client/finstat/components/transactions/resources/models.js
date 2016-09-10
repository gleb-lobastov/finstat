define([
   'backbone',
   'moment',
   'finstat/components/single/collections'
], function (Backbone, moment, single) {

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
         amount: undefined,
         comment: '',
         fk_category: null,
         fk_account_from: null,
         fk_account_to: null,
         fk_place: null,
         fk_company: null
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
            values = this.toJSON();
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
         values.amount = values.amount || this.defaults.amount;
         values.comment = values.comment || this.defaults.comment;
         values.id = this.id;
         return values;
      },
      sign: function () {
         var transactionType =
            this.get('transaction_type') ||
            single.accounts.getOperationType(this.get('fk_account_from'), this.get('fk_account_to'));
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
      getTransactionById: function (id) {
         var interval = this.find(function (interval) {
            return interval.get('transactions').get(id);
         });
         return interval.get('transactions').get(id);
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

   return {
      Transaction: Transaction,
      Transactions: Transactions,
      Interval: Interval,
      Intervals: Intervals
   };
});