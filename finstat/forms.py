from django import forms
from finstat.models import Transaction


class TransactionForm(forms.ModelForm):
    class Meta:
        model = Transaction
        exclude = ['fk_place']
