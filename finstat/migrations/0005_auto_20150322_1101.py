# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('finstat', '0004_auto_20150321_2239'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='account_type',
            field=models.CharField(max_length=2, default='AN', choices=[('AN', 'Наблюдаемый'), ('OW', 'Личный счет'), ('DE', 'Долг'), ('DP', 'Вклад под %'), ('CR', 'Кредит в банке'), ('BO', 'Бонусный счет')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='transaction',
            name='date',
            field=models.DateField(verbose_name='date of transaction'),
            preserve_default=True,
        ),
    ]
