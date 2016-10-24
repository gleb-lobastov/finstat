define([
   "backbone",
   "finstat/core"
], function (Backbone, core) {
   var AnnotationsCollection = Backbone.Collection.extend({
      keyField: 'id',
      fetched: false,
      annotationField: undefined,
      /* Метод не связан с AnnotationsCollection, но общий для наследников. PromisedCollection*/
      initialize: function () {
         this.fetched = this.fetch();
      },
      toObject: function () {
         return this.reduce(function (memo, model) {
            memo[model.get(this.keyField)] = model.get(this.annotationField);
            return memo;
         }, {}, this);
      },
      getName: function (id) {
         var model = this.get(id);
         return model ? model.get(this.annotationField) : '';
      }
   });

   var Accounts = Backbone.Model.extend({
      urlRoot: 'api/accounts'
   });
   
   var AccountsCollection = AnnotationsCollection.extend({
      url: 'api/accounts',
      model: Accounts,
      annotationField: 'account_name',
      getOperationType: function (id_from, id_to) {
         var
            modelFrom = this.get(id_from),
            modelTo = this.get(id_to),
            isFromOwn = modelFrom && modelFrom.get('account_type') === 'OW',
            isToOwn = modelTo && modelTo.get('account_type') === 'OW';

         if (isFromOwn) {
            return isToOwn ? core.enums.TransactionType.moveOwn : core.enums.TransactionType.outcome;
         } else {
            return isToOwn ? core.enums.TransactionType.moveOther : core.enums.TransactionType.income;
         }
      }
   });

   var Categories = Backbone.Model.extend({
      urlRoot: 'api/categories'
   });

   var CategoriesCollection = AnnotationsCollection.extend({
      url: 'api/categories',
      model: Categories,
      annotationField: 'category_name'
   });

   return {
      accounts: new AccountsCollection(),
      categories: new CategoriesCollection()
   }
});