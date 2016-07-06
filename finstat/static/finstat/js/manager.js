define([
    'finstat/accounts/collection'//,
//    'finstat/transactions/def'
], function (AccountsCollection/*, TransactionsCollection*/) {
    return {
        collections: {
            accounts: new AccountsCollection()//,
//            transactions: new TransactionsCollection()
        }
    }
});