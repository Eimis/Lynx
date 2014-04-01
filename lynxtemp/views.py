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

def Hello(request):
	#index
	return render(request, "hello.html")

def App(request):
	lectures = Lecture.objects.all()
	TopicFormSet = modelformset_factory(Topic, extra=0)
	SummaryFormSet = modelformset_factory(Summary, extra=0)
	tquery = Topic.objects.all()
	squery = Summary.objects.all()
	#saving formsets:
	if request.method == 'POST' and request.is_ajax():
		t_formset = TopicFormSet(request.POST)
		s_formset = SummaryFormSet(request.POST) #formset instances. Apkeisti ???
		if t_formset.is_valid() and s_formset.is_valid():
			t_formset.save() and s_formset.save()
			# aving them with new data.
			# BUG: neina issaugoti vien tik summary, reikia pakeisti ir topic...
			# SOLUTION?: http://stackoverflow.com/questions/13745343/django-formsets-confusion-validation-required-empty-permitted
			zipped = zip(t_formset.forms, s_formset.forms) #saving them with new data
		else:
			return HttpResponse("not valid formsets, dude") # for testing purposes
	else: #request=GET
		t_formset = TopicFormSet(queryset = tquery)
		s_formset = SummaryFormSet(queryset = squery)
		zipped = zip(t_formset.forms, s_formset.forms)
	return render (request, "app.html", {"lectures" : lectures, "zipped" : zipped, "t_formset" : t_formset, "s_formset" : s_formset})


@csrf_protect
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
		return HttpResponse("Req not post") #not possible?
	return HttpResponse("is it ok ?")









# b = Topic(name=json.loads(request.body)['name']) - bligesnis sprendimas uz request.read()


	# Su jquery padaryti, kad idetu dvi formas. Jquery turi po to  per Ajax() kreiptis i view,
	# kuris issaugo abi formas i duombaze ir incrementina total forms ir t.t. skaicius. Kadangi nauju formu saugojimo kodas bus po
	# senu, turetu perkrovus puslapi graziai suzipinti. Bet kol useris neperkrove psl,
	# gales ramiai naujas formas pildyti.
	# Tad reikia pasirasyti jquery, kad pridedu dvi formas su initial tada (gal initial tada pridedi views'e?)
	# ir susikonnstruoti viewsa, kad jas abi issaugotu i duombaze. Visa tai pasiimti is appsu nete.