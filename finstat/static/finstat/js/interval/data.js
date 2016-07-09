define(['backbone', 'finstat/defaults'], function (Backbone, finstatDefaults) {

   var Transaction = Backbone.Model.extend({
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
         amount: 0,
         date: new Date(),
         account_from: null,
         account_to: null
      }
   });

   var Transactions = Backbone.Collection.extend({
      calcIncome: function () {
         return this.reduce(function (total, currentItem) {
            return total + currentItem.get('income');
         }, 0);
      },
      calcOutcome: function () {
         return this.reduce(function (total, currentItem) {
            return total + currentItem.get('outcome');
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

   return {
      Model: Interval,
      Collection: Intervals
   }
});