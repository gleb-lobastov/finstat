from django.conf.urls import patterns, url
from finstat import views, api

urlpatterns = patterns(
    '',
    # rest api
    url(r'^api/transactions$', api.TransactionList.as_view(), name='transactions_list'),
    url(r'^api/transactions/(?P<pk>[0-9]+)$', api.TransactionDetail.as_view(), name='transactions_detail'),
    # url(r'^api/transactions/list/?page=(?P<page>[0-9]+)$', api.TransactionsList.as_view(), name='transactions_list'),
    # url(r'^api/transactions/(?P<pk>[0-9]+)$', api.transactions_item, name='transaction_detail'),
    # url(r'^api/transactions_partial$', api.TransactionsListPartial.as_view(), name='transactions_partial'),
    url(r'^api/accounts$', api.AccountList.as_view(), name='accounts_list'),
    url(r'^api/categories$', api.CategoryList.as_view(), name='accounts_list'),

    # pjax supporting templates
    url(r'^.*', views.index, name='finstat-transactions-index'),
    #     transactions.transactions_stats_view, name='finstat-transactions-overview'),
    # transactions/year2015/month10/day1
    # 2015 +1000000 - 999999
    # 2015.10 +100000 -99999
    # 2015.10.1 + 10000 -9999
    # +1000 -0
    # +0 -999
    # 2015.09.30 +1000 -999
    # +100 -0
    # +0 -99
    # url(r'^transactions/$', views.transactions, {'last': 'default'}, name='finstat-transactions-last'),
    # url(r'^transactions/all$', views.transactions, name='finstat-transactions-all'),
    # url(r'^transactions/month$', views.transactions, {'last': 'month'}, name='finstat-transactions-month'),
    # url(r'^transactions/month/(?P<year>\d+)/(?P<month>\d+)$', views.transactions, name='finstat-transactions-month'),
    # url(r'^transactions/year$', views.transactions, {'last': 'year'}, name='finstat-transactions-year'),
    # url(r'^transactions/year/(?P<year>\d+)$', views.transactions, name='finstat-transactions-year'),
    # url(r'^transactions/(?P<transaction_id>\d+)/$', views.transaction, name='transaction'),
    # url(r'^categories/list/$', views.json_request, name='json_request'),
)
