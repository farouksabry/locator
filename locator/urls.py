from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('where_to_find.urls')),
    path('', lambda request: HttpResponse("Backend is running 🚀")),
]
