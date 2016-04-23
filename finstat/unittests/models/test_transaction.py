# from django.test import TestCase
#
# import datetime
# import random
# from finstat.models import Transaction, Interval
#
# min_date = datetime.datetime(2014, 1, 1)
# max_date = datetime.datetime(2016, 12, 31)
# total_days = (max_date - min_date).days
#
#
# def random_transaction():
#     ACCOUNT_OWN = 1
#     ACCOUNT_OTHER = 2
#     account_choices = [ACCOUNT_OWN, ACCOUNT_OTHER, None]
#     category_choice = (None, )
#     comment_choice = (None, )
#
#     return {
#         'amount': round(random.expovariate(0.001)),
#         'date': min_date + datetime.timedelta(days=random.randint(0, total_days)),
#         'fk_account_from': ACCOUNT_OWN,
#         'fk_account_to': None,
#         'category': None,
#         'comment': None
#     }
#
#
# class TestTransaction(TestCase):
#     def setUp(self):
#         for _ in range(100):
#             Transaction.objects.create(random_transaction())
#
#     def test_group1_n1(self):
#         self.assertDictEqual({}, {})
