from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginAPI, UserViewSet, ProjectViewSet, TaskViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_jwt.views import refresh_jwt_token
from rest_framework_simplejwt import views as jwt_views


router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]
