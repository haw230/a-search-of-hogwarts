from flask import Flask, request
import os
from pathlib import Path
import re
import json
from time import sleep
from flask_cors import cross_origin
from flask_cors import CORS
from collections import defaultdict
import json

application = Flask(__name__)
# CORS(application)
books_data = {}  # copy of display text
search_data = {}  # copy of search text (will preprocess)

STOPWORDS = ['a', 'the', 'an', 'it']

@application.route('/debug', methods=['GET'])
@cross_origin()
def debug():
    data_path = Path('data/')
    book = "Book 1 - The Philosopher's Stone.txt"
    with open(data_path / book, encoding="utf8") as f:
        text = f.read()
        return {
            "books_data": str(books_data)[:1000],
            "text": text[:1000],
        }

@application.route('/', methods=['GET'])
@cross_origin()
def hello():
    sleep(4)
    return "request.body"

def parse_last_result(result, search_words):
    res = result[-1]
    for search_word in search_words:
        res["text"] = re.sub(fr'(“| |.)?({search_word})(!| |.|”|\?)', lambda x: f"{x.group(1)}<b>{x.group(2)}</b>{x.group(3)}", res["text"], flags=re.IGNORECASE)

def is_match(paragraph, search_words):
    set_paragraph = set(paragraph.split())
    for search_word in search_words:
        try:
            for word in set_paragraph:
                regex = re.compile(fr'(“| |.)?({search_word})(!| |.|”|\?)')
                if regex.search(word):
                    raise FileNotFoundError
            return False
        except FileNotFoundError:
            pass
    return True

@application.route('/api/search', methods=['GET', 'POST'])
@cross_origin()
def get_search_results():
    data = request.json["data"]
    search_words = [word.lower() for word in data["search"].split() if word not in STOPWORDS]
    if search_words == "":
        return {
            "found": [{"text": "", "book": "Try a more specific search!"}],
        }
    checked = data["books"]
    page = int(data["page"]) * 10
    result = []
    for book, check in zip(books_data.keys(), checked):
        if not check:
            continue
        for i in range(len(books_data[book])):
            paragraph = search_data[book][i]

            if is_match(paragraph, search_words):
                prev_paragraph = books_data[book][i - 1] if i != 0 else ""
                next_paragraph = books_data[book][i + 1] if i != len(books_data[book]) - 1 else ""
                result.append({ "text": f"{prev_paragraph}\n\n{books_data[book][i]}\n\n{next_paragraph}", "book": book})
                parse_last_result(result, search_words)
            if page == len(result):
                return json.dumps({
                    "found": result[-10:],
                })

    if len(result) == 0:
        return {
            "found": [{"text": "", "book": "No Occurences Found"}],
        }
    return json.dumps({
        "found": result[-10:],
    })


@application.route('/api/count', methods=['GET', 'POST'])
@cross_origin()
def get_counts():
    data = request.json["data"]
    search_words = [word.lower() for word in data["search"].split() if word not in STOPWORDS]
    counts = {}

    result = []
    for book in books_data.keys():
        counts[book] = 0
        for i in range(len(books_data[book])):
            paragraph = search_data[book][i]

            if is_match(paragraph, search_words):
                counts[book] += 1
    return counts


def startup():
    books = ["Book 1 - The Philosopher's Stone.txt",
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

startup()

if __name__ == "__main__":
    application.run()
