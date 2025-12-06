from django.utils.dateparse import parse_date
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import generics

from .serializers import UserRegisterSerializer


from .models import (
    Institucion,
    Estacion,
    Medicion,
    Alerta,
    Consulta,
    Usuario,
    Administrador,
)

from .serializers import (
    InstitucionSerializer,
    EstacionSerializer,
    MedicionSerializer,
    AlertaSerializer,
)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        "instituciones": reverse('institucion-list', request=request, format=format),
        "estaciones": reverse('estacion-list', request=request, format=format),
        "mediciones": reverse('medicion-list', request=request, format=format),
        "alertas": reverse('alerta-list', request=request, format=format),
    })



class InstitucionViewSet(viewsets.ModelViewSet):
    queryset = Institucion.objects.all()
    serializer_class = InstitucionSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        admin = None

        if self.request.user.is_authenticated:
            usuario, _ = Usuario.objects.get_or_create(
                nombre=self.request.user.username,
                apellido=self.request.user.last_name or "",
            )
            admin, _ = Administrador.objects.get_or_create(usuario=usuario)

        serializer.save(admin=admin)



class EstacionViewSet(viewsets.ModelViewSet):
    queryset = Estacion.objects.all().select_related('institucion')
    serializer_class = EstacionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        nombre = self.request.query_params.get('nombre')
        estado = self.request.query_params.get('estado')
        institucion_id = self.request.query_params.get('institucion')

        if nombre:
            qs = qs.filter(nombre__icontains=nombre)
        if estado:
            qs = qs.filter(estado=estado)
        if institucion_id:
            qs = qs.filter(institucion_id=institucion_id)

        return qs

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        estacion = self.get_object()
        usuario = Usuario.objects.first()
        if usuario:
            Consulta.objects.create(usuario=usuario, estacion=estacion)
        return response

    @action(detail=True, methods=['get'])
    def mediciones(self, request, pk=None):
        estacion = self.get_object()
        fecha_str = request.query_params.get('fecha')
        mediciones = estacion.mediciones.all()
        if fecha_str:
            fecha = parse_date(fecha_str)
            if fecha:
                mediciones = mediciones.filter(fecha=fecha)
        serializer = MedicionSerializer(mediciones, many=True)
        return Response(serializer.data)


class MedicionViewSet(viewsets.ModelViewSet):
    queryset = Medicion.objects.all().order_by("-fecha")
    serializer_class = MedicionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ["estacion", "fecha"]

    def get_queryset(self):
        qs = super().get_queryset()
        estacion_id = self.request.query_params.get('estacion')
        fecha_str = self.request.query_params.get('fecha')

        if estacion_id:
            qs = qs.filter(estacion_id=estacion_id)
        if fecha_str:
            fecha = parse_date(fecha_str)
            if fecha:
                qs = qs.filter(fecha=fecha)
        return qs


class AlertaViewSet(viewsets.ModelViewSet):
    queryset = Alerta.objects.all().select_related('estacion')
    serializer_class = AlertaSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        estacion_id = self.request.query_params.get('estacion')
        if estacion_id:
            qs = qs.filter(estacion_id=estacion_id)
        return qs
    
class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]

