from django.contrib import admin
from finstat.models import Performer, Account, Category, Transaction


class TransactionInLine(admin.TabularInline):
    model = Transaction
    extra = 1


class PerformerAdmin(admin.ModelAdmin):
    inlines = [TransactionInLine]


class TransactionAdmin(admin.ModelAdmin):
    list_display = ('fk_performer', 'fk_place', 'date', 'fk_account_from', 'fk_account_to')
    # list_filter = ('account_name','account_type')


class AccountAdmin(admin.ModelAdmin):
    list_display = ('account_name', 'account_type', 'currency', 'fk_owner')
    list_filter = ('account_type',)
    search_fields = ['account_name']


admin.site.register(Performer, PerformerAdmin)
admin.site.register(Account, AccountAdmin)
admin.site.register(Category)
admin.site.register(Transaction, TransactionAdmin)