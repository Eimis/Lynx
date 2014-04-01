from django import forms
from lynx.models import Topic
from lynx.models import Summary
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
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

class RegistrationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'password1')

    def __init__(self, *args, **kwargs):
        super(RegistrationForm, self).__init__(*args, **kwargs)
        for fieldname in ['username', 'password1']:
            self.fields[fieldname].help_text = None
        self.fields['username'].widget = forms.TextInput(attrs={ 'class': 'usernameInput', 'rows' : '1', 'placeholder' : 'awesome@jack.com' })
        self.fields['password1'].widget = forms.PasswordInput(attrs={ 'class': 'passwordInput', 'rows' : '1', 'placeholder' : 'your secret magic key' })
        self.error_messages['duplicate_username'] = 'Email already exists'
        self.fields['username'].error_messages["required"] = "Please enter your email address"
        self.fields['password1'].error_messages["required"] = "Please enter your password"

        del self.fields['password2']


      