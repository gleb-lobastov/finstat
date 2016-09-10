define([
   'underscore',
   'backbone',
   'text!./resources/header.html',
   'css!./resources/header'
], function (_, Backbone, headerTpl) {
   var Header = Backbone.Model.extend({
      defaults: {
         title: 'Финстат',
         sections: false,
         selected: undefined
      },
      _defaultSection: undefined,
      defaultSelection: function () {
         var
            sections = this.get('sections'),
            defaultUrl = this.get('defaultSectionUrl');

         if (this._defaultSection === undefined && sections) {
            this._defaultSection = _.find(sections, function (section) {
               return !section.url || section.url === defaultUrl
            });
         }
         return this._defaultSection
      },
      select: function (selectionUrl, options) {
         var sections = this.get('sections');
         if (sections) {
            this.set('selected', _.findWhere(sections, {url: selectionUrl}) || this.defaultSelection());
         }
         if (!options || !options.silent) {
            this.trigger('selected');
         }
      },
      update: function (settings, selectionUrl) {
         if (settings.baseUrl !== this.get('baseUrl')) {
            this._defaultSection = undefined;
            this.set(settings);
            this.select(selectionUrl, {silent: true});
            this.trigger('updated');
         } else {
            this.select(selectionUrl);
         }
      }
   });

   var HeaderView = Backbone.View.extend({
      events: {
         'click a': 'updateSelector'
      },
      model: new Header(),
      template: _.template(headerTpl),
      initialize: function () {
         this.listenTo(this.model, 'updated', this.render);
         this.listenTo(this.model, 'selected', this.select);
      },
      render: function () {
         this.$el.html(this.template(this.model.toJSON())).navigable();
         return this;
      },
      select: function () {
         this.$('#finstat__date-selector').html(this.model.get('selected').title);
         return this;
      }
   });

   return {
      View: HeaderView
   };
});