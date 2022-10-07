import os
from pathlib import Path

STOPWORDS = {'a', 'the', 'an'}
PUNCTUATION = {',', '\'', '\"', '.', '?', '!', '-'}
BOOKS = [
    "Book 1 - The Philosopher's Stone.txt",
    'Book 2 - The Chamber of Secrets.txt',
    'Book 3 - The Prisoner of Azkaban.txt',
    'Book 4 - The Goblet of Fire.txt',
    'Book 5 - The Order of the Phoenix.txt',
    'Book 6 - The Half Blood Prince.txt',
    'Book 7 - The Deathly Hallows.txt',
]
DATA_PATH = Path(os.getcwd()) / "server" / "data"
