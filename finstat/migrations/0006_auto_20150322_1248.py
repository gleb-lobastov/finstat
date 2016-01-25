# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('finstat', '0005_auto_20150322_1101'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transaction',
            name='comment',
        ),
        migrations.AddField(
            model_name='splitpart',
            name='comment',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='splitpart',
            name='tag',
            field=models.CharField(null=True, max_length=50),
            preserve_default=True,
        ),
    ]
