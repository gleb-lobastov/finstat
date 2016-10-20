from django.template import loader, RequestContext
from django.http import HttpResponse
from finstat.models import Transaction, Interval

PAGE, PAGE_SIZE = 1, 20


def index(request):
    template = loader.get_template('finstat/index.html')
    context = RequestContext(request, {})
    return HttpResponse(template.render(context))


def aggregated(request):
    template = loader.get_template('finstat/transactions/aggregated.pug.jade')
    context = RequestContext(request, {})
    return HttpResponse(template.render(context))

def stats(gen):
    iterator = iter(gen)
    value = next(gen)
    max_value = min_value = value
    for value in gen:
        min_value = min(value, min_value)
        max_value = max(value, max_value)
    return min_value, max_value


def paging_info(page, page_size):
    return {
        'index': page,
        'page_size': page_size,
        'next': page + 1,
        'prev': page - 1 if page > 1 else None
    }


def transactions_list(page=PAGE, page_size=PAGE_SIZE):
    records = Transaction.objects.each().at_page(page, page_size)
    return {
        'records': enumerate(records, start=page*page_size + 1),
        'paging': paging_info(page, page_size)
    }


def transactions_stats(interval, page=PAGE, page_size=PAGE_SIZE):
    records = Transaction.objects.group_by(Interval(interval)).at_page(page, page_size)
    return {
        'data': enumerate(records, start=page*page_size + 1),
        'paging': paging_info(page, page_size)
    }


def transactions_stats_view(request, interval, page=PAGE, page_size=PAGE_SIZE):
    page = int(page)
    page_size = int(page_size)
    template = loader.get_template('finstat/transactions/{}.html')
    context = RequestContext(request, transactions_stats(interval, page, page_size))
    return HttpResponse(template.render(context))
