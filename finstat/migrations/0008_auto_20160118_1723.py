# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finstat', '0007_auto_20150329_2042'),
    ]

    operations = [
        migrations.CreateModel(
            name='CurrencyRate',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, verbose_name='ID', auto_created=True)),
                ('date', models.DateField(verbose_name='rate actualization date')),
                ('currency_code', models.CharField(choices=[('RUB', 'Russian rouble'), ('AED', 'UAE Dihram'), ('AFN', 'Afgan Afgani'), ('ALL', 'Albanian Lek'), ('AMD', 'Armenian Dram'), ('ANG', 'Netherlands Antillean Guilder'), ('AOA', 'Angolan Kwanza'), ('ARS', 'Argentine Peso'), ('AUD', 'Australian Dollar'), ('AWG', 'Aruban Florin'), ('AZN', 'Azerbaijani Manat'), ('BAM', 'Bosnia-Herzegovina Convertible Mark'), ('BBD', 'Barbadian Dollar'), ('BDT', 'Bangladeshi Taka'), ('BGN', 'Bulgarian Lev'), ('BHD', 'Bahraini Dinar'), ('BIF', 'Burundian Franc'), ('BMD', 'Bermudan Dollar'), ('BND', 'Brunei Dollar'), ('BOB', 'Bolivian Boliviano'), ('BRL', 'Brazilian Real'), ('BSD', 'Bahamian Dollar'), ('BTC', 'Биткоин'), ('BTN', 'Bhutanese Ngultrum'), ('BWP', 'Botswanan Pula'), ('BYR', 'Belarusian Ruble'), ('BZD', 'Belize Dollar'), ('CAD', 'Canadian Dollar'), ('CDF', 'Congolese Franc'), ('CHF', 'Swiss Franc'), ('CLF', 'Chilean Unit of Account (UF)'), ('CLP', 'Chilean Peso'), ('CNY', 'Chinese Yuan'), ('COP', 'Colombian Peso'), ('CRC', 'Costa Rican Colón'), ('CUP', 'Cuban Peso'), ('CVE', 'Cape Verdean Escudo'), ('CZK', 'Czech Republic Koruna'), ('DJF', 'Djiboutian Franc'), ('DKK', 'Danish Krone'), ('DOP', 'Dominican Peso'), ('DZD', 'Algerian Dinar'), ('EEK', 'Estonian Kroon'), ('EGP', 'Egyptian Pound'), ('ERN', 'Eritrean Nakfa'), ('ETB', 'Ethiopian Birr'), ('EUR', 'Евро'), ('FJD', 'Fijian Dollar'), ('FKP', 'Falkland Islands Pound'), ('GBP', 'British Pound Sterling'), ('GEL', 'Georgian Lari'), ('GGP', 'Guernsey Pound'), ('GHS', 'Ghanaian Cedi'), ('GIP', 'Gibraltar Pound'), ('GMD', 'Gambian Dalasi'), ('GNF', 'Guinean Franc'), ('GTQ', 'Guatemalan Quetzal'), ('GYD', 'Guyanaese Dollar'), ('HKD', 'Hong Kong Dollar'), ('HNL', 'Honduran Lempira'), ('HRK', 'Croatian Kuna'), ('HTG', 'Haitian Gourde'), ('HUF', 'Hungarian Forint'), ('IDR', 'Indonesian Rupiah'), ('ILS', 'Israeli New Sheqel'), ('IMP', 'Manx pound'), ('INR', 'Indian Rupee'), ('IQD', 'Iraqi Dinar'), ('IRR', 'Iranian Rial'), ('ISK', 'Icelandic Króna'), ('JEP', 'Jersey Pound'), ('JMD', 'Jamaican Dollar'), ('JOD', 'Jordanian Dinar'), ('JPY', 'Japanese Yen'), ('KES', 'Kenyan Shilling'), ('KGS', 'Kyrgystani Som'), ('KHR', 'Cambodian Riel'), ('KMF', 'Comorian Franc'), ('KPW', 'North Korean Won'), ('KRW', 'South Korean Won'), ('KWD', 'Kuwaiti Dinar'), ('KYD', 'Cayman Islands Dollar'), ('KZT', 'Kazakhstani Tenge'), ('LAK', 'Laotian Kip'), ('LBP', 'Lebanese Pound'), ('LKR', 'Sri Lankan Rupee'), ('LRD', 'Liberian Dollar'), ('LSL', 'Lesotho Loti'), ('LTL', 'Lithuanian Litas'), ('LVL', 'Latvian Lats'), ('LYD', 'Libyan Dinar'), ('MAD', 'Moroccan Dirham'), ('MDL', 'Moldovan Leu'), ('MGA', 'Malagasy Ariary'), ('MKD', 'Macedonian Denar'), ('MMK', 'Myanma Kyat'), ('MNT', 'Mongolian Tugrik'), ('MOP', 'Macanese Pataca'), ('MRO', 'Mauritanian Ouguiya'), ('MTL', 'Maltese Lira'), ('MUR', 'Mauritian Rupee'), ('MVR', 'Maldivian Rufiyaa'), ('MWK', 'Malawian Kwacha'), ('MXN', 'Mexican Peso'), ('MYR', 'Malaysian Ringgit'), ('MZN', 'Mozambican Metical'), ('NAD', 'Namibian Dollar'), ('NGN', 'Nigerian Naira'), ('NIO', 'Nicaraguan Córdoba'), ('NOK', 'Norwegian Krone'), ('NPR', 'Nepalese Rupee'), ('NZD', 'New Zealand Dollar'), ('OMR', 'Omani Rial'), ('PAB', 'Panamanian Balboa'), ('PEN', 'Peruvian Nuevo Sol'), ('PGK', 'Papua New Guinean Kina'), ('PHP', 'Philippine Peso'), ('PKR', 'Pakistani Rupee'), ('PLN', 'Polish Zloty'), ('PYG', 'Paraguayan Guarani'), ('QAR', 'Qatari Rial'), ('RON', 'Romanian Leu'), ('RSD', 'Serbian Dinar'), ('RWF', 'Rwandan Franc'), ('SAR', 'Saudi Riyal'), ('SBD', 'Solomon Islands Dollar'), ('SCR', 'Seychellois Rupee'), ('SDG', 'Sudanese Pound'), ('SEK', 'Swedish Krona'), ('SGD', 'Singapore Dollar'), ('SHP', 'Saint Helena Pound'), ('SLL', 'Sierra Leonean Leone'), ('SOS', 'Somali Shilling'), ('SRD', 'Surinamese Dollar'), ('STD', 'São Tomé and Príncipe Dobra'), ('SVC', 'Salvadoran Colón'), ('SYP', 'Syrian Pound'), ('SZL', 'Swazi Lilangeni'), ('THB', 'Thai Baht'), ('TJS', 'Tajikistani Somoni'), ('TMT', 'Turkmenistani Manat'), ('TND', 'Tunisian Dinar'), ('TOP', 'Tongan Paʻanga'), ('TRY', 'Turkish Lira'), ('TTD', 'Trinidad and Tobago Dollar'), ('TWD', 'New Taiwan Dollar'), ('TZS', 'Tanzanian Shilling'), ('UAH', 'Ukrainian Hryvnia'), ('UGX', 'Ugandan Shilling'), ('USD', 'Американский доллар'), ('UYU', 'Uruguayan Peso'), ('UZS', 'Uzbekistan Som'), ('VEF', 'Venezuelan Bolívar Fuerte'), ('VND', 'Vietnamese Dong'), ('VUV', 'Vanuatu Vatu'), ('WST', 'Samoan Tala'), ('XAF', 'CFA Franc BEAC'), ('XAG', 'Silver (troy ounce)'), ('XAU', 'Gold (troy ounce)'), ('XCD', 'East Caribbean Dollar'), ('XDR', 'Special Drawing Rights'), ('XOF', 'CFA Franc BCEAO'), ('XPF', 'CFP Franc'), ('YER', 'Yemeni Rial'), ('ZAR', 'South African Rand'), ('ZMK', 'Zambian Kwacha (pre-2013)'), ('ZMW', 'Zambian Kwacha'), ('ZWL', 'Zimbabwean Dollar')], max_length=3)),
                ('rate', models.FloatField()),
                ('currency_rate_to', models.CharField(choices=[('RUB', 'Russian rouble'), ('AED', 'UAE Dihram'), ('AFN', 'Afgan Afgani'), ('ALL', 'Albanian Lek'), ('AMD', 'Armenian Dram'), ('ANG', 'Netherlands Antillean Guilder'), ('AOA', 'Angolan Kwanza'), ('ARS', 'Argentine Peso'), ('AUD', 'Australian Dollar'), ('AWG', 'Aruban Florin'), ('AZN', 'Azerbaijani Manat'), ('BAM', 'Bosnia-Herzegovina Convertible Mark'), ('BBD', 'Barbadian Dollar'), ('BDT', 'Bangladeshi Taka'), ('BGN', 'Bulgarian Lev'), ('BHD', 'Bahraini Dinar'), ('BIF', 'Burundian Franc'), ('BMD', 'Bermudan Dollar'), ('BND', 'Brunei Dollar'), ('BOB', 'Bolivian Boliviano'), ('BRL', 'Brazilian Real'), ('BSD', 'Bahamian Dollar'), ('BTC', 'Биткоин'), ('BTN', 'Bhutanese Ngultrum'), ('BWP', 'Botswanan Pula'), ('BYR', 'Belarusian Ruble'), ('BZD', 'Belize Dollar'), ('CAD', 'Canadian Dollar'), ('CDF', 'Congolese Franc'), ('CHF', 'Swiss Franc'), ('CLF', 'Chilean Unit of Account (UF)'), ('CLP', 'Chilean Peso'), ('CNY', 'Chinese Yuan'), ('COP', 'Colombian Peso'), ('CRC', 'Costa Rican Colón'), ('CUP', 'Cuban Peso'), ('CVE', 'Cape Verdean Escudo'), ('CZK', 'Czech Republic Koruna'), ('DJF', 'Djiboutian Franc'), ('DKK', 'Danish Krone'), ('DOP', 'Dominican Peso'), ('DZD', 'Algerian Dinar'), ('EEK', 'Estonian Kroon'), ('EGP', 'Egyptian Pound'), ('ERN', 'Eritrean Nakfa'), ('ETB', 'Ethiopian Birr'), ('EUR', 'Евро'), ('FJD', 'Fijian Dollar'), ('FKP', 'Falkland Islands Pound'), ('GBP', 'British Pound Sterling'), ('GEL', 'Georgian Lari'), ('GGP', 'Guernsey Pound'), ('GHS', 'Ghanaian Cedi'), ('GIP', 'Gibraltar Pound'), ('GMD', 'Gambian Dalasi'), ('GNF', 'Guinean Franc'), ('GTQ', 'Guatemalan Quetzal'), ('GYD', 'Guyanaese Dollar'), ('HKD', 'Hong Kong Dollar'), ('HNL', 'Honduran Lempira'), ('HRK', 'Croatian Kuna'), ('HTG', 'Haitian Gourde'), ('HUF', 'Hungarian Forint'), ('IDR', 'Indonesian Rupiah'), ('ILS', 'Israeli New Sheqel'), ('IMP', 'Manx pound'), ('INR', 'Indian Rupee'), ('IQD', 'Iraqi Dinar'), ('IRR', 'Iranian Rial'), ('ISK', 'Icelandic Króna'), ('JEP', 'Jersey Pound'), ('JMD', 'Jamaican Dollar'), ('JOD', 'Jordanian Dinar'), ('JPY', 'Japanese Yen'), ('KES', 'Kenyan Shilling'), ('KGS', 'Kyrgystani Som'), ('KHR', 'Cambodian Riel'), ('KMF', 'Comorian Franc'), ('KPW', 'North Korean Won'), ('KRW', 'South Korean Won'), ('KWD', 'Kuwaiti Dinar'), ('KYD', 'Cayman Islands Dollar'), ('KZT', 'Kazakhstani Tenge'), ('LAK', 'Laotian Kip'), ('LBP', 'Lebanese Pound'), ('LKR', 'Sri Lankan Rupee'), ('LRD', 'Liberian Dollar'), ('LSL', 'Lesotho Loti'), ('LTL', 'Lithuanian Litas'), ('LVL', 'Latvian Lats'), ('LYD', 'Libyan Dinar'), ('MAD', 'Moroccan Dirham'), ('MDL', 'Moldovan Leu'), ('MGA', 'Malagasy Ariary'), ('MKD', 'Macedonian Denar'), ('MMK', 'Myanma Kyat'), ('MNT', 'Mongolian Tugrik'), ('MOP', 'Macanese Pataca'), ('MRO', 'Mauritanian Ouguiya'), ('MTL', 'Maltese Lira'), ('MUR', 'Mauritian Rupee'), ('MVR', 'Maldivian Rufiyaa'), ('MWK', 'Malawian Kwacha'), ('MXN', 'Mexican Peso'), ('MYR', 'Malaysian Ringgit'), ('MZN', 'Mozambican Metical'), ('NAD', 'Namibian Dollar'), ('NGN', 'Nigerian Naira'), ('NIO', 'Nicaraguan Córdoba'), ('NOK', 'Norwegian Krone'), ('NPR', 'Nepalese Rupee'), ('NZD', 'New Zealand Dollar'), ('OMR', 'Omani Rial'), ('PAB', 'Panamanian Balboa'), ('PEN', 'Peruvian Nuevo Sol'), ('PGK', 'Papua New Guinean Kina'), ('PHP', 'Philippine Peso'), ('PKR', 'Pakistani Rupee'), ('PLN', 'Polish Zloty'), ('PYG', 'Paraguayan Guarani'), ('QAR', 'Qatari Rial'), ('RON', 'Romanian Leu'), ('RSD', 'Serbian Dinar'), ('RWF', 'Rwandan Franc'), ('SAR', 'Saudi Riyal'), ('SBD', 'Solomon Islands Dollar'), ('SCR', 'Seychellois Rupee'), ('SDG', 'Sudanese Pound'), ('SEK', 'Swedish Krona'), ('SGD', 'Singapore Dollar'), ('SHP', 'Saint Helena Pound'), ('SLL', 'Sierra Leonean Leone'), ('SOS', 'Somali Shilling'), ('SRD', 'Surinamese Dollar'), ('STD', 'São Tomé and Príncipe Dobra'), ('SVC', 'Salvadoran Colón'), ('SYP', 'Syrian Pound'), ('SZL', 'Swazi Lilangeni'), ('THB', 'Thai Baht'), ('TJS', 'Tajikistani Somoni'), ('TMT', 'Turkmenistani Manat'), ('TND', 'Tunisian Dinar'), ('TOP', 'Tongan Paʻanga'), ('TRY', 'Turkish Lira'), ('TTD', 'Trinidad and Tobago Dollar'), ('TWD', 'New Taiwan Dollar'), ('TZS', 'Tanzanian Shilling'), ('UAH', 'Ukrainian Hryvnia'), ('UGX', 'Ugandan Shilling'), ('USD', 'Американский доллар'), ('UYU', 'Uruguayan Peso'), ('UZS', 'Uzbekistan Som'), ('VEF', 'Venezuelan Bolívar Fuerte'), ('VND', 'Vietnamese Dong'), ('VUV', 'Vanuatu Vatu'), ('WST', 'Samoan Tala'), ('XAF', 'CFA Franc BEAC'), ('XAG', 'Silver (troy ounce)'), ('XAU', 'Gold (troy ounce)'), ('XCD', 'East Caribbean Dollar'), ('XDR', 'Special Drawing Rights'), ('XOF', 'CFA Franc BCEAO'), ('XPF', 'CFP Franc'), ('YER', 'Yemeni Rial'), ('ZAR', 'South African Rand'), ('ZMK', 'Zambian Kwacha (pre-2013)'), ('ZMW', 'Zambian Kwacha'), ('ZWL', 'Zimbabwean Dollar')], default='RUB', max_length=3)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, verbose_name='ID', auto_created=True)),
                ('definition', models.CharField(unique=True, max_length=250)),
                ('shortening', models.CharField(unique=True, max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='TagTransactionLink',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, verbose_name='ID', auto_created=True)),
                ('fk_tag', models.ForeignKey(to='finstat.Tag')),
            ],
        ),
        migrations.RemoveField(
            model_name='splitpart',
            name='fk_category',
        ),
        migrations.RemoveField(
            model_name='splitpart',
            name='fk_transaction',
        ),
        migrations.RemoveField(
            model_name='category',
            name='category_type',
        ),
        migrations.AddField(
            model_name='category',
            name='direction',
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AddField(
            model_name='category',
            name='node',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='category',
            name='parent_id',
            field=models.ForeignKey(null=True, to='finstat.Category'),
        ),
        migrations.AddField(
            model_name='transaction',
            name='amount',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='transaction',
            name='comment',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='transaction',
            name='fk_category',
            field=models.ForeignKey(blank=True, null=True, to='finstat.Category'),
        ),
        migrations.AlterField(
            model_name='account',
            name='account_name',
            field=models.CharField(unique=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='account',
            name='account_type',
            field=models.CharField(choices=[('OW', 'Personal account'), ('GR', 'Family account'), ('DE', 'Debt account'), ('DP', 'Deposit'), ('CR', 'Credit'), ('CC', 'Credit card'), ('DC', 'Debit card'), ('BS', 'Company account'), ('BO', 'Bounce account')], default='OW', max_length=2),
        ),
        migrations.AlterField(
            model_name='account',
            name='comment',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='account',
            name='currency',
            field=models.CharField(choices=[('RUB', 'Russian rouble'), ('AED', 'UAE Dihram'), ('AFN', 'Afgan Afgani'), ('ALL', 'Albanian Lek'), ('AMD', 'Armenian Dram'), ('ANG', 'Netherlands Antillean Guilder'), ('AOA', 'Angolan Kwanza'), ('ARS', 'Argentine Peso'), ('AUD', 'Australian Dollar'), ('AWG', 'Aruban Florin'), ('AZN', 'Azerbaijani Manat'), ('BAM', 'Bosnia-Herzegovina Convertible Mark'), ('BBD', 'Barbadian Dollar'), ('BDT', 'Bangladeshi Taka'), ('BGN', 'Bulgarian Lev'), ('BHD', 'Bahraini Dinar'), ('BIF', 'Burundian Franc'), ('BMD', 'Bermudan Dollar'), ('BND', 'Brunei Dollar'), ('BOB', 'Bolivian Boliviano'), ('BRL', 'Brazilian Real'), ('BSD', 'Bahamian Dollar'), ('BTC', 'Биткоин'), ('BTN', 'Bhutanese Ngultrum'), ('BWP', 'Botswanan Pula'), ('BYR', 'Belarusian Ruble'), ('BZD', 'Belize Dollar'), ('CAD', 'Canadian Dollar'), ('CDF', 'Congolese Franc'), ('CHF', 'Swiss Franc'), ('CLF', 'Chilean Unit of Account (UF)'), ('CLP', 'Chilean Peso'), ('CNY', 'Chinese Yuan'), ('COP', 'Colombian Peso'), ('CRC', 'Costa Rican Colón'), ('CUP', 'Cuban Peso'), ('CVE', 'Cape Verdean Escudo'), ('CZK', 'Czech Republic Koruna'), ('DJF', 'Djiboutian Franc'), ('DKK', 'Danish Krone'), ('DOP', 'Dominican Peso'), ('DZD', 'Algerian Dinar'), ('EEK', 'Estonian Kroon'), ('EGP', 'Egyptian Pound'), ('ERN', 'Eritrean Nakfa'), ('ETB', 'Ethiopian Birr'), ('EUR', 'Евро'), ('FJD', 'Fijian Dollar'), ('FKP', 'Falkland Islands Pound'), ('GBP', 'British Pound Sterling'), ('GEL', 'Georgian Lari'), ('GGP', 'Guernsey Pound'), ('GHS', 'Ghanaian Cedi'), ('GIP', 'Gibraltar Pound'), ('GMD', 'Gambian Dalasi'), ('GNF', 'Guinean Franc'), ('GTQ', 'Guatemalan Quetzal'), ('GYD', 'Guyanaese Dollar'), ('HKD', 'Hong Kong Dollar'), ('HNL', 'Honduran Lempira'), ('HRK', 'Croatian Kuna'), ('HTG', 'Haitian Gourde'), ('HUF', 'Hungarian Forint'), ('IDR', 'Indonesian Rupiah'), ('ILS', 'Israeli New Sheqel'), ('IMP', 'Manx pound'), ('INR', 'Indian Rupee'), ('IQD', 'Iraqi Dinar'), ('IRR', 'Iranian Rial'), ('ISK', 'Icelandic Króna'), ('JEP', 'Jersey Pound'), ('JMD', 'Jamaican Dollar'), ('JOD', 'Jordanian Dinar'), ('JPY', 'Japanese Yen'), ('KES', 'Kenyan Shilling'), ('KGS', 'Kyrgystani Som'), ('KHR', 'Cambodian Riel'), ('KMF', 'Comorian Franc'), ('KPW', 'North Korean Won'), ('KRW', 'South Korean Won'), ('KWD', 'Kuwaiti Dinar'), ('KYD', 'Cayman Islands Dollar'), ('KZT', 'Kazakhstani Tenge'), ('LAK', 'Laotian Kip'), ('LBP', 'Lebanese Pound'), ('LKR', 'Sri Lankan Rupee'), ('LRD', 'Liberian Dollar'), ('LSL', 'Lesotho Loti'), ('LTL', 'Lithuanian Litas'), ('LVL', 'Latvian Lats'), ('LYD', 'Libyan Dinar'), ('MAD', 'Moroccan Dirham'), ('MDL', 'Moldovan Leu'), ('MGA', 'Malagasy Ariary'), ('MKD', 'Macedonian Denar'), ('MMK', 'Myanma Kyat'), ('MNT', 'Mongolian Tugrik'), ('MOP', 'Macanese Pataca'), ('MRO', 'Mauritanian Ouguiya'), ('MTL', 'Maltese Lira'), ('MUR', 'Mauritian Rupee'), ('MVR', 'Maldivian Rufiyaa'), ('MWK', 'Malawian Kwacha'), ('MXN', 'Mexican Peso'), ('MYR', 'Malaysian Ringgit'), ('MZN', 'Mozambican Metical'), ('NAD', 'Namibian Dollar'), ('NGN', 'Nigerian Naira'), ('NIO', 'Nicaraguan Córdoba'), ('NOK', 'Norwegian Krone'), ('NPR', 'Nepalese Rupee'), ('NZD', 'New Zealand Dollar'), ('OMR', 'Omani Rial'), ('PAB', 'Panamanian Balboa'), ('PEN', 'Peruvian Nuevo Sol'), ('PGK', 'Papua New Guinean Kina'), ('PHP', 'Philippine Peso'), ('PKR', 'Pakistani Rupee'), ('PLN', 'Polish Zloty'), ('PYG', 'Paraguayan Guarani'), ('QAR', 'Qatari Rial'), ('RON', 'Romanian Leu'), ('RSD', 'Serbian Dinar'), ('RWF', 'Rwandan Franc'), ('SAR', 'Saudi Riyal'), ('SBD', 'Solomon Islands Dollar'), ('SCR', 'Seychellois Rupee'), ('SDG', 'Sudanese Pound'), ('SEK', 'Swedish Krona'), ('SGD', 'Singapore Dollar'), ('SHP', 'Saint Helena Pound'), ('SLL', 'Sierra Leonean Leone'), ('SOS', 'Somali Shilling'), ('SRD', 'Surinamese Dollar'), ('STD', 'São Tomé and Príncipe Dobra'), ('SVC', 'Salvadoran Colón'), ('SYP', 'Syrian Pound'), ('SZL', 'Swazi Lilangeni'), ('THB', 'Thai Baht'), ('TJS', 'Tajikistani Somoni'), ('TMT', 'Turkmenistani Manat'), ('TND', 'Tunisian Dinar'), ('TOP', 'Tongan Paʻanga'), ('TRY', 'Turkish Lira'), ('TTD', 'Trinidad and Tobago Dollar'), ('TWD', 'New Taiwan Dollar'), ('TZS', 'Tanzanian Shilling'), ('UAH', 'Ukrainian Hryvnia'), ('UGX', 'Ugandan Shilling'), ('USD', 'Американский доллар'), ('UYU', 'Uruguayan Peso'), ('UZS', 'Uzbekistan Som'), ('VEF', 'Venezuelan Bolívar Fuerte'), ('VND', 'Vietnamese Dong'), ('VUV', 'Vanuatu Vatu'), ('WST', 'Samoan Tala'), ('XAF', 'CFA Franc BEAC'), ('XAG', 'Silver (troy ounce)'), ('XAU', 'Gold (troy ounce)'), ('XCD', 'East Caribbean Dollar'), ('XDR', 'Special Drawing Rights'), ('XOF', 'CFA Franc BCEAO'), ('XPF', 'CFP Franc'), ('YER', 'Yemeni Rial'), ('ZAR', 'South African Rand'), ('ZMK', 'Zambian Kwacha (pre-2013)'), ('ZMW', 'Zambian Kwacha'), ('ZWL', 'Zimbabwean Dollar')], default='RUB', max_length=3),
        ),
        migrations.AlterField(
            model_name='performer',
            name='default_currency',
            field=models.CharField(choices=[('RUB', 'Russian rouble'), ('AED', 'UAE Dihram'), ('AFN', 'Afgan Afgani'), ('ALL', 'Albanian Lek'), ('AMD', 'Armenian Dram'), ('ANG', 'Netherlands Antillean Guilder'), ('AOA', 'Angolan Kwanza'), ('ARS', 'Argentine Peso'), ('AUD', 'Australian Dollar'), ('AWG', 'Aruban Florin'), ('AZN', 'Azerbaijani Manat'), ('BAM', 'Bosnia-Herzegovina Convertible Mark'), ('BBD', 'Barbadian Dollar'), ('BDT', 'Bangladeshi Taka'), ('BGN', 'Bulgarian Lev'), ('BHD', 'Bahraini Dinar'), ('BIF', 'Burundian Franc'), ('BMD', 'Bermudan Dollar'), ('BND', 'Brunei Dollar'), ('BOB', 'Bolivian Boliviano'), ('BRL', 'Brazilian Real'), ('BSD', 'Bahamian Dollar'), ('BTC', 'Биткоин'), ('BTN', 'Bhutanese Ngultrum'), ('BWP', 'Botswanan Pula'), ('BYR', 'Belarusian Ruble'), ('BZD', 'Belize Dollar'), ('CAD', 'Canadian Dollar'), ('CDF', 'Congolese Franc'), ('CHF', 'Swiss Franc'), ('CLF', 'Chilean Unit of Account (UF)'), ('CLP', 'Chilean Peso'), ('CNY', 'Chinese Yuan'), ('COP', 'Colombian Peso'), ('CRC', 'Costa Rican Colón'), ('CUP', 'Cuban Peso'), ('CVE', 'Cape Verdean Escudo'), ('CZK', 'Czech Republic Koruna'), ('DJF', 'Djiboutian Franc'), ('DKK', 'Danish Krone'), ('DOP', 'Dominican Peso'), ('DZD', 'Algerian Dinar'), ('EEK', 'Estonian Kroon'), ('EGP', 'Egyptian Pound'), ('ERN', 'Eritrean Nakfa'), ('ETB', 'Ethiopian Birr'), ('EUR', 'Евро'), ('FJD', 'Fijian Dollar'), ('FKP', 'Falkland Islands Pound'), ('GBP', 'British Pound Sterling'), ('GEL', 'Georgian Lari'), ('GGP', 'Guernsey Pound'), ('GHS', 'Ghanaian Cedi'), ('GIP', 'Gibraltar Pound'), ('GMD', 'Gambian Dalasi'), ('GNF', 'Guinean Franc'), ('GTQ', 'Guatemalan Quetzal'), ('GYD', 'Guyanaese Dollar'), ('HKD', 'Hong Kong Dollar'), ('HNL', 'Honduran Lempira'), ('HRK', 'Croatian Kuna'), ('HTG', 'Haitian Gourde'), ('HUF', 'Hungarian Forint'), ('IDR', 'Indonesian Rupiah'), ('ILS', 'Israeli New Sheqel'), ('IMP', 'Manx pound'), ('INR', 'Indian Rupee'), ('IQD', 'Iraqi Dinar'), ('IRR', 'Iranian Rial'), ('ISK', 'Icelandic Króna'), ('JEP', 'Jersey Pound'), ('JMD', 'Jamaican Dollar'), ('JOD', 'Jordanian Dinar'), ('JPY', 'Japanese Yen'), ('KES', 'Kenyan Shilling'), ('KGS', 'Kyrgystani Som'), ('KHR', 'Cambodian Riel'), ('KMF', 'Comorian Franc'), ('KPW', 'North Korean Won'), ('KRW', 'South Korean Won'), ('KWD', 'Kuwaiti Dinar'), ('KYD', 'Cayman Islands Dollar'), ('KZT', 'Kazakhstani Tenge'), ('LAK', 'Laotian Kip'), ('LBP', 'Lebanese Pound'), ('LKR', 'Sri Lankan Rupee'), ('LRD', 'Liberian Dollar'), ('LSL', 'Lesotho Loti'), ('LTL', 'Lithuanian Litas'), ('LVL', 'Latvian Lats'), ('LYD', 'Libyan Dinar'), ('MAD', 'Moroccan Dirham'), ('MDL', 'Moldovan Leu'), ('MGA', 'Malagasy Ariary'), ('MKD', 'Macedonian Denar'), ('MMK', 'Myanma Kyat'), ('MNT', 'Mongolian Tugrik'), ('MOP', 'Macanese Pataca'), ('MRO', 'Mauritanian Ouguiya'), ('MTL', 'Maltese Lira'), ('MUR', 'Mauritian Rupee'), ('MVR', 'Maldivian Rufiyaa'), ('MWK', 'Malawian Kwacha'), ('MXN', 'Mexican Peso'), ('MYR', 'Malaysian Ringgit'), ('MZN', 'Mozambican Metical'), ('NAD', 'Namibian Dollar'), ('NGN', 'Nigerian Naira'), ('NIO', 'Nicaraguan Córdoba'), ('NOK', 'Norwegian Krone'), ('NPR', 'Nepalese Rupee'), ('NZD', 'New Zealand Dollar'), ('OMR', 'Omani Rial'), ('PAB', 'Panamanian Balboa'), ('PEN', 'Peruvian Nuevo Sol'), ('PGK', 'Papua New Guinean Kina'), ('PHP', 'Philippine Peso'), ('PKR', 'Pakistani Rupee'), ('PLN', 'Polish Zloty'), ('PYG', 'Paraguayan Guarani'), ('QAR', 'Qatari Rial'), ('RON', 'Romanian Leu'), ('RSD', 'Serbian Dinar'), ('RWF', 'Rwandan Franc'), ('SAR', 'Saudi Riyal'), ('SBD', 'Solomon Islands Dollar'), ('SCR', 'Seychellois Rupee'), ('SDG', 'Sudanese Pound'), ('SEK', 'Swedish Krona'), ('SGD', 'Singapore Dollar'), ('SHP', 'Saint Helena Pound'), ('SLL', 'Sierra Leonean Leone'), ('SOS', 'Somali Shilling'), ('SRD', 'Surinamese Dollar'), ('STD', 'São Tomé and Príncipe Dobra'), ('SVC', 'Salvadoran Colón'), ('SYP', 'Syrian Pound'), ('SZL', 'Swazi Lilangeni'), ('THB', 'Thai Baht'), ('TJS', 'Tajikistani Somoni'), ('TMT', 'Turkmenistani Manat'), ('TND', 'Tunisian Dinar'), ('TOP', 'Tongan Paʻanga'), ('TRY', 'Turkish Lira'), ('TTD', 'Trinidad and Tobago Dollar'), ('TWD', 'New Taiwan Dollar'), ('TZS', 'Tanzanian Shilling'), ('UAH', 'Ukrainian Hryvnia'), ('UGX', 'Ugandan Shilling'), ('USD', 'Американский доллар'), ('UYU', 'Uruguayan Peso'), ('UZS', 'Uzbekistan Som'), ('VEF', 'Venezuelan Bolívar Fuerte'), ('VND', 'Vietnamese Dong'), ('VUV', 'Vanuatu Vatu'), ('WST', 'Samoan Tala'), ('XAF', 'CFA Franc BEAC'), ('XAG', 'Silver (troy ounce)'), ('XAU', 'Gold (troy ounce)'), ('XCD', 'East Caribbean Dollar'), ('XDR', 'Special Drawing Rights'), ('XOF', 'CFA Franc BCEAO'), ('XPF', 'CFP Franc'), ('YER', 'Yemeni Rial'), ('ZAR', 'South African Rand'), ('ZMK', 'Zambian Kwacha (pre-2013)'), ('ZMW', 'Zambian Kwacha'), ('ZWL', 'Zimbabwean Dollar')], default='RUB', max_length=3),
        ),
        migrations.AlterField(
            model_name='place',
            name='lat',
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name='place',
            name='lng',
            field=models.FloatField(null=True),
        ),
        migrations.DeleteModel(
            name='SplitPart',
        ),
        migrations.AddField(
            model_name='tagtransactionlink',
            name='fk_transaction',
            field=models.ForeignKey(to='finstat.Transaction'),
        ),
    ]
