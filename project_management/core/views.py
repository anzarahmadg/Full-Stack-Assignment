from rest_framework import viewsets
from .models import User, Project, Task
from .serializers import UserSerializer, ProjectSerializer, TaskSerializer
from .services import create_user, create_project, create_task
from rest_framework_jwt.views import ObtainJSONWebToken
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
