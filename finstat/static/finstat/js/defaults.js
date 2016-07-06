define([], function () {
    return {
        endpoints: {
            accounts: 'api/accounts',
            transactions: 'api/transactions_partial'
        },
        css: {
            rowIncome: 'finstat__bar-income', 
            rowOutcome: 'finstat__bar-outcome'
        },
        currency: 'RUB',
        account: 'Г',
        account_type: 'OW',
        owner: 1
    };
});