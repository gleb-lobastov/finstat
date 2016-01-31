from django import template

register = template.Library()


@register.inclusion_tag('finstat/controls/bar.html')
def bar(index, item):
    return {'index': index, 'item': item}
