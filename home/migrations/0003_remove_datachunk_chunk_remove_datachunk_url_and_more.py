# Generated by Django 4.2.7 on 2023-11-14 07:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0002_alter_datachunk_chunk'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='datachunk',
            name='chunk',
        ),
        migrations.RemoveField(
            model_name='datachunk',
            name='url',
        ),
        migrations.AddField(
            model_name='datachunk',
            name='vector_DB',
            field=models.BinaryField(),
            preserve_default=False,
        ),
    ]
