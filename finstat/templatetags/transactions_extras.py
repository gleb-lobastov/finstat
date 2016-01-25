from django import template

register = template.Library()


@register.inclusion_tag('finstat/controls/bar.html')
def bar(item):
    return {'item': item}
