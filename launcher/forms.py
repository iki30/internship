from django import forms

from launcher.models import Project


class ProjectForm(forms.Form):
    project = forms.ModelChoiceField(queryset=Project.objects.all())


class CreateProjectForm(forms.Form):
    title = forms.CharField(max_length=127)
    description = forms.CharField(max_length=127)
