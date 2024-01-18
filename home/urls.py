from django.urls import path
from home import views

urlpatterns = [
    path('', views.ind, name='home'),
    path('urlResolver', views.urlResolver, name='urlResolver'),
    path('query', views.questionAnswer, name='questionAnswer'),
]