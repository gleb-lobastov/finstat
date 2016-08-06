define(['backbone'], function (Backbone) {
   // singleton
   var consts = {
      TT_INCOME: 1,
      TT_OUTCOME: 2,
      TT_MOVE_OWN: 3,
      TT_MOVE_OTHER: 4,
      TT_UNDEFINED: 5
   };
   
   var AnnotationsCollection = Backbone.Collection.extend({
      keyField: 'id',
      fetched: false,
      annotationField: undefined,
      /* Метод не связан с AnnotationsCollection, но общий для наследников. PromisedCollection*/
      initialize: function () {
         this.fetched = this.fetch()
      },
      toObject: function () {
         return this.reduce(function (memo, model) {
            memo[model.get(this.keyField)] = model.get(this.annotationField);
            return memo;
         }, {}, this);
      },
      getName: function (id) {
         var model = this.get(id);
         return model ? model.get(this.annotationField) : undefined;
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

         if (isFromOwn === undefined || isToOwn === undefined) {
            return consts.TT_UNDEFINED;
         }
         if (isFromOwn) {
            return isToOwn ? consts.TT_MOVE_OWN : consts.TT_OUTCOME;
         } else {
            return isToOwn ? consts.TT_INCOME : consts.TT_MOVE_OTHER;
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
      categories: new CategoriesCollection(),
      consts: consts
   }
});