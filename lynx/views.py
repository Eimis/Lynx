from django.shortcuts import render, render_to_response
from django import forms
from lynx.models import Lecture, Topic, Summary
from django.http import HttpResponse
from django.forms.models import modelformset_factory
from django.forms.formsets import formset_factory;
from django.shortcuts import get_object_or_404
from django.views.generic.base import View
from django.views.generic.edit import UpdateView
import json
from django.forms.models import modelformset_factory
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.contrib.auth.models import User
from lynx.forms import RegistrationForm, TopicForm, SummaryForm
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required




def Hello(request):
	''' Register '''
	form = RegistrationForm() #this
	if request.method == 'POST':
		form = RegistrationForm(request.POST) # vs this
		if form.is_valid():
			if "@" in request.POST['username']:
				new_user = User.objects.create_user(username=request.POST['username'],password=request.POST['password1'])
				return HttpResponseRedirect("/dashboard/")
			else:
				not_valid_email = "* This is not a valid email address"
				return render(request, "hello.html",{"form" : form, "not_valid_email" : not_valid_email})
		else: # form not valid
			return render(request, "hello.html",{"form" : form})
	else: # request 'GET'
		return render(request, "hello.html",{"form" : form})

@login_required(redirect_field_name=None) # get rid of /next/ stuff in url when not logged in
def Dashboard(request):
	return render(request, "dashboard.html",)

@login_required(redirect_field_name=None) # .get rid of /next/ stuff in url when not logged in
def Dashboard(request):
	return render(request, "dashboard.html",)
	

def Login(request):
	form = RegistrationForm() # for reg.
	if request.method == 'POST':
	    username = request.POST['username']
	    password = request.POST['password']
	    user = authenticate(username=username, password=password)
	    if user is not None:
	        if user.is_active:
	            login(request, user)
	            return HttpResponseRedirect("/dashboard/")
	        else:
	            return HttpResponse("User is inactive")
	    else:
	    	invalid_credentials = "* Invalid username or password"
	        return render(request, "hello.html",{"invalid_credentials" : invalid_credentials, "form" : form,})
	else:
		return render(request, "hello.html")


@login_required(redirect_field_name=None)
def Logout(request):
	logout(request)
	return HttpResponseRedirect("/")

@login_required(redirect_field_name=None)
def App(request):
	lectures = Lecture.objects.all()
	TopicFormSet = modelformset_factory(Topic, form=TopicForm, extra=0, can_delete=False)
	SummaryFormSet = modelformset_factory(Summary, form=SummaryForm, extra=0, can_delete=False)
	tquery = Topic.objects.all().order_by('date')
	squery = Summary.objects.all().order_by('date')
	zipped2 = zip(tquery,squery)
	topicNumber = Topic.objects.count()
	
	# saving formsets:
	if request.method == 'POST' and request.is_ajax():
		t_formset = TopicFormSet(request.POST)
		s_formset = SummaryFormSet(request.POST) # formset instances. Apkeisti ???
		if t_formset.is_valid() and s_formset.is_valid():
			t_formset.save() and s_formset.save()
			#  Saving them with new data.
			#  BUG #1: neina issaugoti vien tik summary, reikia pakeisti ir topic...
			#  SOLUTION?: http://stackoverflow.com/questions/13745343/django-formsets-confusion-validation-required-empty-permitted
			#  BUG # 2: Kai istrini tik summary / topic, neina issaugoti nieko (skiriasi formu id headeryje). Dropdb padeda.
			zipped = zip(t_formset.forms, s_formset.forms) # saving them with new data
			pk_list = {}
			for x,y in zipped:
				pk_list[x.instance.pk] = y.instance.pk
			
		else:
			return HttpResponse("not valid formsets, dude") # for testing purposes
	else: # request=GET
		t_formset = TopicFormSet(queryset = tquery)
		s_formset = SummaryFormSet(queryset = squery)
		zipped = zip(t_formset.forms, s_formset.forms)
		# 4 testing:
		pk_list = []
		for x,y in zipped:
			pk_list.append(x.instance.pk)
			pk_list.append(y.instance.pk)
	return render (request, "app.html", {"lectures" : lectures, "zipped" : zipped, "t_formset" : t_formset, "s_formset" : s_formset, "tquery" : tquery, "squery" : squery, "pk_list" : pk_list, "topicNumber" : topicNumber, })


@login_required(redirect_field_name=None)
def New(request):
	if request.method == 'POST' and request.is_ajax():
		jsondata = request.read()
		json_data = json.loads(jsondata)
		new_topic = json_data["name"]
		new_summary = json_data["content"]
		topic = Topic(name = new_topic)
		summary = Summary(content = new_summary)
		topic.save()
		summary.save()
	else:
		return HttpResponse("Something's wrong") # not possible?
	return HttpResponse("You shouldn't see this")


@login_required(redirect_field_name=None)
def Remove_summary(request, id):
	summary = Summary.objects.get(pk=id)
	summary.content = "The lecturer is talking about something else? You can start summarizing current topic here." # TODO: exc. from search
	summary.save()
	return render (request, "app.html",)


@login_required(redirect_field_name=None)
def Remove_topic(request, id):
	# from App view:
	TopicFormSet = modelformset_factory(Topic, extra=0, can_delete=False)
	SummaryFormSet = modelformset_factory(Summary, extra=0)
	tquery = Topic.objects.all().order_by('date')
	squery = Summary.objects.all().order_by('date')
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
	summary = Summary.objects.get(pk = topicPk)
	topicPkIndex = pk_list.index(topicPk)
	previousSummaryPk = pk_list[topicPkIndex - 1]
	previousSummary = Summary.objects.get(pk = previousSummaryPk)
	previousSummary.content = previousSummary.content + "\n" + summary.content
	previousSummary.save()

	#  TODO: warning
	topic.delete()
	summary.delete()
	return render (request, "app.html", {"pk_list" : pk_list})


