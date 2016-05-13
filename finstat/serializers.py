from rest_framework import serializers
from finstat.models import Transaction


class TransactionSerializer(serializers.ModelSerializer):

    # period = serializers.SerializerMethodField('get_date')

    class Meta:
        model = Transaction
        fields = ('date', 'amount', 'comment', 'fk_account_from', 'fk_account_to', 'fk_category', 'fk_performer')

    # def get_date(self, obj):
    #     return obj.date
