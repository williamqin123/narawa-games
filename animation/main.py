#!/usr/bin/env python
import webapp2

class MainHandler(webapp2.RequestHandler):
    def get(self):
        self.redirect("/v2.html", permanent = True)

app = webapp2.WSGIApplication([
    ("/", MainHandler)
], debug = True)