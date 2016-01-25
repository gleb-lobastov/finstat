# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finstat', '0008_auto_20160118_1723'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tag',
            name='definition',
            field=models.CharField(max_length=250),
        ),
    ]
