from rest_framework import serializers
from finstat import models


class TransactionSerializer(serializers.ModelSerializer):

    # period = serializers.SerializerMethodField('get_date')

    class Meta:
        model = models.Transaction
        fields = ('date', 'amount', 'comment', 'fk_account_from', 'fk_account_to', 'fk_category', 'fk_performer')

    # def get_date(self, obj):
    #     return obj.date


class TransactionSerializerPartial(serializers.Serializer):
    id = serializers.IntegerField()
    date = serializers.DateField()
    category = serializers.CharField()
    comment = serializers.CharField()
    fk_account_from = serializers.IntegerField()
    fk_account_to = serializers.IntegerField()
    income = serializers.IntegerField()
    outcome = serializers.IntegerField()


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Account

