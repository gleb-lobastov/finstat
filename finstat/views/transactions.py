from finstat.defaults import PAGE, PAGE_SIZE
from finstat.models import fetch
from finstat.models import Transaction

from django.template import loader, RequestContext
from django.http import HttpResponse, Http404
from django.shortcuts import render


def portion(page=PAGE, page_size=PAGE_SIZE):
    limit = max(page_size, 1)
    offset = limit * (max(page, 1) - 1)
    return {'limit': limit, 'offset': offset}


def stats(gen):
    iterator = iter(gen)
    value = next(gen)
    max_value = min_value = value
    for value in gen:
        min_value = min(value, min_value)
        max_value = max(value, max_value)
    return min_value, max_value


def _overview(interval=None, page=PAGE, page_size=PAGE_SIZE):
    """ Обзор транзакций сгруппированных по периоду

    Args:
        request:
        interval: наименование периода, может быть 'year', 'month', 'day' или None
        date:
        page:
        page_size:

    Returns:


        data - x записей
        min date
        max date
        groups
            days
            months
            years
    """
    records = Transaction.objects.fetch(interval)[page_size*page: page_size*(page+1)]

    # min_date, max_date = stats(item['period'] for item in data)
    # intervals = ('year', 'month', 'day')
    # depth = intervals.index(interval) + 1 if interval else len(intervals)
    # data = {intervals[level]: fetch.between(min_date, max_date, intervals[level]) for level in range(depth)}


    # index, da
    return records


def overview(request, interval=None, page=PAGE, page_size=PAGE_SIZE):
    """ Обзор транзакций сгруппированных по периоду

    Args:
        request:
        interval: наименование периода, может быть 'year', 'month', 'day' или None
        page:
        page_size:

    Returns:

    """
    page, page_size = max(0, int(page)), max(1, int(page_size))

    data = enumerate(_overview(interval, page, page_size), start=page*page_size + 1)
    template = loader.get_template('finstat/transactions/timeline.html')
    context = RequestContext(request, {'data': data,
                                       'paging': (page, page_size),
                                       'arguments': {'interval': interval}})
    return HttpResponse(template.render(context))


def index(request):
    data = enumerate(_overview(), start=1)
    template = loader.get_template('finstat/transactions/index.html')
    context = RequestContext(request, {'data': data,
                                       'paging': (PAGE, PAGE_SIZE),
                                       'arguments': {'interval': None}})
    return HttpResponse(template.render(context))
