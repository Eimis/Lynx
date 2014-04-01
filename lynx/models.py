from django.db import models
from lynx import settings
from django.forms import ModelForm
from django import forms



class BaseModel(models.Model):
## Abstract base classes are useful when you want to put some common information into a number of other models.
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)

    class Meta:
        abstract = True


#class Title(BaseModel): #Lecture 1, lecture 2, etc. TODO: title time
    #number = models.IntegerField("lecture number", default="1")


    #def __unicode__(self):
        #return self.number




class Topic(models.Model):
    name = models.TextField(blank=True, null=True, verbose_name=u'')
    date = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
    	return self.name

class Summary(models.Model):
    content = models.TextField(max_length=1000, blank=True, null=True, verbose_name=u'')
    date = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
    	return self.content

class Lecture(models.Model):
    topic_title = models.OneToOneField(Topic)
    summary = models.OneToOneField(Summary)





#b = Topic(name=json.loads(request.body)['name'])




# TODO: pradzioje susikonfiguruoti be join lecture summary. Paziureti kaip
# atvaizduoja, kaip iseina (ar iseina) redaguoti, search?. Paskui jau ziureti join.

# Lecture ir topic laikas turi buti atskiras. Nes dabartinis yra <Lecture> objekto kurimo laikas.
# Laikas 24h ?
# Lecture nr.
# Inline editing dalykas (merge ziureti veliau)
# Kai normaliai dirbi, laiko neuztenka...

# issiaiskint kdoel editlive neveikia
# dirbti
	

	



