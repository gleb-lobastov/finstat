define([], function () {
   return {
      enums: {
         Interval: {
            daily: 'daily',
            monthly: 'monthly',
            annual: 'annual'
         },
         TransactionType: {
            income: 1,
            outcome: 2,
            moveOwn: 3,
            moveOther: 4,
            unknown: 5
         }
      }
   }
});