#ssh -p 25001 eimantas@95.85.34.87
#gunicorn_django --bind localhost:8001
from django.conf import settings
from django.shortcuts import render, render_to_response
from django import forms
from lynx.models import Lecture, Topic, Summary, Subject
from django.http import HttpResponse
from django.forms.models import modelformset_factory
from django.forms.formsets import formset_factory;
from django.shortcuts import get_object_or_404
from django.views.generic.base import View
from django.views.generic.edit import UpdateView

import json
from django.utils import simplejson
from django.core.serializers.json import DjangoJSONEncoder
from django.utils import formats
import datetime


from django.forms.models import modelformset_factory
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
#from django.contrib.auth.models import User
from lynx.forms import TopicForm, SummaryForm, CustomUserCreationForm
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.template import Context
from django.core.urlresolvers import reverse
from django.contrib.auth.views import password_reset, password_reset_confirm
from django.contrib.auth import get_user_model
from django.contrib.sites.models import Site
from django.db import transaction, connection

import os



def Hello(request):
	''' Register '''
	form = CustomUserCreationForm() #this
	if request.method == 'POST':
		User = get_user_model() # my custom model
		form = CustomUserCreationForm(request.POST) # vs this
		email = request.POST['email']
		password = request.POST['password']
		if form.is_valid():
			if "@" in request.POST['email']:
				new_user = User.objects.create_user(email=request.POST['email'],password=request.POST['password'])
				new_user = authenticate(email=email, password=password)
				login(request, new_user)
				return HttpResponseRedirect('/dashboard/')
			else:
				not_valid_email = "* This is not a valid email address"
				return render(request, "hello.html",{"form" : form, "not_valid_email" : not_valid_email})
		else: # form not valid
			#return HttpResponse("form not valid")
			return render(request, "hello.html",{"form" : form})
	else: # request 'GET'
		return render(request, "hello.html",{"form" : form})


@login_required(redirect_field_name=None)
def Dashboard(request):
	user = request.user
	email = user.email
	subjectCount = user.subject_set.count()
	subjects = user.subject_set.all().order_by('-date')
	topics = user.topic_set.all().order_by('-date')
	current_site = Site.objects.get_current()
	domain = current_site.domain
	return render(request, "dashboard.html",{"email" : email, "subjectCount" : subjectCount, "subjects" : subjects, "topics" : topics, "user" : user, "domain" : domain,})
	

def Login(request):
	form = CustomUserCreationForm() # for reg.
	if request.method == 'POST':
		User = get_user_model() # custom user model
		email = request.POST['email']
		password = request.POST['password']
		User = authenticate(email=email, password=password)
		if User is not None: # TODO: inactive (disabled) users
			login(request, User)
			return HttpResponseRedirect("/dashboard/")
		else:
			invalid_credentials = "* Invalid username or password"
			return render(request, "hello.html",{"invalid_credentials" : invalid_credentials, "form" : form,})
	else:
		return render(request, "hello.html",{"form" : form})


@login_required(redirect_field_name=None)
def Logout(request):
	logout(request)
	return HttpResponseRedirect("/")



@login_required(redirect_field_name=None)
def App(request, slug):
	current_site = Site.objects.get_current()
	domain = current_site.domain
	User = get_user_model() # custom user
	user = request.user
	lectures = user.lecture_set.all().count()
	subject = Subject.objects.get(user=request.user, slug=slug) # from url
	subjects = Subject.objects.filter(user=request.user)
	topics = Topic.objects.filter(subject = subject.pk).order_by('date')
	topicCount = Topic.objects.filter(subject = subject.pk).count()
	summaries = Summary.objects.filter(subject = subject.pk).order_by('date')
	subject_list = []
	for x in subjects:
		subject_list.append(x.title.lower()) # slugs are all lowercased
	TopicFormSet = modelformset_factory(Topic, form=TopicForm, extra=0, fields=('name',), can_delete=False)
	SummaryFormSet = modelformset_factory(Summary, form=SummaryForm, extra=0, fields=('content',), can_delete=False)
	tquery = user.topic_set.all().order_by('date')
	squery = user.summary_set.all().order_by('date')
	t_formset = TopicFormSet(queryset = topics)
	s_formset = SummaryFormSet(queryset = summaries)
	zipped = zip(t_formset.forms, s_formset.forms)
	zipped2 = zip(topics, summaries)
	return render (request, "app.html", {"lectures" : lectures, "zipped" : zipped, "t_formset" : t_formset, "s_formset" : s_formset, "tquery" : tquery, "squery" : squery,   "subject_list" : subject_list, "slug" : slug, "topics" : topics, "topicCount" : topicCount, "domain" : domain, "subject" : subject, "zipped2" : zipped2})


@login_required(redirect_field_name=None)
def New_subject(request):
	User = get_user_model() # custom user
	user = request.user
	new_subject = Subject(title = request.POST['subject_title'], user = user)
	new_subject.save()
	topic = Topic(user = user, subject = new_subject, name = "Your first topic")
	topic.save()
	summary = Summary(user = user, subject = new_subject, topic = topic, content = "This is your very first Summary. In Lynx, Topics and Summaries are saved automatically, so you don't have to worry about that.")
	summary.save()
	return HttpResponseRedirect("/dashboard/")

@login_required(redirect_field_name=None)
def Remove_subject(request, id):
	User = get_user_model() # custom user
	user = request.user
	subject = Subject.objects.get(user = user, pk=id)
	subject.delete()
	subjectCount = user.subject_set.count()
	return render(request, "dashboard.html") # not p. ?



