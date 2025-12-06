from django.db import models


class TipoUsuario(models.Model):
    id_tipo_usuario = models.AutoField(primary_key=True)
    nombre_tipo = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre_tipo


class TipoSensor(models.Model):
    id_tipo_sensor = models.AutoField(primary_key=True)
    nombre_tipo = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre_tipo


class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    tipo_usuario = models.ForeignKey(
        TipoUsuario, on_delete=models.SET_NULL, null=True
    )

    def __str__(self):
        return f"{self.nombre} {self.apellido}"


class Administrador(models.Model):
    id_admin = models.AutoField(primary_key=True)
    nivel_acceso = models.IntegerField(default=1)
    usuario = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name='administradores'
    )

    def __str__(self):
        return f"Admin {self.usuario}"


class Institucion(models.Model):
    id_institucion = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=150)
    direccion = models.CharField(max_length=250)
    logo = models.CharField(max_length=255)
    color = models.CharField(max_length=20)
    admin = models.ForeignKey(
        Administrador, on_delete=models.SET_NULL, null=True,
        related_name='instituciones'
    )

    def __str__(self):
        return self.nombre


class Estacion(models.Model):
    ESTADOS_CHOICES = [
        ('activa', 'Activa'),
        ('mantenimiento', 'En mantenimiento'),
        ('inactiva', 'Inactiva'),
    ]

    id_estacion = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=150)
    estado = models.CharField(
        max_length=20, choices=ESTADOS_CHOICES, default='activa'
    )
    longitud = models.FloatField()
    latitud = models.FloatField()
    institucion = models.ForeignKey(
        Institucion, on_delete=models.CASCADE, related_name='estaciones'
    )
    admin = models.ForeignKey(
        Administrador, on_delete=models.SET_NULL, null=True,
        related_name='estaciones'
    )

    def __str__(self):
        return self.nombre


class Sensor(models.Model):
    id_sensor = models.AutoField(primary_key=True)
    fecha_calibracion = models.DateField()
    responsable_tecnico = models.CharField(max_length=150)
    estacion = models.ForeignKey(
        Estacion, on_delete=models.CASCADE, related_name='sensores'
    )
    tipo_sensor = models.ForeignKey(
        TipoSensor, on_delete=models.CASCADE, related_name='sensores'
    )

    def __str__(self):
        return f"{self.tipo_sensor} - {self.estacion}"


class Medicion(models.Model):
    """
    Mediciones por día para soporte de 'seleccionar días'
    (Segunda entrega: crear estaciones, buscar, filtrar, seleccionar días). 
    """
    id_medicion = models.AutoField(primary_key=True)
    estacion = models.ForeignKey(
        Estacion, on_delete=models.CASCADE, related_name='mediciones'
    )
    fecha = models.DateField()
    pm25 = models.FloatField(null=True, blank=True)
    pm10 = models.FloatField(null=True, blank=True)
    so2 = models.FloatField(null=True, blank=True)
    no2 = models.FloatField(null=True, blank=True)
    o3 = models.FloatField(null=True, blank=True)
    co = models.FloatField(null=True, blank=True)
    temperatura = models.FloatField(null=True, blank=True)
    humedad = models.FloatField(null=True, blank=True)
    velocidad_viento = models.FloatField(null=True, blank=True)

    class Meta:
        ordering = ['-fecha']
        unique_together = ('estacion', 'fecha')

    def __str__(self):
        return f"{self.estacion} - {self.fecha}"


class Alerta(models.Model):
    id_alerta = models.AutoField(primary_key=True)
    nivel = models.CharField(max_length=50)
    mensaje = models.TextField()
    fecha_emision = models.DateField()
    estacion = models.ForeignKey(
        Estacion, on_delete=models.CASCADE, related_name='alertas'
    )

    def __str__(self):
        return f"{self.nivel} - {self.estacion.nombre}"


class Consulta(models.Model):
    usuario = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name='consultas'
    )
    estacion = models.ForeignKey(
        Estacion, on_delete=models.CASCADE, related_name='consultas'
    )
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-fecha']

    def __str__(self):
        return f"{self.usuario} -> {self.estacion} ({self.fecha})"
