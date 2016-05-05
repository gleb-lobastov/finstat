from django import forms
from finstat.models import Transaction


class DateInput(forms.DateInput):
    input_type = 'date'


class TransactionForm(forms.ModelForm):
    class Meta:
        model = Transaction
        fields = ['date', 'amount', 'fk_account_from', 'fk_account_to', 'fk_category', 'fk_performer', 'comment']
        labels = {
            'date': 'Дата',
            'amount': 'Сумма',
            'fk_account_from': 'Счет списания',
            'fk_account_to': 'Счет зачисления',
            'fk_category': 'Категория',
            'comment': 'Комментарий'
        }
        widgets = {
            'date': DateInput(attrs={'class': 'form-control'}),
        }
