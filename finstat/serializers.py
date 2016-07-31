from rest_framework import serializers
from finstat import models


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Transaction
        fields = (
            'id', 'date', 'amount', 'comment',
            'fk_account_from', 'fk_account_to', 'fk_category', 'fk_performer',
            'transaction_type'
        )

    fk_performer = serializers.ReadOnlyField(source='fk_performer.id')
    transaction_type = serializers.ReadOnlyField()


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

    fk_owner = serializers.ReadOnlyField(source='fk_owner.id')


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
