from django import forms
from finstat.models import Transaction


class DateInput(forms.DateInput):
    input_type = 'date'


class TransactionForm(forms.ModelForm):
    class Meta:
        model = Transaction
        fields = ['date', 'amount', 'fk_account_from', 'fk_account_to', 'fk_category', 'comment', 'fk_performer']
        labels = {
            'date': 'Дата',
            'amount': 'Сумма',
            'fk_account_from': 'Счет списания',
            'fk_account_to': 'Счет зачисления',
            'fk_category': 'Категория',
            'comment': 'Комментарий'
        }
        widgets = {
            'date': forms.DateInput(),
            'amount': forms.NumberInput(),
            'fk_account_from': forms.Select(attrs={'class': "ext__chosen"}),
            'fk_account_to': forms.Select(attrs={'class': "ext__chosen"}),
            'fk_category': forms.Select(attrs={'class': "ext__chosen"}),
            'fk_performer': forms.HiddenInput()
        }

    comment = forms.CharField(label='Коммент')
