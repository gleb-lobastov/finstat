define(['backbone', 'finstat/defaults'], function (Backbone, defs) {
    var Accounts = Backbone.Model.extend({
        defaults: {
            account_name: defs.account,
            account_type: defs.account_type,
            comment: "",
            currency: defs.currency,
            fk_owner: defs.owner,
            initial_amount: 0
        }
    });

    var AccountsCollection = Backbone.Collection.extend({
        url: defs.endpoints.accounts,
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
        
        getName: function(id) {
            var model = this.get(id);
            return model ? model.get('account_name') : undefined;
        }
    });

    return AccountsCollection
});