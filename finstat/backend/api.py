from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from finstat import models
from finstat.backend import serializers
from finstat.backend import queries


class AccountList(generics.ListCreateAPIView):
    queryset = models.Account.objects.all()
    serializer_class = serializers.AccountSerializer
    permission_classes = (permissions.AllowAny,)
    pagination_class = None

    def perform_create(self, serializer):
        serializer.save(fk_owner=models.Performer.objects.get(oo_performer=self.request.user.id or 1))


class CategoryList(generics.ListCreateAPIView):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer
    permission_classes = (permissions.AllowAny,)
    pagination_class = None


class TransactionMixin(object):
    queryset = models.Transaction.objects.each()
    serializer_class = serializers.TransactionSerializer
    permission_classes = (permissions.AllowAny,)
    # permission_classes = (IsOwnerOrReadOnly,)

    def perform_create(self, serializer):
        serializer.save(fk_performer=models.Performer.objects.get(oo_performer=self.request.user.id or 1))


class TransactionList(TransactionMixin, generics.ListCreateAPIView):
    pass


class TransactionDetail(TransactionMixin, generics.RetrieveUpdateDestroyAPIView):
    pass


class TransactionGroups(generics.ListAPIView):
    serializer_class = serializers.TransactionGroupSerializer

    def get_queryset(self):
        interval = self.kwargs['interval']
        return models.Transaction.objects.group_by(models.Interval(interval))


@api_view(['GET'])
@permission_classes((permissions.AllowAny, ))
def accounting(request):
    ids = request.GET.getlist('id[]', None)
    result = [
        {'date': row.pop('date'), 'spread': row} for row in queries.accumulations(list(ids))
    ] if ids else []
    response = Response(result, status=status.HTTP_200_OK)
    return response
