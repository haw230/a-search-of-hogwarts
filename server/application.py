from flask import Flask, request
import os
from pathlib import Path
import re
import json
from time import sleep
from flask_cors import cross_origin
import json

app = Flask(__name__)
books_data = {}  # copy of display text
search_data = {}  # copy of search text (will preprocess)

STOPWORDS = ['a', 'the', 'an', 'it']

@app.route('/', methods=['GET'])
@cross_origin()
def hello():
    sleep(4)
    return "request.body"


@app.route('/api/search', methods=['GET', 'POST'])
@cross_origin()
def get_search_results():
    data = request.json["data"]
    search_words = [word for word in data["search"].split() if word not in STOPWORDS]
    checked = data["books"]
    page = int(data["page"]) * 10

    result = []
    for book, check in zip(books_data.keys(), checked):
        if not check:
            continue
        for i in range(len(books_data[book])):
            paragraph = search_data[book][i]

            if all([[search_word in paragraph for search_word in search_words]]):
                prev_paragraph = books_data[book][i - 1] if i != 0 else ""
                next_paragraph = books_data[book][i + 1] if i != len(books_data[book]) - 1 else ""
                result.append({ "text": f"{prev_paragraph}\n\n{books_data[book][i]}\n\n{next_paragraph}", "book": book})

            if page == len(result):
                print(result)
                return json.dumps({
                    "found": result[-10:],
                })

    print(result)
    return {
        "found": result,
    }


def startup():
    books = [ "Book 1 - The Philosopher's Stone.txt",
            'Book 2 - The Chamber of Secrets.txt',
            'Book 3 - The Prisoner of Azkaban.txt',
            'Book 4 - The Goblet of Fire.txt',
            'Book 5 - The Order of the Phoenix.txt',
            'Book 6 - The Half Blood Prince.txt',
            'Book 7 - The Deathly Hallows.txt',]
    data_path = Path('data/')
    for book in books:
        with open(data_path / book, encoding="utf8") as f:
            text = f.read()
            regex = re.compile(r'.*\- (.*)\.txt')
            books_data[regex.search(book).group(1)] = [paragraph for paragraph in text.split('\n') if paragraph and 'Page | ' not in paragraph and not paragraph.isupper()]
            search_data[regex.search(book).group(1)] = [paragraph.lower() for paragraph in text.split('\n') if paragraph and 'Page | ' not in paragraph and not paragraph.isupper()]

if __name__ == '__main__':
    startup()
    app.debug = True
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