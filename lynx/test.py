def Hello(request):
	''' Register '''
	form = RegistrationForm()
	if request.method == 'POST':
		form = RegistrationForm(request.POST)
		if '@' not in request.POST['username']: # TODO already exists
			email_not_valid = "This is not a valid email address"
			return render(request, "hello.html",{"form" : form, "email_not_valid" : email_not_valid,})
		elif form.is_valid():
			new_user = User.objects.create_user(username=request.POST['username'],password=request.POST['password'])
			return HttpResponseRedirect("/dashboard/")
		return render(request, "hello.html",{"form" : form})
	else: # request 'GET'
		return render(request, "hello.html",{"form" : form})

@login_required(redirect_field_name=None) # get rid of /next/ stuff in url when not logged in
def Dashboard(request):
	return render(request, "dashboard.html",)