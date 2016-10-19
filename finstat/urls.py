from django.conf.urls import patterns, url
from finstat import views, api

urlpatterns = patterns(
    '',
    # rest api
    url(r'^api/transactions$', api.TransactionList.as_view(), name='transactions_list'),
    url(r'^api/transactions/(?P<pk>[0-9]+)$', api.TransactionDetail.as_view(), name='transactions_detail'),
    url(r'^api/transactions/(?P<interval>(daily|monthly|annual))$', api.TransactionGroups.as_view(), name='transactions_group'),
    url(r'^api/accounts$', api.AccountList.as_view(), name='accounts_list'),
    url(r'^api/categories$', api.CategoryList.as_view(), name='accounts_list'),

    # templates
    url(r'^transactions/(?:daily|monthly|annual)', views.aggregated, name='finstat-transactions-index'),
    url(r'^.*', views.index, name='finstat-transactions-index'),
)
