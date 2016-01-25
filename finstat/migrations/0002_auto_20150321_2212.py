# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('finstat', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Place',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('place_name', models.CharField(max_length=200)),
                ('lat', models.FloatField()),
                ('lng', models.FloatField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='SplitPart',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField(default=0)),
                ('tag', models.TextField()),
                ('fk_category', models.ForeignKey(to='finstat.Category')),
                ('fk_transaction', models.ForeignKey(to='finstat.Transaction')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='split',
            name='category',
        ),
        migrations.RemoveField(
            model_name='split',
            name='transaction',
        ),
        migrations.DeleteModel(
            name='Split',
        ),
        migrations.RenameField(
            model_name='account',
            old_name='owner',
            new_name='fk_owner',
        ),
        migrations.RenameField(
            model_name='performer',
            old_name='performer',
            new_name='oo_performer',
        ),
        migrations.RenameField(
            model_name='transaction',
            old_name='account_from',
            new_name='fk_account_from',
        ),
        migrations.RenameField(
            model_name='transaction',
            old_name='account_to',
            new_name='fk_account_to',
        ),
        migrations.RenameField(
            model_name='transaction',
            old_name='performer',
            new_name='fk_performer',
        ),
        migrations.AddField(
            model_name='transaction',
            name='fk_place',
            field=models.ForeignKey(to='finstat.Place', null=True),
            preserve_default=True,
        ),
    ]
