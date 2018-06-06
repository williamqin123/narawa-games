#!/usr/bin/env python
import webapp2, time, datetime, cgi
from google.appengine.ext import ndb
from google.appengine.ext import db


defaultUserName = "Anonymous"
defaultRoom = "Default"


def escapeChars(stringHere):
	return stringHere.replace("&", "&amp;").replace('''"''', "&quot;").replace("'", "&apos;").replace("<", "&lt;").replace(">", "&gt;").replace("\\", "&#92;")


def getUNIX():
	return time.time()


def getDate():
	return escapeChars(unicode(datetime.datetime.now()))

def getDateTime():
	return datetime.datetime.now()

class Message(ndb.Model):
	author = ndb.StringProperty(indexed=False)
	content = ndb.StringProperty(indexed=False)
	date = ndb.StringProperty(indexed=False)
	dateObj = ndb.DateTimeProperty(auto_now_add=True)
	dateUNIX = ndb.FloatProperty(indexed=False)

class Favcount(ndb.Model):
	count = ndb.IntegerProperty(indexed=False)
	postID = ndb.StringProperty(indexed=True)


def msg_key(serverName=defaultRoom):
	return ndb.Key("Message", serverName)


def get_data(serverName):
	return Message.query(ancestor=msg_key(serverName)).order(-Message.dateObj)


def get_server(obj):
	return escapeChars(obj.request.get("server", defaultRoom))


def get_user(obj):
	return escapeChars(obj.request.get("user", defaultUserName))


class Redirect(webapp2.RequestHandler):
	def get(self):
		self.redirect("main/index.html", permanent=True)


class MainPage(webapp2.RequestHandler):
	def get(self):
		serverName = get_server(self)
		username = get_user(self)
		messageQuery = get_data(serverName)
		messages = messageQuery.fetch(30)

		if "banned" in self.request.cookies:
			if len(self.request.cookies["banned"]) > 0:
				self.redirect("chat-room/lockdown.html")

		self.response.write('''
			<!doctype html>
			<html>
			<head>
			<title>Narawa Games Chat | Room [ %s ]</title>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<meta name="description" content="Narawa Games has a free, open-source chat room! Besides playing games, Narawa Games features a live, mobile-friendly chat room for people of all ages!">
			<link href="//fonts.googleapis.com/css?family=Roboto:400,600,700" rel="stylesheet" type="text/css">
			<link rel="stylesheet" href="chat-room/chat.css">
			<link rel="stylesheet" href="library/commonCore.css">
			<script type="text/javascript" src="//code.jquery.com/jquery-latest.min.js"></script>
			<script type="text/javascript" src="chat-room/chat.js"></script>
			</head>
			''' % serverName)
		self.response.write('''
			<body id='body'>
			<script>
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
			ga('create', 'UA-46623054-1', 'auto');
			ga('send', 'pageview');
		</script><div id='msgs'>
		''')

		self.response.write('''
			<header>
			<button id="menu">Menu</button>
			<h1>Chat Room ( %s )</h1>
			</header>
			<div class="dialog" id="room">
			&ldquo;Rooms&rdquo; are places where people can chat together, sort of like rooms in real life.
			Different rooms have different people sitting in them.
			Type the name of the room you want to go to in the box.
			<form method='get' action='/chat'>
				<input type='text' name='server' value='%s' placeholder='Type the name of the room here and then click &ldquo;enter&rdquo;...'>
				<input type='submit' value='Enter'>
			</form>
			</div>
			<div class="dialog" id="user">
			You must have a username in order to chat with people. Type in the username that you want in the box.
			<form action="/chat" method="get">
			<input type="hidden" name="server" value="%s">
			<input type="text"  name="user" maxlength="30" placeholder="Type your username here...">
			<input type="submit" value="Create Username">
			</form>
			</div>
			''' % (serverName, serverName, serverName))
		self.response.write('''
							<div id="formpost">
								<form action="javascript:void(0);" method="get" id="posterfoot">
									<input type="hidden" id="idenserv" name="server" value="%s">
									<input type="hidden"  name="user" value="%s" id="usernamejq">
									<input id="mainmessage" type="text" name="message" tabindex="0" maxlength="500" placeholder="Type your message here and then click &ldquo;send&rdquo;...">
									<input type="submit" id="ajaxsend" value="Send">
								</form>
							</div>
						<section id='messagearea'>
						''' % (serverName, username))

		timeIncrement = 1
		for messageEntity in reversed(messages):
			msgTimeStamp = messageEntity.dateObj
			timeDifference = (getDateTime() - msgTimeStamp).total_seconds()
			if timeDifference >= 86400:
				messageEntity.key.delete()

			if timeDifference >= timeIncrement:
				self.response.write("<time>Timestamp: %s</time>" % msgTimeStamp)
				timeIncrement += timeDifference

			self.response.write('''<table class='comment' data-date='%s'><tr><td class="tag">
				<span class='msgname'>%s</span></td><td class="content">
				<div class='mcont'>%s</div></td></tr>
				</table>''' % (msgTimeStamp, messageEntity.author, messageEntity.content))

		if username == "Anonymous":
			self.response.write('''
							<script>
								$("#user").css("display", "block");
								$("#formpost").css("visibility", "hidden");
							</script>
							''')
		else:
			self.response.write('''<div></div>''')

		self.response.write('''
			</section>
			</div>
			<audio src="/chat-room/fart.mp3" autoplay loop preload="auto"></audio>
			</body>
			</html>
			''')


