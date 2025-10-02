from django.contrib import admin
from .models import User, Post, Comment

class PostAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at',)

class CommentAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at',)

# Register your models here.
admin.site.register(User)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)
