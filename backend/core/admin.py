from django.contrib import admin
from .models import (
    TipoUsuario,
    TipoSensor,
    Usuario,
    Administrador,
    Institucion,
    Estacion,
    Sensor,
    Medicion,
    Alerta,
    Consulta,
)

admin.site.register(TipoUsuario)
admin.site.register(TipoSensor)
admin.site.register(Usuario)
admin.site.register(Administrador)
admin.site.register(Institucion)
admin.site.register(Estacion)
admin.site.register(Sensor)
admin.site.register(Medicion)
admin.site.register(Alerta)
admin.site.register(Consulta)
