define([
   "backbone",
   "moment",
   'text!./resources/row-accounting.html'
], function (Backbone, moment, rowTpl) {

   "use strict";

   var Account = Backbone.Model.extend({
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
            }
         },
         "required": [
            "date"
         ]
      },
      defaults: {
         date: moment().format('YYYY-MM-DD'),
         spread: {}
      }
   });

   var Accounts = Backbone.Collection.extend({
      url: 'api/accounting',
      parse: function (response) {
      },
      comparator: function (model) {
         return -model.get('date');
      }
   });

   var ViewAccounting = Backbone.View.extend({
      tagName: 'tbody',
      initialize: function () {
         this.template = _.template(rowTpl);
         this.collection = new Accounts();
         this.collection.fetch({ data: $.param({ id: [21, 22]}) });
         this.listenTo(this.collection, 'reset update', this.render)
      },
      render: function () {
         this.$el.empty();
         this.collection.each(function (model) {
            this.$el.append(this.template(model.toJSON()));
         }, this);
         return this;
      }
   });
   return {ViewAccounting: ViewAccounting};
});