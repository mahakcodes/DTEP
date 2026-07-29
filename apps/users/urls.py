from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import CustomTokenObtainPairView, RegisterView, UserProfileView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='users-register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='users-login'),
    path('profile/', UserProfileView.as_view(), name='users-profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='users-token-refresh'),
]
