import datetime
import json

# from django.core import serializers
from django.template import loader, RequestContext
from django.http import HttpResponse, Http404
from django.shortcuts import render

from finstat.models import Account, Transaction, Category

column_widths = [80, 120, 120, 60, 300]

render_options = {
    'transactions': {
        'column_widths': column_widths,
        'table_width': sum(column_widths)
    }
}

del column_widths


def index(request):
    template = loader.get_template('finstat/index.html')
    context = RequestContext(request, {})
    return HttpResponse(template.render(context))


def accounts(request):
    accounts_list = Account.objects.all()
    context = {'accounts_list': accounts_list}
    return render(request, 'finstat/accounts.html', context)


def account(request, account_id):
    try:
        account = Account.objects.get(pk=account_id)
    except Account.DoesNotExist:
        raise Http404("Account does not exist")
    # return render(request, 'polls/detail.html', {'question': question})
    return HttpResponse("Show account %s." % account_id)


def ttransactions(request, year=False, month=False, last=False):
    """

    Args:
        request:
        year:
        month:
        last:

    Returns:

        {date: [{ amount, from, to,
            }]
        }
    """
    year = int(year)
    month = int(month)

    template = loader.get_template('finstat/panels-view.html')
    date_sections = []

    show_all = not year and not month and not last;

    if not show_all:
        if not last:
            last_day = (
                31 if not month or month == 12
                else (datetime.date(year, month + 1, 1) - datetime.timedelta(days=1)).day)

            show_since = datetime.datetime(year=year, month=(month or 1), day=1)
            show_until = datetime.datetime(year=year, month=(month or 12), day=last_day)
        else:
            show_until = datetime.datetime.today().date()
            if last == 'year':
                show_since = show_until.replace(year=show_until.year - 1)
            else:  # month
                show_since = show_until.replace(month=12 if show_until.month == 1 else show_until.month - 1)
    else:
        show_since = Transaction.objects.earliest('date').date
        show_until = Transaction.objects.latest('date').date

    # import pdb; pdb.set_trace()

    for transact_obj in (
            Transaction.objects.all() if show_all
            else
            Transaction.objects.filter(date__lte=show_until, date__gte=show_since)
    ):
        obj_date = str(transact_obj.date)

        for section in date_sections:
            if section['date'] == obj_date:
                break
        else:
            date_sections.append({
                'date': obj_date,
                'transactions': [],
                'spend': 0,
                'earn': 0,
            })
            section = date_sections[-1]

            if month != transact_obj.date.month:
                if month and len(date_sections) > 1:
                    section['month_separator'] = transact_obj.date.strftime("%B")
                month = transact_obj.date.month

        transaction = {
            'PF': transact_obj.fk_performer,
            'AF': str(transact_obj.fk_account_from),
            'AT': str(transact_obj.fk_account_to),
            'AM': 0,
            'CR': transact_obj.fk_account_from.currency_render()
        }

        # Проверка, является ли данная транзакция заработком или тратой
        earn = (
            transact_obj.fk_account_from.account_type not in Account.ACC_ON_BALANCE
            and
            transact_obj.fk_account_to.account_type in Account.ACC_ON_BALANCE)
        spend = (
            transact_obj.fk_account_from.account_type in Account.ACC_ON_BALANCE
            and
            transact_obj.fk_account_to.account_type not in Account.ACC_ON_BALANCE)

        # Находим все части сплита транзакции
        split_obj = transact_obj.splitpart_set.all()
        parts_count = len(split_obj);

        if parts_count > 1:
            transaction['splitted'] = True
        elif parts_count == 1:
            transaction['single'] = True
        else:
            transaction['empty'] = True

        cat_eq_len = 0

        transaction['SP'] = []
        for splitpart in split_obj:
            split = {
                'CT': splitpart.fk_category.category_type,
                'CN': splitpart.fk_category.category_name,
                'TG': splitpart.tag,
                'AM': splitpart.amount,
                'CM': splitpart.comment
            }

            cat_eq_len = (
                max(
                        cat_eq_len,
                        (len(split['TG']) if parts_count > 1 and split['TG'] else 0) * 0.8 +
                        (len(split['CN']) if split['CN'] else 15)))

            transaction['AM'] += split['AM']
            transaction['SP'].append(split)

            if earn: section['earn'] += splitpart.amount
            if spend: section['spend'] += splitpart.amount

        # Пока не изменил БД объединяю комменты ручками
        transaction['CM'] = '\n'.join(split['CM'] for split in transaction['SP'])

        tag_on_cmt_eq_len = 0 if parts_count != 1 else len(split['TG'] or []) * 0.8;

        transaction['cat_colspan'] = (
            3 if not transaction['CM'] and not tag_on_cmt_eq_len else
            2 if (len(transaction['CM']) + tag_on_cmt_eq_len) // parts_count < 30
                 and
                 cat_eq_len > 14
            else 1)
        transaction['cmt_colspan'] = 3 - transaction['cat_colspan']

        # aaa = len(transaction['CM'])
        # bbb = len(split['TG'])*0.8 if parts_count and split['TG'] else 0
        # ccc = (aaa + bbb) // parts_count

        # import pdb; pdb.set_trace()
        section['transactions'].append(transaction)

    context = RequestContext(request, {
        'date_sections': date_sections,
        'render_options': render_options['transactions'],
        # 'page': page,
        'interval': {
            'since': show_since,
            'until': show_until
        },
    })
    return HttpResponse(template.render(context))


def transaction(request, transaction_id):
    response = "Show transaction %s."
    return HttpResponse(response % transaction_id)


def json_request(request):
    categories = list(Category.objects.all().order_by('category_name').values('category_type', 'category_name'))
    data = json.dumps(categories, ensure_ascii=False)
    # data = serializers.serialize("json", categories, ensure_ascii=False)
    return HttpResponse(data, content_type='application/json; charset=UTF-8')
