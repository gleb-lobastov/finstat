# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('finstat', '0002_auto_20150321_2212'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='comment',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='transaction',
            name='fk_account_from',
            field=models.ForeignKey(to='finstat.Account', related_name='account_from', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='transaction',
            name='fk_account_to',
            field=models.ForeignKey(to='finstat.Account', related_name='account_to', null=True),
            preserve_default=True,
        ),
    ]
