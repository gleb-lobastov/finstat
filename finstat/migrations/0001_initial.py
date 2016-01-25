# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('account_name', models.CharField(max_length=50)),
                ('currency', models.CharField(max_length=3)),
                ('account_type', models.CharField(max_length=2, choices=[('AN', 'Наблюдаемый'), ('OW', 'Личный счет'), ('DE', 'Долг'), ('CR', 'Кредит в банке'), ('BO', 'Бонусный счет')], default='AN')),
                ('initial_amount', models.IntegerField(default=0)),
                ('comment', models.TextField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('category_name', models.CharField(max_length=200)),
                ('category_type', models.CharField(max_length=2, choices=[('IN', 'Доходы'), ('GD', 'Товары'), ('SR', 'Услуги'), ('MT', 'Перевод средств'), ('OT', 'Прочее')], default='OT')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Performer',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('performer', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Split',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('amount', models.IntegerField(default=0)),
                ('category', models.ForeignKey(to='finstat.Category')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('date', models.DateTimeField(verbose_name='date of transaction')),
                ('comment', models.TextField()),
                ('account_from', models.ForeignKey(to='finstat.Account', related_name='account_from')),
                ('account_to', models.ForeignKey(to='finstat.Account', related_name='account_to')),
                ('performer', models.ForeignKey(to='finstat.Performer')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='split',
            name='transaction',
            field=models.ForeignKey(to='finstat.Transaction'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='account',
            name='owner',
            field=models.ForeignKey(to='finstat.Performer'),
            preserve_default=True,
        ),
    ]
