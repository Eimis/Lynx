from django import forms
from lynx.models import Topic
from lynx.models import Summary
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, PasswordResetForm
from django.contrib.auth.tokens import default_token_generator
from django.forms import ModelForm

class TopicForm(forms.ModelForm):
    class Meta:
        model = Topic

    def __init__(self, *args, **kwargs):
        super(TopicForm, self).__init__(*args, **kwargs)
        self.fields['name'].widget = forms.Textarea(attrs={ 'class': 'topicTextarea', 'rows': '1' })

class SummaryForm(forms.ModelForm):
    class Meta:
        model = Summary

    def __init__(self, *args, **kwargs):
        super(SummaryForm, self).__init__(*args, **kwargs)
        self.fields['content'].widget = forms.Textarea(attrs={ 'class': 'summaryTextarea', 'rows' : '1' })




# **** forms for Custom User model:

from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from lynx.models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    """
    A form that creates a user, with no privileges, from the given email and
    password.
    """

    def __init__(self, *args, **kargs):
        super(CustomUserCreationForm, self).__init__(*args, **kargs)
        self.fields['email'].widget = forms.TextInput(attrs={ 'class': 'usernameInput', 'rows' : '1', 'placeholder' : 'awesome@jack.com' })
        self.fields['password'].widget = forms.PasswordInput(attrs={ 'class': 'passwordInput', 'rows' : '1', 'placeholder' : 'your secret magic key' }) # TODO check create user via admin
        del self.fields['username']
        del self.fields['password1']
        del self.fields['password2']

    class Meta:
        model = CustomUser
        fields = ("email", "password")

class CustomUserChangeForm(UserChangeForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """

    def __init__(self, *args, **kargs):
        super(CustomUserChangeForm, self).__init__(*args, **kargs)
        del self.fields['username']

    class Meta:
        model = CustomUser
