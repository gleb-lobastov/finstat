from finstat.defaults import PAGE, PAGE_SIZE
from finstat.models import fetch

from django.template import loader, RequestContext
from django.http import HttpResponse, Http404
from django.shortcuts import render


def portion(page=PAGE, page_size=PAGE_SIZE):
    limit = max(page_size, 1)
    offset = limit * (max(page, 1) - 1)
    return {'limit': limit, 'offset': offset}


def _overview(interval=None, page=PAGE, page_size=PAGE_SIZE):
    """ Обзор транзакций сгруппированных по периоду

    Args:
        request:
        interval: наименование периода, может быть 'year', 'month', 'day' или None
        page:
        page_size:

    Returns:

    """
    page, page_size = int(page), int(page_size)
    if interval is None:
        result = fetch.every(**portion(page, page_size))
    else:
        result = fetch.by_period(interval, **portion(page, page_size))

    return result

def overview(request, interval=None, page=PAGE, page_size=PAGE_SIZE):
    """ Обзор транзакций сгруппированных по периоду

    Args:
        request:
        interval: наименование периода, может быть 'year', 'month', 'day' или None
        page:
        page_size:

    Returns:

    """
    data = _overview(interval, page, page_size)
    template = loader.get_template('finstat/transactions/data.html')
    context = RequestContext(request, {'data': data,
                                       'paging': (page, page_size),
                                       'arguments': {'interval': interval}})
    return HttpResponse(template.render(context))


def index(request):
    data = _overview()
    template = loader.get_template('finstat/transactions/index.html')
    context = RequestContext(request, {'data': data,
                                       'paging': (PAGE, PAGE_SIZE),
                                       'arguments': {'interval': None}})
    return HttpResponse(template.render(context))
