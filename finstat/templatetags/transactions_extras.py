# from django import template
# from finstat.views import transactions_list

# register = template.Library()


# @register.inclusion_tag('finstat/controls/bar.html')
# def bar(index, item):
#     return {'index': index, 'item': item}
#
#
# @register.inclusion_tag('finstat/transactions/timeline.html')
# def load_page(page, page_size):
#     return transactions_list(page=page, page_size=page_size)