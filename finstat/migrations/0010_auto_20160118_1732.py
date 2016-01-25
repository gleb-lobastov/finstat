# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finstat', '0009_auto_20160118_1731'),
    ]

    operations = [
        migrations.RenameField(
            model_name='category',
            old_name='node',
            new_name='is_node',
        ),
    ]
