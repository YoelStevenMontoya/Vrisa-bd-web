from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    RegisterUserView,
    InstitucionViewSet,
    EstacionViewSet,
    MedicionViewSet,
    AlertaViewSet,
)

router = DefaultRouter()
router.register(r'instituciones', InstitucionViewSet)
router.register(r'estaciones', EstacionViewSet)
router.register(r'mediciones', MedicionViewSet)
router.register(r'alertas', AlertaViewSet)

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register_user'),
]

urlpatterns += router.urls
