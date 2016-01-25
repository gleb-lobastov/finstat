# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('finstat', '0006_auto_20150322_1248'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='transaction',
            options={'ordering': ['-date']},
        ),
        migrations.AddField(
            model_name='performer',
            name='default_currency',
            field=models.CharField(max_length=3, default='RUB', choices=[('RUB', 'Российский рубль'), ('USD', 'Американский доллар'), ('EUR', 'Евро')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='account',
            name='comment',
            field=models.TextField(blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='account',
            name='currency',
            field=models.CharField(max_length=3, default='RUB', choices=[('RUB', 'Российский рубль'), ('USD', 'Американский доллар'), ('EUR', 'Евро')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='splitpart',
            name='comment',
            field=models.TextField(blank=True, null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='splitpart',
            name='fk_category',
            field=models.ForeignKey(null=True, blank=True, to='finstat.Category'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='splitpart',
            name='tag',
            field=models.CharField(max_length=50, blank=True, null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='transaction',
            name='fk_place',
            field=models.ForeignKey(null=True, blank=True, to='finstat.Place'),
            preserve_default=True,
        ),
    ]
