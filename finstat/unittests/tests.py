from django.test import TestCase

import datetime
import random
from django.contrib.auth.models import User
from finstat.models import Transaction, Account, Interval
from finstat.models import Performer,  currency

min_date = datetime.datetime(2014, 1, 1)
max_date = datetime.datetime(2016, 12, 31)
total_days = (max_date - min_date).days

# fk_owner = models.ForeignKey('Performer')

# ACCOUNT_OTHER = 2

def random_transaction():
    # account_choices = [own_account, ACCOUNT_OTHER, None]
    # category_choice = (None, )
    # comment_choice = (None, )

    return {
        'amount': round(random.expovariate(0.001)),
        'date': min_date + datetime.timedelta(days=random.randint(0, total_days)),
        # 'fk_account_from': own_account,
        'fk_account_to': None,
        'category': None,
        'comment': None
    }


class TestTransaction(TestCase):
    @classmethod
    def setUpClass(cls):
        username = 'test_user'
        cls.user = User.objects.create_user(
            username=username,
            email=username + '@gmail.com',
            password=username.upper()
        )
        cls.performer = Performer.objects.create(
            oo_performer=cls.user,
            default_currency='RUB'
        )
        # user.data = {'username': username, 'password': password}
        # return user
        cls.own_account = Account.objects.create(
            account_name='own',
            account_type=Account.ACC_OWN,
            currency=currency.default,
            initial_amount=0,
            fk_owner=cls.performer
        )

        cls.other_account = Account.objects.create(
            account_name='other',
            account_type=Account.ACC_GROUP,
            currency=currency.default,
            initial_amount=0,
            fk_owner=cls.performer
        )

        Transaction.objects.create(
            amount=10000,
            date=datetime.datetime(2015, 1, 1),
            fk_account_from=None,
            fk_account_to=cls.own_account,
            fk_performer=cls.performer
        )

        Transaction.objects.create(
            amount=100,
            date=datetime.datetime(2015, 1, 2),
            fk_account_from=cls.own_account,
            fk_account_to=None,
            fk_performer=cls.performer
        )

        Transaction.objects.create(
            amount=100,
            date=datetime.datetime(2015, 1, 2),
            fk_account_from=cls.other_account,
            fk_account_to=None,
            fk_performer=cls.performer
        )

    def test_group1_n1(self):
        self.assertEqual(len(Transaction.objects.each()), 3)

    def test_group1_n2(self):
        self.assertEqual(len(Transaction.objects.group_by(Interval.daily)), 2)

    def test_group1_n3(self):
        self.assertEqual(len(Transaction.objects.group_by(Interval.annual)), 1)