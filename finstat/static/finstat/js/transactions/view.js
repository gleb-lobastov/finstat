define([
    'backbone',
    'underscore',
    'finstat/transactions/definition',
    'text!finstat/transactions/view.html',
    'text!finstat/transactions/splitter.html',
    'finstat/manager',
    'finstat/defaults'
], function (Backbone, _, Intervals, transactionTpl, intervalTpl, finstatManger, finstatDefaults) {
    var accountsCollection = finstatManger.collections.accounts;

    var TransactionView = Backbone.View.extend({
        tagName: 'div',
        template: _.template(transactionTpl),
        dateSplitterTpl: _.template(intervalTpl),
        render: function () {
            var values = this.model.toJSON();
            values.rowClass = values.income > 0 ? finstatDefaults.css.rowIncome : finstatDefaults.css.rowOutcome;
            values.amount = values.income > 0 ? values.income : values.outcome;
            values.account_from = accountsCollection.getName(values.fk_account_from);
            values.account_to = accountsCollection.getName(values.fk_account_to);
            this.$el.html(this.template(values));
            return this;
        }
    });

    var TransactionsView = Backbone.View.extend({
        tagName: 'div',
        render: function () {
            this.collection.each(function (transaction) {
                var transactionView = new TransactionView({model: transaction});
                this.$el.append(transactionView.render().el);
            }, this);
            return this;
        }
    });

    var IntervalView = Backbone.View.extend({
        tagName: 'div',
        template: _.template(intervalTpl),
        render: function () {
            var params = this.model.toJSON();
            var transactionsView = new TransactionsView({collection: params.transactions});
            this.$el.append(this.template({
                date: params.date,
                income: params.transactions.calcIncome(),
                outcome: params.transactions.calcOutcome()
            }));
            this.$el.append(transactionsView.render().el);
            return this;
        }
    });

    var IntervalsView = Backbone.View.extend({
        tagName: 'div',
        url: 'api/transactions',
        initialize: function (options) {
            var self = this;
            if (!this.collection) {
                this.collection = new Intervals.Collection();
            }
            this.collection.fetch({
                success: function () {
                    if (accountsCollection.fetched) {
                        self.render();
                    } else {
                        self.listenToOnce(accountsCollection, 'sync', self.render);
                    }
                }
            });
        },
        render: function () {
            this.collection.each(function (interval) {
                var intervalView = new IntervalView({model: interval});
                this.$el.append(intervalView.render().el);
            }, this);
            this.trigger('rendered');
            return this;
        }
    });

    return IntervalsView;
});