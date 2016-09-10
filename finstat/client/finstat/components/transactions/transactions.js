define([
   './view-each',
   './view-daily',
   './view-monthly',
   './view-annual'
], function (ViewEach, ViewDaily, ViewMonthly, ViewAnnual) {
   return {
      ViewAnnual: ViewAnnual,
      ViewMonthly: ViewMonthly,
      ViewDaily: ViewDaily,
      ViewEach: ViewEach
   };
});