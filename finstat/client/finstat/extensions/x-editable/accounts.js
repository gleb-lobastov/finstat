define([
   'jquery',
   'underscore',
   'finstat/components/single/collections',
   "finstat/adapters/selectable/selectize",
   'text!finstat/extensions/x-editable/input.html',
   'text!finstat/extensions/x-editable/view.html',
   'bootstrap-editable',
   'css!finstat/extensions/x-editable/accounts'
], function ($, _, single, selectable, inputRawTpl, viewRawTpl) {
   "use strict";

   var
      inputTpl = _.template(inputRawTpl),
      viewTpl = _.template(viewRawTpl),
      selectableConfig = {
         '.ext_editable_account_from': {
            annotations: 'accounts',
            attribute: 'fk_account_from'
         },
         '.ext_editable_account_to': {
            annotations: 'accounts',
            attribute: 'fk_account_to'
         }
      },
      Accounts = function (options) {
         this.init('accounts', options, Accounts.defaults);
      };

   //inherit from Abstract input
   $.fn.editableutils.inherit(Accounts, $.fn.editabletypes.abstractinput);

   $.extend(Accounts.prototype, {
      render: function () {
         this.$input = this.$tpl.find('input');
         _.map(selectableConfig, function (options, selector) {
               selectable.init({
                  $target: this.$tpl.find(selector),
                  canCreate: true,
                  annotations: single[options.annotations],
                  model: this.model,
                  attribute: options.attribute
               });
         }, this);
      },

      value2html: function (value, element) {
         if (!value) {
            $(element).empty();
         } else {
            $(element).html(inputTpl(value));
         }
      },

      value2str: function (value) {
         return [value.fk_account_from || '', value.fk_account_to || ''].join(':')
      },

      str2value: function (str) {
         var accounts = str.split(':');
         return {
            fk_account_from: +accounts[0],
            fk_account_to: +accounts[1]
         }
      },

      value2input: function (value) {
         value = value || {};
         this.$input.filter('[name="fk_account_from"]').val(value.fk_account_from);
         this.$input.filter('[name="fk_account_to"]').val(value.fk_account_to);
      },

      input2value: function () {
         return {
            fk_account_from: this.$input.filter('[name="fk_account_from"]').val(),
            fk_account_to: this.$input.filter('[name="fk_account_to"]').val()
         };
      },

      activate: function () {
         this.$input.filter('[name="fk_account_from"]').focus();
      },

      autosubmit: function () {
         this.$input.keydown(function (e) {
            if (e.which === 13) {
               $(this).closest('form').submit();
            }
         });
      }
   });

   Accounts.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
      tpl: inputRawTpl,
      inputclass: ''
   });

   $.fn.editabletypes.accounts = Accounts;
});