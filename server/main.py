import sys
import re
from typing import List, Dict

sys.path.insert(0, "/home/1100h19/a-search-of-hogwarts")

from server.constants import STOPWORDS, PUNCTUATION, BOOKS, DATA_PATH

from flask import Flask, request
from flask_cors import cross_origin
from collections import OrderedDict


application = Flask(__name__)
app = application

books_data = OrderedDict()  # text that will be displayed to user
search_data = OrderedDict()  # text that will be searched


@application.route('/', methods=['GET'])
@cross_origin()
def hello():
    return "Server is up and running!"


def template_regex(string: str) -> str:
    """
    Wrap given string around with the regex for searching logic.
    """
    return fr'(\-|\n|“| |\.)({string})(’s|\-|\n|!| |\.|”|\?|,)'


def bold_text(result: List[str], search_words: List[str]) -> None:
    """
    Insert <b> tags to bold matched words (on the UI)
    """
    recent_match = result[-1]
    for search_word in search_words:
        recent_match["text"] = re.sub(
            template_regex(search_word),
            lambda x: f"{x.group(1)}<b>{x.group(2)}</b>{x.group(3)}",
            f" {recent_match['text']}", flags=re.IGNORECASE
        )[1:]


def is_match(paragraph: str, search_words: str) -> bool:
    """
    A paragraph is a match if all words in search_words are contained
    in the paragraph.
    """
    for search_word in search_words:
        regex = re.compile(
            template_regex(search_word),
            flags=re.IGNORECASE
        )
        if not regex.search(f" {paragraph}"):
            return False
    return True


def cleanse(string: str) -> str:
    """
    This function does two things:
    1. Add '?' behind each punctuation symbol. This makes the symbol optional during the regex search later on.
    2. Replace regular single quotes with fancy single quotes (since fancy quotes are used in the raw data).
    """
    for punctuation in PUNCTUATION:
        string = string.replace(punctuation, f"{punctuation}?")
    return string.replace('\'', '’')


@application.route('/api/search', methods=['POST'])
@cross_origin()
def get_search_results() -> Dict[str, str]:
    """
    Return matching paragraph as well as the paragraph before and after it (if either exists).

    :param books (List[bool]): list of booleans representing if a book should be searched
    :param search (str): search term
    :param page (str): page number for infinite scsroll
    """
    data = request.json["data"]
    search_words = [cleanse(word) for word in data["search"].split() if word.lower() not in STOPWORDS]
    if not search_words or not all(search_words):
        return {
            "found": [{"text": "", "book": "Try a more specific search!"}],
        }
    checked = data["books"]
    to_skip = (int(data["page"]) - 1) * 20
    count = 0
    result = []
    for book, check in zip(books_data.keys(), checked):
        if not check:  # skip books
            continue
        for i in range(len(books_data[book])):
            paragraph = search_data[book][i]

            if is_match(paragraph, search_words):
                if count >= to_skip:
                    prev_paragraph = books_data[book][i - 1] if i != 0 else ""
                    next_paragraph = books_data[book][i + 1] if i != len(books_data[book]) - 1 else ""
                    result.append({ "text": f"{prev_paragraph}\n\n{books_data[book][i]}\n\n{next_paragraph}", "book": book})
                    bold_text(result, search_words)
                else:
                    count += 1

            if len(result) == 20:
                return {
                    "found": result,
                }
    
    cur_page = int(data["page"]) * 20 
    if len(result) == 0 and cur_page == 20:  # Empty and first page
        return {
            "found": [{"text": "", "book": "No Occurences Found"}],
        }
    if cur_page > len(result):  # Found some but not to fill update entire page
        return {
            "found": result + [{"text": "", "book": "No More Occurences Found"}],
        }


@application.route('/api/count', methods=['POST'])
@cross_origin()
def get_counts() -> Dict[str, str]:
    """
    Counts how often words appear in each book.

    :param search (str): search term
    """
    data = request.json["data"]
    search_words = [
        word.lower() for word in data["search"].split()
        if word not in STOPWORDS
    ]

    result = []
    for book in books_data.keys():
        book_count = { book: 0 }
        for i in range(len(books_data[book])):
            paragraph = search_data[book][i]

            if is_match(paragraph, search_words):
                book_count[book] += 1

        result.append(book_count)
    return {
        "occurences": result,
        "search": data["search"]
    }


def startup() -> None:
    """
    Loads the books into memory
    """
    data_path = DATA_PATH
    for book in BOOKS:
        with open(data_path / book, encoding="utf8") as f:
            text = f.read()
            regex = re.compile(r'.*\- (.*)\.txt')
            books_data[regex.search(book).group(1)] = [
                paragraph for paragraph in text.split('\n')
            ]
            search_data[regex.search(book).group(1)] = [
                paragraph.lower() for paragraph in text.split('\n')
            ]


startup()


if __name__ == "__main__":
    application.run(debug=True, host='localhost', port=5001)
