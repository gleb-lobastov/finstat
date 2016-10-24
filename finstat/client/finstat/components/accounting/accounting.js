define([
   "jquery",
   "backbone",
   "moment",
   'text!./resources/accounting.html',
   'text!./resources/row-accounting.html',
   'unit!finstat/components/annotations'
], function ($, Backbone, moment, pageTpl, rowTpl, annotations) {

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
//      parse: function (response) {
//      },
      comparator: function (model) {
         return -model.get('date');
      }
   });

   var ViewAccounting = Backbone.View.extend({
      initialize: function () {
         this.ids = [21, 22];
         this.template = _.template(pageTpl);
         this.rowTemplate = _.template(rowTpl);
         this.collection = new Accounts();
         this.collection.fetch({ data: $.param({ id: this.ids}) });
         this.listenTo(this.collection, 'reset update',this.render.bind(this));
      },
      render: function () {
         $.when(annotations.accounts.fetched).then(function () {
            var
               names = {},
               $table;

            for (var i=0; i<this.ids.length; i++) {
               names[this.ids[i]] = annotations.accounts.getName(this.ids[i]);
            }

            this.$el.empty().append(this.template({names: names}));
            $table = this.$('#finstat__accounting-table tbody');
            this.collection.each(function (model) {
               var data = model.toJSON();
               data.spread = data.spread.map(function (value) {
                  return value.toLocaleString('ru', {currency: 'RUB', style: 'currency'});
               });
               $table.append(this.rowTemplate(_.extend(
                  data
               )));
            }, this);

         }.bind(this));
         return this;
      }
   });
   return {ViewAccounting: ViewAccounting};
});