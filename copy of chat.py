import webapp2, time, datetime
from google.appengine.ext import ndb
from google.appengine.ext import db

default_msg_name = "automatic"

class Message(ndb.Model):
	author = ndb.StringProperty(indexed = False)
	content = ndb.StringProperty(indexed = False)
	date = ndb.DateTimeProperty(auto_now_add = True)

def msg_key(msg_name = default_msg_name):
	return ndb.Key("Message", msg_name)

class Redirect(webapp2.RequestHandler):

	def get(self):

		self.redirect("main/index.html", permanent = True);

class MainPage(webapp2.RequestHandler):

	def get(self):

		msg_name = self.request.get("server", default_msg_name)

		messages_query = Message.query(ancestor = msg_key(msg_name)).order(-Message.date)
		messages = messages_query.fetch(50)

		self.response.write('''<!doctype html><html><head>
			<title>Narawa Games Chat | Room %s</title>
			<meta charset="UTF-8">
			<link rel="stylesheet" href="chat.css">
			<link rel="stylesheet" type="text/css" href="/jquery-ui-chat/jquery-ui.min.css">
			<link rel="stylesheet" type="text/css" href="/jquery-ui-chat/jquery-ui.structure.min.css">
			<link rel="stylesheet" type="text/css" href="/jquery-ui-chat/jquery-ui.theme.min.css">
			<script type="text/javascript" src="//code.jquery.com/jquery-2.1.1.min.js"></script>
			<script type="text/javascript" src="//code.jquery.com/ui/1.11.1/jquery-ui.js"></script>
			<script type="text/javascript" src="chat.js"></script>
			</head>''' % msg_name)
		self.response.write('''<body onload='setup()' id='body'><script>
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		  ga('create', 'UA-46623054-1', 'auto');
		  ga('send', 'pageview');
		</script><div id='msgs'>''')
		self.response.write('''<header><button onclick="$('#dialog')[0].style.display='block';">Switch Room</button><h1>Chat Room %s</h1></header><form method='get' action='/chat' id="dialog">There are multiple rooms in Narawa Games Chat. Only people who are in the same room can chat together. <hr>Switch to chat room...<br><input type='text' name='server' value='%s'><br><input type='submit' value='Switch Room'></form>
			''' % (msg_name, msg_name))
		self.response.write('''
								<div id="formpost">
									<form action="/post" method="post">
									<input type="hidden" id="idenserv" name="server" style="display: none" value="''' + str(msg_name) + '''">
									Username <input type="text" name="name" value="''' + self.request.get("user", "Type in a username...") + '''"><br>
									<div id="topper">
										<textarea name="message" rows="1">Type a new chat message to send...</textarea>
									</div>
									<input type="submit" value="Send Message">
									</form>
								</div>
							<section id='messagearea'>
							''')
		for msgentry in messages:
			retrieve = Message(parent = msg_key(msg_name))
			if unicode(msgentry.date)[8:10] != unicode(datetime.datetime.now())[8:10]:
				msgentry.key.delete()

			self.response.write("<div class='comment'><span class='msgname'>%s</span><div class='mcont'>%s</div></div>" % (str(msgentry.author), str(msgentry.content)))
		self.response.write('''</section></div></body></html>''')

class MessagePost(webapp2.RequestHandler):

	def post(self):

		msg_name = self.request.get("server", default_msg_name)

		if (len(str(msg_name))==0):
			msg_name="automatic";

		poster = self.request.get("message")
		posted = poster.lower()
		if (not "fuk" in posted and not "fuc" in posted and not "shit" in posted and not "dam" in posted and not "nigga" in posted and not "yolo" in posted and not "ass" in posted and \
			not "fu-k" in posted and not "fu-c" in posted and not "sh*t" in posted and not "danm" in posted and not "crap" in posted and not "krap" in posted and not "fu*k" in posted and not "f*ck" in posted and not "f-k" in posted and \
			not "idiot" in posted and not "moron" in posted and not "retard" in posted and not "doofus" in posted and not "suck" in posted and not "hate" in posted and \
			not "penis" in posted and not "pen15" in posted and not "nigger" in posted and not "niger" in posted and not "pen-is" in posted and not "dick" in posted and not "dik" in posted and \
			not "boob" in posted and not "niple" in posted and not "nipple" in posted and not "breast" in posted and  not "brest" in posted and not "sex" in posted and not "porn" in posted and not "vag" in posted and \
			not "hot girl" in posted and not "anus" in posted and not "clitoris" in posted and not "naked" in posted):
			message = Message(parent = msg_key(msg_name))
			message.author = self.request.get("name")
			message.content = poster
			message.put()
			self.redirect("/chat?server="+msg_name+"&user="+self.request.get("name"))

		else:
			self.redirect("/lockdown.html")

class ReturnMsg(webapp2.RequestHandler):

	def get(self):

		server_name = self.request.get("server", default_msg_name)

		newmsgs = Message.query(ancestor = msg_key(server_name)).order(-Message.date)
		newmsg = newmsgs.fetch(5)
		returnlist = []

		for stuff in newmsg:
			data = str(stuff.content)
			name = str(stuff.author)
			time = str(stuff.date)[11:19]

			returnlist.append('''"''' + data + "~" + name + "`" + time + '''"''')

		self.response.out.write(", ".join(returnlist))

application = webapp2.WSGIApplication([
	("/", Redirect),
	("/chat", MainPage),
	("/post", MessagePost),
	("/ajax", ReturnMsg),
], debug = True)