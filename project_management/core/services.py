from .models import User, Project, Task

def create_user(data):
    user = User.objects.create(**data)
    return user

def create_project(data):
    project = Project.objects.create(**data)
    return project

def create_task(data):
    task = Task.objects.create(**data)
    return task
