from unittest import TestCase
from django.core.urlresolvers import reverse, resolve


def test_paths(routes_to_test):
    for route in routes_to_test:
        path = route["url_path"]
        pattern = route["pattern_name"]
        kwparams = route.get("kwargs")

        if kwparams:
            yield reverse(pattern, kwargs=kwparams), path
        else:
            yield reverse(pattern), path

        yield resolve(path).url_name, pattern


class TestURLs(TestCase):
    def test_blog_routes(self):
        routes_to_test = (
            dict(url_path="/blogs", pattern_name="home.views.blog_list"),

            dict(url_path="/blogs/my+wonderful+blog", pattern_name="home.views.blogs_show",
                 kwargs={"slug": "my+wonderful+blog"}),
            dict(url_path="/places/my%20wonderful+blog", pattern_name="home.views.blogs_show",
                 kwargs={"slug": "my%20wonderful+blog"}),

            dict(url_path="/blogs/my+wonderful+blog/", pattern_name="home.views.blogs_show",
                 kwargs={"slug": "my+wonderful+blog/"})
        )

        for stringOne, stringTwo in test_paths(routes_to_test):
            self.assertEqual(stringOne, stringTwo)
