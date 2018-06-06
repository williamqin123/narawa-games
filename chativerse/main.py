#!/usr/bin/env python
import webapp2, time, datetime, json
from google.appengine.ext import ndb
from google.appengine.ext import db

def escapeHTML(string):
	return string.replace("&", "&amp;").replace('''"''', "&quot;").replace("'", "&apos;").replace("<", "&lt;").replace(">", "&gt;").replace("\\", "&#92;")

def getEpochTime():
	return time.time()

def getDateTime():
	return unicode(datetime.datetime.now())

class Idea(ndb.Model):
	topic = ndb.StringProperty(indexed = False)
	author = ndb.StringProperty(indexed = False)
	content = ndb.StringProperty(indexed = False)
	dateTime = ndb.StringProperty(indexed = False)
	epochTime = ndb.FloatProperty(indexed = True)
	views = ndb.IntegerProperty(indexed = True)

class Reply(ndb.Model):
	mainPost = ndb.StringProperty(indexed = True)
	author = ndb.StringProperty(indexed = False)
	content = ndb.StringProperty(indexed = False)
	dateTime = ndb.StringProperty(indexed = False)
	epochTime = ndb.FloatProperty(indexed = True)

def getIdeaKey(topic):
	return ndb.Key("Idea", topic)

def getReplyKey(idea):
	return ndb.Key("Idea", topic)

class ListPosts(webapp2.RequestHandler):
	def get(self):
		sort = self.request.get("sort", "time")

		html = '''
			<!doctype html>
			<html>
				<head>
					<title>W.D.Y.T?</title>
					<meta charset="UTF-8">
					<link rel="stylesheet" href="theme.css">
					<script type="text/javascript" src="//code.jquery.com/jquery-latest.min.js"></script>
					<script type="text/javascript" src="essentials.js"></script>
					<script type="text/javascript" src="ajax.js"></script>
				</head>
				<body>
					<main>
						<div class="block box">
							<em>WHAT DO YOU THINK?</em>
							is an online discussion center
							where people all over the world
							can talk about and share their ideas.
						</div>
						<div class="wrapper box">
							<h2>Top Posts</h2>
							<div id="ajax" data-type="idea">
								<div class="ajax-post" data-timestamp="999999999999"></div>
							</div>
							<button data-action="ajax()">Load 10 more ideas...</button>
						</div>
					</main>
				</body>
			</html>
		'''
		self.response.write(html);

class ViewPost(webapp2.RequestHandler):
	def get(self):
		
		keyString = self.request.get("key")
		postKey = ndb.Key(urlsafe = keyString)
		post = postKey.get()

		html = '''
			<!doctype html>
			<html>
				<head>
					<title>W.D.Y.T?</title>
					<meta charset="UTF-8">
					<link rel="stylesheet" href="theme.css">
					<script type="text/javascript" src="//code.jquery.com/jquery-latest.min.js"></script>
					<script type="text/javascript" src="essentials.js"></script>
					<script type="text/javascript" src="ajax.js"></script>
				</head>
				<body>
					<main>
						<div class="wrapper box">
							<h2>Topic: %s</h2>
							<h3>Author: %s</h3>
							<h3>Timestamp: %s</h3>
							<div class="block box">
								Details: %s
							</div>
						</div>
						<div class="wrapper box">
							<h2>User Replies</h2>
							<div class="block box">
								<h3>Post a reply</h3>
								<form action="/viewer" method="post">
									<input type="hidden" name="parent" value="%s">
									<label>
										Your name: <input type="text" name="author" maxlength="50">
									</label>
									<label>
										Details:
										<textarea name="details" maxlength="1000"></textarea>
									</label>
									<input type="submit" value="Post">
								</form>
							</div>
							<div id="ajax" data-type="reply">
								<div class="ajax-post" data-timestamp="999999999999"></div>
							</div>
							<button data-action="ajax()">Load 10 more replies...</button>
						</div>
					</main>
				</body>
			</html>
		'''

		self.response.write(html % (post.topic, post.author, post.dateTime, post.content, keyString))

	def post(self):
		keyString = self.request.get("parent")

		reply = Reply()
		reply.author = self.request.get("author")
		reply.topic = self.request.get("topic")
		reply.content = self.request.get("details")
		reply.dateTime = getDateTime()
		reply.epochTime = getEpochTime()
		reply.mainPost = keyString

		reply.put()

		self.redirect("/viewer?key=%s" % keyString)

class LoadPosts(webapp2.RequestHandler):

	def get(self):

		limit = self.request.get("limit")
		postType = self.request.get("type")
		if postType == "idea":
			postModel = Idea
		elif postType == "reply":
			postModel = Reply

		query = postModel.query(postModel.epochTime < int(limit)).order(-postModel.epochTime)
		results = query.fetch(10)
		json = 

		self.response.out.write(json.dumps(vars(results)))

class NewPost(webapp2.RequestHandler):

	def get(self):
		#sandy_key = ndb.Key(urlsafe=url_string)
		
		html = '''
			<!doctype html>
			<html>
				<head>
					<title>W.D.Y.T?</title>
					<meta charset="UTF-8">
					<link rel="stylesheet" href="theme.css">
					<script type="text/javascript" src="//code.jquery.com/jquery-latest.min.js"></script>
					<script type="text/javascript" src="essentials.js"></script>
					<script type="text/javascript" src="ajax.js"></script>
				</head>
				<body>
					<main>
						<div class="wrapper box">
							<h2>Post a new idea!</h2>
							<form method="post" action="/post">
								<div class="block box">
									<label>
										Topic: <input type="text" name="topic" maxlength="50">
									</label>
								</div>
								<div class="block box">
									<label>
										Your name: <input type="text" name="author" maxlength="50">
									</label>
								</div>
								<div class="block box">
									<label>
										Details:
										<textarea name="details" maxlength="1000"></textarea>
									</label>
								</div>
								<input type="submit" value="Post">
							</form>
						</div>
					</main>
				</body>
			</html>
		'''
		self.response.write(html)

	def post(self):

		idea = Idea()
		idea.author = self.request.get("author")
		idea.topic = self.request.get("topic")
		idea.content = self.request.get("details")
		idea.dateTime = getDateTime()
		idea.epochTime = getEpochTime()
		idea.views = 0
		permalinkKey = idea.put()

		self.redirect("/viewer?key=%s" % permalinkKey.urlsafe())

application = webapp2.WSGIApplication([
	("/list", ListPosts),
	("/viewer", ViewPost),
	("/post", NewPost),
	("/fetch", LoadPosts)
], debug = True)