class MessagePost(webapp2.RequestHandler):
	def post(self):
		serverName = get_server(self)

		messageContent = self.request.get("message")

		message = Message(parent=msg_key(serverName))
		message.author = get_user(self)
		message.content = escapeChars(messageContent)
		message.date = getDate()
		message.dateObj = getDateTime()
		message.dateUNIX = getUNIX()
		message.put()
		self.response.out.write("success")


class ReturnMsg(webapp2.RequestHandler):
	def get(self):

		serverName = get_server(self)

		ajaxMessageQuery = get_data(serverName)
		messageList = ajaxMessageQuery.fetch(9999)
		returnList = []

		for entities in messageList:
			if entities.dateUNIX + 5 <= getUNIX():
				break

			data = entities.content
			name = entities.author
			time = entities.date

			returnList.append(
				'''"%s/*NarawaGamesDataContentSerarator*/%s/*NarawaGamesInfoNameSerarator*/%s"''' % (data, name, time))

		self.response.out.write(", ".join(returnList))


# -----------------------------------------------------------------

class HectorData(webapp2.RequestHandler):
	def get(self):
		hectorObjects3 = "[1, 2000, [window.platform, -2, 300, 1202, 59], [window.coin, 1120, 230, 70, 70]]"
		hectorObjects4 = "[1, 1600, [window.platform, -2, 300, 316, 59], [window.platform, 500, 300, 700, 59], [window.coin, 950, 230, 70, 70]]"
		hectorObjects5 = "[3, 1200, [window.platform, -2, 300, 316, 59], [window.platform, 900, 300, 300, 59], [window.coin, 700, 320, 70, 70], [window.coin, 400, 240, 70, 70], [window.coin, 950, 230, 70, 70]]"
		hectorObjects6 = hectorObjects3 + "; level=3"
		hectorObjects7 = "[4, 800, [window.platform, 10, 500, 91, 59], [window.coin, 150, 400, 70, 70], [window.coin, 300, 300, 70, 70], [window.coin, 450, 200, 70, 70], [window.platform, 600, 200, 136, 30], [window.platform, 600, 500, 600, 30], [window.coin, 800, 430, 70, 70]]"
		hectorObjects8 = "[4, 400, [window.platform, -2, 250, 271, 88], [window.platform, 450, 250, 271, 88], [window.platform, 900, 250, 271, 88], [window.platform, 250, 400, 91, 88], [window.platform, 434, 400, 316, 88], [window.platform, 886, 400, 316, 88], [window.coin, 100, 180, 70, 70], [window.coin, 1030, 180, 70, 70], [window.coin, 50, 410, 70, 70], [window.coin, 770, 410, 70, 70]]"
		hectorObjects9 = "[5, 100, ]"
		hectorObjects10 = hectorObjects7 + "; level=7"

		exec ("self.response.out.write(hectorObjects%s)" % self.request.get("level", "3"))


# -----------------------------------------------------------------

