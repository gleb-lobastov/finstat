from rest_framework import status, permissions, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from finstat import models, serializers


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


"""
class TransactionsList(generics.ListCreateAPIView):
    queryset = models.Transaction.objects.all()
    serializer_class = serializers.TransactionSerializer
    permission_classes = (permissions.AllowAny,)
"""
    # def _append_performer(self, serializer):
    #     serializer.save(fk_performer=Performer.objects.get(oo_performer=self.request.user.id).id)
        # pass

    # def perform_create(self, serializer):
    #     self._append_performer(serializer)
    #
    # def perform_update(self, serializer):
    #     self._append_performer(serializer)


class TransactionsListPartial(generics.ListCreateAPIView):
    queryset = models.Transaction.objects.each()
    serializer_class = serializers.TransactionSerializerPartial
    permission_classes = (permissions.AllowAny,)

"""
@api_view(['GET', 'POST'])
@permission_classes((permissions.AllowAny,))
def transactions_list(request):
    " ""
    List all transactions, or create a new one.
    " ""
    if request.method == 'GET':
        tasks = models.Transaction.objects.all()
        serializer = serializers.TransactionSerializer(tasks, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = serializers.TransactionSerializer(data=request.DATA)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes((permissions.AllowAny,))
def transactions_item(request, pk):
    " " "
    Get, udpate, or delete a specific task
    " " "
    try:
        task = models.Transaction.objects.get(pk=pk)
    except models.Transaction.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = serializers.TransactionSerializer(task)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = serializers.TransactionSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
"""