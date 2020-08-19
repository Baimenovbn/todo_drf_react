from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .models import Task
from .serializers import TaskSerializer

from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(['GET'])
def index(request):
    api_urls = {
        'List': '/task-list/',
        'Detail View': '/task-detail/<int:id>/',
        'Create': '/task-create/',
        'Update': '/task-update/<int:id>/',
        'Delete': '/task-delete/<int:id>/',
    }

    return Response(api_urls)


@api_view(['GET'])
def task_list(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)

    return Response(serializer.data)


@csrf_exempt
@api_view(['POST'])
def task_create(request):
    serializer = TaskSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response('Task has been created successfully')


@api_view(['GET'])
def task_detail(request, id):
    task = Task.objects.get(id=id)
    serializer = TaskSerializer(task)

    return Response(serializer.data)


@csrf_exempt
@api_view(['POST'])
def task_update(request, id):
    new_task = request.data
    old_task = Task.objects.get(id=id)
    message = 'There have been some error'

    serializer = TaskSerializer(data=new_task, instance=old_task)

    if serializer.is_valid():
        serializer.save()
        message = 'Task has been updated successfully'

    
    return Response(message)


@csrf_exempt
@api_view(['DELETE'])
def task_delete(request, id):
    task = Task.objects.get(id=id)
    task.delete()

    return Response('Task has been deleted successfully')