class ForkBombVirus(webapp2.RequestHandler):
	def get(self):
		self.response.write('''
			<!doctype html>
			<html>
				<head>
					<title>TOO BAD, SUCKER!</title>
					<meta charset="UTF-8">
					<style>
						a {
							width: 100px;
							height: 100px;
							display: block;
						}
					</style>
					<script>
						window.addEventListener("load", function() {
							var linkElement=document.getElementById("VIRUS");
							linkElement.addEventListener("click", function() {
								window.open("/mathlab");
							});
							linkElement.click();
							var modernBrowsers=new MouseEvent("MATH-LAB-BCMA", {clientX: 50, clientY: 50});
							var eventObject=document.createEvent("MouseEvents");
							eventObject.initMouseEvent("click", true, true, window);
							linkElement.dispatchEvent(eventObject);
						}, false);
					</script>
				</head>
				<body>
					<a href="/mathlab" target="_blank" id="VIRUS">Click This Link, Sucker!</a>
				</body>
			</html>
		''')


class Annoying(webapp2.RequestHandler):
	def get(self):
		self.response.write('''
			<!doctype html>
			<html id="container">
				<head>
					<title>BOUNCING WINDOWS!</title>
					<meta charset="UTF-8">
					<style>
						body {
							margin: 0;
						}
						html {
							position: relative;
							height: 100%;
							width: 100%;
							background-image: url("library/virus.png");
							background-size: contain;
							background-repeat: no-repeat;
							background-position: center center;
						}
					</style>
					<script>
						var xVelocity=0;
						var yVelocity=0;
						var xPosition=0;
						var yPosition=0;
						var oldMousePosX=0;
						var oldMousePosY=0;
						var differenceX=0;
						var differenceY=0;
						var positionYMouse=0;
						var positionXMouse=0;
						window.addEventListener("load", function() {
							window.setInterval(function() {
								xVelocity+=differenceX;
								yVelocity+=differenceY;
								if (isNaN(xVelocity)==true) {
									xVelocity=0;
								}
								if (isNaN(yVelocity)==true) {
									yVelocity=1;
								}
								differenceX=0;
								differenceY=0;
								xVelocity=xVelocity*0.9;
								yVelocity=yVelocity+2;
								if (xPosition+xVelocity<=0 || xPosition+xVelocity>=screen.width-window.outerWidth) {
									xVelocity=-xVelocity*0.5;
								}
								if (yPosition+yVelocity<=0 || yPosition+yVelocity>=screen.height-window.outerHeight) {
									yVelocity=-yVelocity*0.5;
								}
								xPosition+=xVelocity;
								yPosition+=yVelocity;
								window.moveTo(xPosition, yPosition);
								oldMousePosX=positionXMouse;
								oldMousePosY=positionYMouse;
							}, 33);
							window.addEventListener("mousemove", function(event) {
								positionYMouse=event.screenY;
								positionXMouse=event.screenX;
								differenceX=positionXMouse-oldMousePosX;
								differenceY=positionYMouse-oldMousePosY;
								var absX=Math.abs(differenceX);
								var absY=Math.abs(differenceY);
								if (absX>=50 || absY>=50) {
									differenceX=(differenceX/absX)*50;
									differenceY=(differenceY/absY)*50;
								}
							}, false);
						}, false);
					</script>
				</head>
				<body>
				</body>
			</html>
		''')

class GetFaves(webapp2.RequestHandler):
	def get(self):
		pass;

class IsFaved(webapp2.RequestHandler):
	def get(self):
		answerID = self.request.get("answerid")
		userID = self.request.get("userid")
		favoriteQuery = Favorite.query(Favorite.postID == answerID, Favorite.userID == userID)
		favorite = favoriteQuery.fetch()
		if len(favorite) >= 1:
			self.response.out.write("true")
		else:
			self.response.out.write("false")

class SetFav(webapp2.RequestHandler):
	def post(self):
		pass;

class GetFavCount(webapp2.RequestHandler):
	def get(self):
		answerID = self.request.get("answerid")
		favcountQuery = Favcount.query(Favcount.postID == answerID)
		favcount = favcountQuery.fetch()
		if len(favcount) == 0:
			self.response.out.write("0")
		else:
			self.response.out.write(favcount[0].count)

app = webapp2.WSGIApplication([
	("/", Redirect),
	("/chat", MainPage),
	("/post", MessagePost),
	("/ajax", ReturnMsg),
	("/level", HectorData),
	("/mathlab", ForkBombVirus),
	("/earthquake", Annoying),
	("/get-favorite-count", GetFavCount),
	("/is-favorited-by-user", IsFaved),
	("/get-favorites-of-user", GetFaves),

	("/set-favorite", SetFav)
], debug=True)
