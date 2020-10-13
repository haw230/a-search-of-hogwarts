from flask import Flask, request
import os
from pathlib import Path
import re
import json
from time import sleep
from flask_cors import cross_origin
app = Flask(__name__)
books_data = {}


@app.route('/', methods=['GET'])
@cross_origin()
def hello():
    sleep(4)
    return "request.body"


@app.route('/api/search', methods=['GET', 'POST'])
@cross_origin()
def get_search_results():
    print(request.get_data())
    print(request.data)
    print(request.json)
    # data = json.loads(str(request.get_data(), 'utf-8'))['data']
    return request.get_data()


@app.route('/api/titles')
def get_book_titles():
    regex = re.compile(r'.*\- (.*)\.txt')
    return json.dumps([regex.search(title).group(1) for title in books_data.keys()])


def startup():
    data_path = Path('data/')
    from time import perf_counter
    start = perf_counter()
    for book in os.listdir(data_path):
        with open(data_path / book, encoding="utf8") as f:
            books_data[book] = [paragraph for paragraph in f.read().split('\n') if paragraph]


if __name__ == '__main__':
    startup()
    print(get_book_titles())
    app.run(host='localhost', port=1332)

# from flask import Flask

# # print a nice greeting.
# def say_hello(username = "World"):
#     return '<p>Hello %s!</p>\n' % username

# # some bits of text for the page.
# header_text = '''
#     <html>\n<head> <title>EB Flask Test</title> </head>\n<body>'''
# instructions = '''
#     <p><em>Hint</em>: This is a RESTful web service! Append a username
#     to the URL (for example: <code>/Thelonious</code>) to say hello to
#     someone specific.</p>\n'''
# home_link = '<p><a href="/">Back</a></p>\n'
# footer_text = '</body>\n</html>'

# # EB looks for an 'application' callable by default.
# application = Flask(__name__)

# # add a rule for the index page.
# application.add_url_rule('/', 'index', (lambda: header_text +
#     say_hello() + instructions + footer_text))

# # add a rule when the page is accessed with a name appended to the site
# # URL.
# application.add_url_rule('/<username>', 'hello', (lambda username:
#     header_text + say_hello(username) + home_link + footer_text))

# # run the app.
# if __name__ == "__main__":
#     # Setting debug to True enables debug output. This line should be
#     # removed before deploying a production app.
#     application.debug = True
#     application.run()