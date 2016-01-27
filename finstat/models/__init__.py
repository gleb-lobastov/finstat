# -*- coding: UTF-8 -*-

from django.db import models
from django.db.models.query import QuerySet
from django.db.models import Case, When, Q, F
from django.db.models import Count, Sum
from django.contrib.auth.models import User
import finstat.modules.currency as currency


class TransactionMixin(object):
    def group_by_period(self, interval):
        if interval not in ('year', 'month', 'day'):
            raise ValueError('Период {} не поддерживается'.format(interval))
        clause = {'period': '''date_trunc('{}', date)'''.format(interval) if interval != 'day' else 'date'}

        return (self
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

    def every(self):
        return (self
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

    def limit(self, limit, offset=None):
        start = max(0, offset)
        end = (limit + (start if start else 0)) if limit > 0 else None
        return self[start:end]

    def between(self, min_date, max_date):
        return self.filter(date__range=(min_date, max_date))


class TransactionQuerySet(QuerySet, TransactionMixin):
    pass


class TransactionManager(models.Manager, TransactionMixin):
    def get_queryset(self):
        return TransactionQuerySet(self.model, using=self._db)


class Performer(models.Model):
    oo_performer = models.OneToOneField(User)
    default_currency = models.CharField(max_length=3,
                                        choices=currency.choices,
                                        default=currency.default)

    def __str__(self):
        return self.oo_performer.username

    def currency_render(self):
        return currency.render(self.default_currency)


class Transaction(models.Model):
    objects = TransactionManager()

    # class Meta:
    #     ordering = ["-date"]

    amount = models.IntegerField(default=0)
    comment = models.TextField(null=True, blank=True)
    date = models.DateField('date of transaction')
    fk_account_from = models.ForeignKey('Account', related_name='account_from', null=True)
    fk_account_to = models.ForeignKey('Account', related_name='account_to', null=True)
    fk_category = models.ForeignKey('Category', null=True, blank=True)
    fk_performer = models.ForeignKey('Performer')
    fk_place = models.ForeignKey('Place', null=True, blank=True)
    # tag = models.CharField(null=True, max_length=50, blank=True)
    # from finstat.models import *; a=Transaction.objects.all()

    def __str__(self):
        def get_account_name(fk):
            return fk.account_name if fk is not None else '[external]'

        return "#{id}, {date}: {amount} {acc_from}->{acc_to} by {performer}".format(
            acc_from=get_account_name(self.fk_account_from),
            acc_to=get_account_name(self.fk_account_to),
            amount=self.amount,
            date=self.date.strftime('%m/%d/%Y'),
            id=self.id,
            performer=self.fk_performer.oo_performer.username
        )

# todo AccountAccess


class Tag(models.Model):

    definition = models.CharField(max_length=250)
    shortening = models.CharField(max_length=50, unique=True)

    
class TagTransactionLink(models.Model):

    fk_tag = models.ForeignKey('Tag', null=False, blank=False)
    fk_transaction = models.ForeignKey('Transaction', null=False, blank=False)


class Account(models.Model):

    ACC_GROUP = 'GR'
    ACC_OWN = 'OW'
    ACC_DEBT = 'DE'
    ACC_DEPOSIT = 'DP'
    ACC_CREDIT = 'CR'
    ACC_CREDIT_CARD = 'CC'
    ACC_DEBIT_CARD = 'DC'
    ACC_BUSINESS = 'BS'
    ACC_BOUNCE = 'BO'

    ACC_TYPES = (
        (ACC_OWN, 'Personal account'),
        (ACC_GROUP, 'Family account'),
        (ACC_DEBT, 'Debt account'),
        (ACC_DEPOSIT, 'Deposit'),
        (ACC_CREDIT, 'Credit'),
        (ACC_CREDIT_CARD, 'Credit card'),
        (ACC_DEBIT_CARD, 'Debit card'),
        (ACC_BUSINESS, 'Company account'),
        # Бонусный счет - только если это счет с фантиками, для остальных просто указываем бонусную программу
        (ACC_BOUNCE, 'Bounce account'),
    )

    ACC_ON_BALANCE = ['OW', 'DP', 'CR', 'CC']

    account_name = models.CharField(max_length=50, unique=True)
    account_type = models.CharField(max_length=2, choices=ACC_TYPES, default=ACC_OWN)
    # bounce_system = models.ForeignKey('BounceSystem')
    comment = models.TextField(null=True, blank=True)
    currency = models.CharField(max_length=3, choices=currency.choices, default=currency.default)
    initial_amount = models.IntegerField(default=0)
    fk_owner = models.ForeignKey('Performer')

    def __str__(self):
        return self.account_name

    def __repr__(self):
        return """"{text}", Type: {acc_type}-{currency} Owner: {owner}""".format(
            text=self.text,
            type=self.account_type,
            currency=self.currency,
            owner=self.fk_owner.oo_performer.username
        )

    def currency_render(self):
        return currency.render(self.currency)
    # def date_of_first_use, date_of_last_use, value_on_date, value

# todo BounceSystem
# todo Captures - данные о состоянии счета на конец такой-то даты


class CurrencyRate(models.Model):
    date = models.DateField('rate actualization date')
    currency_code = models.CharField(max_length=3,
                                     choices=currency.choices)
    rate = models.FloatField(null=False)
    currency_rate_to = models.CharField(max_length=3,
                                        choices=currency.choices,
                                        default=currency.default)


class Category(models.Model):

    DIRECTIONS = {
        None: "",
        0: "Outcome",
        1: "Income",
        2: "Transfer"
    }
    
    category_name = models.CharField(max_length=200)
    direction = models.IntegerField(null=True, default=0)
    parent_id = models.ForeignKey('self', null=True)
    is_node = models.BooleanField(default=False)

    def __str__(self):
        return "{direction}: {category}".format(
            direction=self.DIRECTIONS.get(self.direction, 'n/d'),
            category=self.category_name
        )

# todo CategoryGroups
# todo Details and Products
# todo Tags


class Place(models.Model):
    place_name = models.CharField(max_length=200)
    lat = models.FloatField(null=True)
    lng = models.FloatField(null=True)

    def __str__(self):
        return self.place_name
