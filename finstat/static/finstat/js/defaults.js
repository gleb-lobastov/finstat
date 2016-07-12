define([], function () {
    return {
        endpoints: {
            accounts: 'api/accounts',
            transactions: 'api/transactions'
        },
        css: {
            rowOutcome: 'finstat__bar-outcome'
        },
        plugins: {
           editable: {
              
           }
        },
        currency: 'RUB',
        account: 'Г',
        account_type: 'OW',
        owner: 1
    };
});