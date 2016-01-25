from django.conf.urls import patterns, url
from finstat import views
from finstat.views import transactions

urlpatterns = patterns(
    '',
    # /finstat
    # url(r'^$', views.index, name='finstat-index'),
    url(r'^transactions$', transactions.index, name='finstat-transactions-index'),
    url(r'^transactions/page(?P<page>\d+)$', transactions.overview, name='finstat-transactions-overview'),
    url(r'^transactions/(?P<interval>((year)|(month)|(day)))/page(?P<page>\d+)$',
        transactions.overview, name='finstat-transactions-overview'),
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
