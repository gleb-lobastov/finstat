import datetime
from finstat.defaults import PAGE, PAGE_SIZE
from finstat.models import Transaction, Interval, Performer
from finstat.forms import TransactionForm

from django.template import loader, RequestContext
from django.http import HttpResponse, Http404
from django.shortcuts import render_to_response, redirect

from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required

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


def timeline_pjax_html(request, page=PAGE, page_size=PAGE_SIZE):
    page = int(page)
    page_size = int(page_size)
    template = loader.get_template('finstat/transactions/timeline.html')
    data = transactions_list(page, page_size)
    data['form'] = TransactionForm(initial={'date': datetime.date.today()})
    context = RequestContext(request, data)
    return HttpResponse(template.render(context))

def base_view(request):
    template = loader.get_template('finstat/transactions/base.html')
    context = RequestContext(request, {})
    return HttpResponse(template.render(context))


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


def index(request):
    template = loader.get_template('finstat/index.html')
    return HttpResponse(template.render())


@login_required
def post_add(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = TransactionForm(request.POST, initial={'fk_performer': 1, 'amount': ''})
        # check whether it's valid:
        if form.is_valid():
            form.cleaned_data['fk_performer'] = Performer.objects.get(oo_performer=request.user.id).id
            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            form.save()

    # if a GET (or any other method) we'll create a blank form
    else:
        form = TransactionForm()

    return HttpResponseRedirect("/finstat/transactions")
