#!/usr/bin/env python
import webapp2, time, datetime, cgi
from google.appengine.ext import ndb
from google.appengine.ext import db

class Snippet(ndb.Model):
	content = ndb.StringProperty(indexed=False)
	date = ndb.DateTimeProperty(auto_now_add=True)

def text_key(bookName):
	return ndb.Key("Snippet", bookName)

class Story(webapp2.RequestHandler):
	def get(self):

		html = '''
			<!doctype html>
			<html>
				<head>
					<title>WorldStory</title>
					<meta charset="UTF-8">
					<link rel="stylesheet" href="theme.css">
					<script type="text/javascript" src="//code.jquery.com/jquery-latest.min.js"></script>
					<script type="text/javascript" src="basic.js"></script>
					<script type="text/javascript" src="story.js"></script>
				</head>
				<body>
					<header>
						<span class="small-text green button lite" action="edit()">
							Edit
						</span>
					</header>
					<main class="full-size">
						<div class="small-text gray button" action="fetch(-1)">
							Previous
						</div>
						<div class="small-text reader full-size">
							Your content will be loaded shortly...
						</div>
						<div class="small-text gray button" action="fetch(1)">
							Next
						</div>
					</main>
				</body>
			</html>
		'''
		self.response.write(html)

class Home(webapp2.RequestHandler):
	def get(self):

		html = '''
			<!doctype html>
			<html>
				<head>
					<title>WorldStory</title>
					<meta charset="UTF-8">
					<link rel="stylesheet" href="theme.css">
					<script type="text/javascript" src="//code.jquery.com/jquery-latest.min.js"></script>
					<script type="text/javascript" src="basic.js"></script>
				</head>
				<body>
					<main class="full-size">
						<h1>WorldStory</h1>
						<div class="description">
							With WorldStory,
							anyone can share their thoughts
							on what happens next in the
							book. It's up to you!
						</div>
						<span class="green button lite" action="window.location='/books'">
							Add to the story
						</span>
					</main>
				</body>
			</html>
		'''
		self.response.write(html)

class Fetch(webapp2.RequestHandler):
	def get(self):
		bookName = self.request.get("book")
		pageNumber = self.request.get("page")
		query = Snippet.query(ancestor=text_key(bookName)).order(Snippet.date)
		print(Snippet.query())
		content = query
		'''content = Snippet.all()
		content.ancestor(text_key(bookName))
		content.order(Snippet.date)'''

		output = " ".join(content)[pageNumber*1000:pageNumber+1000]
		self.response.out.write(output)

class Post(webapp2.RequestHandler):
	def post(self):
		bookName = self.request.get("book")
		snippet = Snippet(parent=text_key(bookName))
		content = self.request.get("content")

		snippet.content = content
		snippet.put()

		self.response.out.write("success")

application = webapp2.WSGIApplication([
	("/", Home),
	("/books", Books),
	("/fetch", Fetch),
	("/post", Post),
	("/edit", Edit)
], debug=True)