@login_required(redirect_field_name=None)
def Update_subject(request, id): # dashboard
	User = get_user_model() # custom user
	user = request.user
	subject = Subject.objects.get(user = user, pk=id)
	subject_title = request.POST['value']
	subject.title = subject_title
	subject.save()
	return HttpResponse(subject) # 4 testing only

@login_required(redirect_field_name=None)
def Update_topic(request, id): # dashboard
	User = get_user_model() # custom user
	user = request.user
	topic = Topic.objects.get(user = user, pk=id)
	topic_name = request.POST['value']
	topic.name = topic_name
	topic.save()
	return HttpResponse("ok") # 4 testing only

@login_required(redirect_field_name=None)
def Subject_count(request):
	user = request.user
	subjectCount = user.subject_set.count()
	return HttpResponse(simplejson.dumps(subjectCount), mimetype='application/json')

@login_required(redirect_field_name=None)
def Topic_count(request, slug):
	user = request.user
	slug = slug
	subject = Subject.objects.get(user=request.user, slug=slug)
	topicCount = int(Topic.objects.filter(user = user, subject = subject).count())
	if request.is_ajax(): # todo: veikia ir be sito?
		response = HttpResponse(simplejson.dumps({'topicCount': topicCount}),mimetype='application/json')
		response['Access-Control-Allow-Origin'] = "*"
		return response
	elif request.method == "OPTIONS":
		response = HttpResponse("")
		response['Access-Control-Allow-Origin'] = "*"
		response['Access-Control-Allow-Methods'] = "POST, OPTIONS"
		response['Access-Control-Allow-Headers'] = "X-Requested-With"
		response['Access-Control-Max-Age'] = "1800"
	else:
		return HttpResponseBadRequest()



@login_required(redirect_field_name=None)
def New_dynamic(request, slug): # create new DYNAMIC Topic and Summary 'in background'
	User = get_user_model() # custom user
	user = request.user
	subject = Subject.objects.get(user=request.user, slug=slug)
	if request.is_ajax():
		topic = Topic(subject = subject, user = user, name = "New topic")
		topic.save()
		summary = Summary(subject = subject, user = user, topic = topic, content = "New summary")
		summary.save()
		topicCount = Topic.objects.filter(user = user, subject = subject).count()
		# date serialization
		topicDate = datetime.datetime.now()
		serialized_datetime = formats.date_format(topicDate, 'DATETIME_FORMAT')
		data = json.dumps({'dynamic_topic_id': topic.id, 'dynamic_summary_id': summary.id, "topicCount" : topicCount, "topicDate" : topicDate, "serialized_datetime" : serialized_datetime}, cls=DjangoJSONEncoder)
	else:
		return HttpResponseRedirect("/dashboard/") # not possible?
	return HttpResponse(data, mimetype='application/json')





@login_required(redirect_field_name=None)
def Save_topic(request, slug, id):
	User = get_user_model() # custom user
	user = request.user
	subject = Subject.objects.get(user = user, slug = slug)
	topic = Topic.objects.get(user = user, subject = subject, pk = id)

	if request.method == 'POST' and request.is_ajax():
		topic.name = request.POST['Topic']
		topic.save()
		return HttpResponse('Saved static topic') # 4 testing only


@login_required(redirect_field_name=None)
def Save_summary(request, slug, id):
	User = get_user_model() # custom user
	user = request.user
	subject = Subject.objects.get(user = user, slug = slug)
	summary = Summary.objects.get(user = user, subject = subject, pk = id)

	if request.method == 'POST' and request.is_ajax():
		summary.content = request.POST['Summary']
		summary.save()
		return HttpResponse('Saved static summary') # 4 testing only




@login_required(redirect_field_name=None)
def Remove_summary(request, id):
	summary = Summary.objects.get(pk=id)
	summary.content = "Start summarizing lecture here . . ." # TODO: exc. from search
	summary.save()
	return render (request, "app.html",)


@login_required(redirect_field_name=None)
def Remove_topic(request, slug, id):
	# from App view:
	TopicFormSet = modelformset_factory(Topic, extra=0, can_delete=True)
	SummaryFormSet = modelformset_factory(Summary, extra=0, can_delete=True)
	subject = Subject.objects.get(user=request.user, slug=slug)
	tquery = Topic.objects.filter(user = request.user, subject = subject).order_by('date')
	squery = Summary.objects.filter(user = request.user, subject = subject).order_by('date')
	t_formset = TopicFormSet(queryset = tquery)
	s_formset = SummaryFormSet(queryset = squery)
	zipped = zip(t_formset.forms, s_formset.forms)

	# PK stuff:
	pk_list = []
	for x,y in zipped:
		pk_list.append(x.instance.pk)
		pk_list.append(y.instance.pk)

	# Merging summaries:
	topic = Topic.objects.get(pk=id)
	topicPk = topic.pk
	summary = Summary.objects.get(topic = topic)
	topicPkIndex = pk_list.index(topicPk)
	previousSummaryPk = pk_list[topicPkIndex - 1]
	previousSummary = Summary.objects.get(pk = previousSummaryPk)
	previousSummary.content = previousSummary.content + "\n" + summary.content
	previousSummary.save()

	#  TODO: warning?
	topic.delete()
	summary.delete()

	# Ajax stuff
	topicCount = Topic.objects.filter(user = request.user, subject = subject).count()
	if request.is_ajax():
		json = simplejson.dumps({'topicCount': topicCount})
		return HttpResponse(json, mimetype='application/json')
	else:
		return HttpResponseRedirect('/dashboard/')




