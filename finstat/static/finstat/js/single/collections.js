define(['backbone', 'finstat/defaults'], function (Backbone, defs) {
   // singleton
   var consts = {
      TT_INCOME: 1,
      TT_OUTCOME: 2,
      TT_MOVE_OWN: 3,
      TT_MOVE_OTHER: 4,
      TT_UNDEFINED: 5
   };

   var Accounts = Backbone.Model.extend({});

   var AccountsCollection = Backbone.Collection.extend({
      url: 'api/accounts',
      model: Accounts,
      parse: function (response) {
         return response.results;
      },
      initialize: function () {
         var self = this;
         self.fetch({
            success: function () {
               self.fetched = true
            }
         });
      },

      getName: function (id) {
         var model = this.get(id);
         return model ? model.get('account_name') : undefined;
      },

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

   var Categories = Backbone.Model.extend({});

   var CategoriesCollection = Backbone.Collection.extend({
      url: 'api/categories',
      model: Categories,
      parse: function (response) {
         return response.results;
      },
      initialize: function () {
         var self = this;
         self.fetch({
            success: function () {
               self.fetched = true
            }
         });
      },

      getName: function (id) {
         var model = this.get(id);
         return model ? model.get('category_name') : undefined;
      }
   });

   return {
      accounts: new AccountsCollection(),
      categories: new CategoriesCollection(),
      consts: consts
   }
});