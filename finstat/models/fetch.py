from functools import wraps
from django.db.models import Case, When, Q, F
from django.db.models import Count, Sum
from finstat.models import Transaction

"""

(group="years", offset=0)
total +1000 -300
2015 +500 -300
2014 +400 -300

(group="months", offset=0)
2015 +500 -300
12 +100 -50
11 +30 -40

(group="days", offset=0)
11 +30 -40
29.11 +5 0
25.11 0 -4

(group=None, offset=0)
321 2015.11.29 +1 0
123 2015.11.29 0 -1
125 2015.11.29 0 -1


cursor_date
depth

year
month
day

"""


def paging(query_func):
    """ Декоратор реализует постраничную навигацию для django.db.models.QuerySet

    Добавляет аргументы limit и offset, к декорируемому методу.
    Так-же добавляет аргумент _get_query, который возвращает построенный
    запрос, вместо его выполнения. Используется для отладки

    Args:
        query_func: Функция возвращаюшая QuerySet

    """
    @wraps(query_func)
    def wrapper(*args, limit=None, offset=None, _get_query=False, **kwargs):
        query_set = query_func(*args, **kwargs)
        if _get_query:
            return query_set.query

        start = offset
        end = (limit + (offset if offset else 0)) if limit else None
        return query_set[start:end]
    return wrapper


@paging
def by_period(interval):
    """ Соотносит период, доход и расход за период.

    Args:
        interval: Определят период, за который ведется расчет
            допустимые значения: 'years', 'months', 'days'

    Returns: [[date, income, outcome]]

    """
    if interval not in ('year', 'month', 'day'):
        raise ValueError('Период {} не поддерживается'.format(interval))
    clause = {'period': '''date_trunc('{}', date)'''.format(interval) if interval != 'day' else 'date'}

    return (Transaction.objects
            .extra(select=clause)
            .values('period')
            .annotate(income=Sum(Case(When(~Q(fk_account_from__account_type="OW") &
                                           Q(fk_account_to__account_type='OW'),
                                           then='amount'),
                                      default=0)))
            .annotate(outcome=Sum(Case(When(~Q(fk_account_to__account_type='OW') &
                                            Q(fk_account_from__account_type="OW"),
                                            then='amount'),
                                       default=0)))
            .exclude(income=0, outcome=0)
            .order_by('-period'))


@paging
def every():
    """

    Returns:
        [(period_string, income, outcome)]
    """
    return (Transaction.objects
            .annotate(period=F('date'))
            .values('period')
            .annotate(income=Case(When(~Q(fk_account_from__account_type="OW") &
                                       Q(fk_account_to__account_type='OW'),
                                       then='amount'),
                                  default=0))
            .annotate(outcome=Case(When(~Q(fk_account_to__account_type='OW') &
                                        Q(fk_account_from__account_type="OW"),
                                        then='amount'),
                                   default=0))
            .exclude(income=0, outcome=0)
            .order_by('-period'))

