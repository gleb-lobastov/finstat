# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('finstat', '0003_auto_20150321_2228'),
    ]

    operations = [
        migrations.AlterField(
            model_name='splitpart',
            name='fk_category',
            field=models.ForeignKey(null=True, to='finstat.Category'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='splitpart',
            name='tag',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
    ]
