from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Institucion, Estacion, Medicion, Alerta
)


class InstitucionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institucion
        fields = '__all__'


class EstacionSerializer(serializers.ModelSerializer):
    institucion_nombre = serializers.ReadOnlyField(source='institucion.nombre')

    class Meta:
        model = Estacion
        fields = [
            'id_estacion',
            'nombre',
            'estado',
            'longitud',
            'latitud',
            'institucion',
            'institucion_nombre',
        ]


class MedicionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicion
        fields = '__all__'


class AlertaSerializer(serializers.ModelSerializer):
    estacion_nombre = serializers.ReadOnlyField(source='estacion.nombre')

    class Meta:
        model = Alerta
        fields = '__all__'

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )
        return user
