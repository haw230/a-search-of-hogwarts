from flask import Flask, request
import os
from pathlib import Path
import re
import json
from flask_cors import cross_origin
from collections import OrderedDict

application = Flask(__name__)

books_data = OrderedDict()  # copy of display text
search_data = OrderedDict()  # copy of search text (will preprocess)

STOPWORDS = ['a', 'the', 'an', 'it']

@application.route('/debug', methods=['GET'])
@cross_origin()
def debug():
    data_path = Path('data/')
    book = "Book 1 - The Philosopher's Stone.txt"
    with open(data_path / book, encoding="utf8") as f:
        text = f.read()
        return {
            "books_data": str(books_data)[:2000],
            "text": text[:2000],
        }

@application.route('/', methods=['GET'])
@cross_origin()
def hello():
    return "Portfolio website is coming soon!"

def parse_last_result(result, search_words):
    res = result[-1]
    for search_word in search_words:
        res["text"] = re.sub(fr'(\-|\n|“| |\.)({search_word})(\-|\n|!| |\.|”|\?|,)', lambda x: f"{x.group(1)}<b>{x.group(2)}</b>{x.group(3)}", f" {res['text']}", flags=re.IGNORECASE)[1:]


def is_match(paragraph, search_words):
    set_paragraph = paragraph.split()
    for search_word in search_words:
        try:
            regex = re.compile(fr'(\-|\n|“| |\.)({search_word})(\-|\n|!| |\.|”|\?|,)', flags=re.IGNORECASE)
            if regex.search(f" {paragraph}"):
                raise FileNotFoundError
            return False
        except FileNotFoundError:
            pass
    return True

def cleanse(string):
    TO_REPLACE = [',', '\'', '\"', '.', '?', '!', '-']
    temp = string
    for r in TO_REPLACE:
        temp = temp.replace(r, f"{r}?")
    return temp.lower().replace('\'', '’')

@application.route('/api/search', methods=['GET', 'POST'])
@cross_origin()
def get_search_results():
    data = request.json["data"]
    search_words = [cleanse(word) for word in data["search"].split() if word.lower() not in STOPWORDS]
    if not search_words or not all(search_words):
        return {
            "found": [{"text": "", "book": "Try a more specific search!"}],
        }
    checked = data["books"]
    page = int(data["page"]) * 20
    to_skip = (int(data["page"]) - 1) * 20
    count = 0
    result = []
    for book, check in zip(books_data.keys(), checked):
        if not check:
            continue
        for i in range(len(books_data[book])):
            paragraph = search_data[book][i]

            if is_match(paragraph, search_words):
                if count >= to_skip:
                    prev_paragraph = books_data[book][i - 1] if i != 0 else ""
                    next_paragraph = books_data[book][i + 1] if i != len(books_data[book]) - 1 else ""
                    result.append({ "text": f"{prev_paragraph}\n\n{books_data[book][i]}\n\n{next_paragraph}", "book": book})
                    parse_last_result(result, search_words)
                else:
                    count += 1

            if len(result) == 20:
                return json.dumps({
                    "found": result,
                })
 
    if len(result) == 0 and page == 20:  # Empty and first page
        return {
            "found": [{"text": "", "book": "No Occurences Found"}],
        }
    if page > len(result):  # Found some but not to fill update entire page
        return {
            "found": result + [{"text": "", "book": "No More Occurences Found"}],
        }
    return json.dumps({
        "found": result,
    })


@application.route('/api/count', methods=['GET', 'POST'])
@cross_origin()
def get_counts():
    data = request.json["data"]
    search_words = [word.lower() for word in data["search"].split() if word not in STOPWORDS]
    counts = []

    result = []
    for book in books_data.keys():
        book_count = {book: 0}
        for i in range(len(books_data[book])):
            paragraph = search_data[book][i]

            if is_match(paragraph, search_words):
                book_count[book] += 1
        result.append(book_count)
    return {"occurences": result, "search": data["search"]}


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
    application.run(debug=True, host='localhost', port=5001)
