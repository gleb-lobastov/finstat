define([
   'underscore',
   'backbone',
   'moment',
   'finstat/misc/tools',
   './models',
   'text!./form-add-transaction.html',
   'css!./form-add-transaction'
], function (_, Backbone, moment, tools, models, formTpl) {

   return Backbone.View.extend(_.extend({}, tools.PluginsMixin, {
      className: "row finstat__show-on-hover_area finstat__highlight-row",
      events: {
         'click #finstat__form-submit': 'submit',
         'click #finstat__form-date-dec': 'dateDec',
         'click #finstat__form-date-inc': 'dateInc',
         'click #finstat__form-ctrl-swap': 'swap',
         'change input': 'onUserChange'
      },
      template: _.template(formTpl),
      model: new models.Transaction(null, {alwaysNew: true}),
      datepickerConfig: {
         target: '#id_date'
      },
      selectableConfig: {
         '#id_fk_category': {
            annotations: 'categories',
            attribute: 'fk_category',
            placeholder: 'Категория'
         },
         '#id_fk_account_from': {
            annotations: 'accounts',
            attribute: 'fk_account_from',
            placeholder: 'Со счета'
         },
         '#id_fk_account_to': {
            annotations: 'accounts',
            attribute: 'fk_account_to',
            placeholder: 'На счет'
         }
      },
      editableConfig: {
         '.finstat__form-comment': {
            mode: 'update',
            field: 'comment',
            use: 'model',
            question: function (model) {
               switch (model.sign()) {
                  case 0:
                     return 'Куда переведены деньги?';
                  case 1:
                     return 'Откуда пришли деньги?';
                  default:
                     return 'На что потрачены деньги?';
               }
            }
         }
      },
      initialize: function (options) {
         this.initPlugins(options.plugins, ['datepicker', 'selectable', 'editable']);
         this.listenTo(this.model, 'change', this.onChange);
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
            $input = this.$(jqEvent.target),
            updated = {};
         updated[$input.attr('name')] = $input.val();
         this.model.set(updated, {silent: true});
      },
      swap: function () {
         var
            account_from = this.model.get('fk_account_from'),
            account_to = this.model.get('fk_account_to');
         this.model.set({
            fk_account_from: account_to,
            fk_account_to: account_from
         });
      },
      onChange: function (model, options) {
         var
            self = this,
            changes = this.model.changedAttributes();
         if (!changes) {
            return;
         }
         if ('date' in changes) {
            this.pluginsApi.datepicker.selectDate(moment(self.model.get('date')).toDate());
         }
         if ('fk_account_from' in changes) {
            this.$('#id_fk_account_from')[0].selectize.setValue(self.model.get('fk_account_from'))
         }
         if ('fk_account_to' in changes) {
            this.$('#id_fk_account_to')[0].selectize.setValue(self.model.get('fk_account_to'))
         }
         if ('comment' in changes) {
            this.$('#id_comment').toggleClass('finstat__implicit-value', !!self.model.get('comment'))
         }
         if ('fk_category' in changes) {
            this.$('#id_fk_category')[0].selectize.setValue(self.model.get('fk_category'))
         }
      },
      submit: function () {
         var newTransaction = this.model.clone();
         this.collection.appendTransaction(newTransaction);
         this.model.set('comment', '');
         newTransaction.save();
      }
   }));
});