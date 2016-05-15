from rest_framework import status, permissions, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from finstat.models import Transaction, Performer
from finstat.serializers import TransactionSerializer


class TransactionsList(generics.ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = (permissions.AllowAny,)

    def _append_performer(self, serializer):
        serializer.save(author=Performer.objects.get(oo_performer=self.request.user.id).id)

    def perform_create(self, serializer):
        self._append_performer(serializer)

    def perform_update(self, serializer):
        self._append_performer(serializer)

@api_view(['GET', 'POST'])
@permission_classes((permissions.AllowAny,))
def transactions_list(request):
    """
    List all transactions, or create a new one.
    """
    if request.method == 'GET':
        tasks = Transaction.objects.all()
        serializer = TransactionSerializer(tasks, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TransactionSerializer(data=request.DATA)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes((permissions.AllowAny,))
def transactions_item(request, pk):
    """
    Get, udpate, or delete a specific task
    """
    try:
        task = Transaction.objects.get(pk=pk)
    except Transaction.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TransactionSerializer(task)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TransactionSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)