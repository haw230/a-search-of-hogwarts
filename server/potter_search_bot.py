import praw
import requests
from urllib.parse import urlencode

# Create a Reddit instance
reddit = praw.Reddit(
    client_id='msNAcRReey6DFUx54dDTFw',
    client_secret='8Q6LCZiNXaCD3RzAjebzuzu7dbHX9Q',
    user_agent='Potter Search bot by Potter Search',
    username='PotterSearchBot',
    password='',
)

subreddit = reddit.subreddit("pottersearch")

keyword = "!pottersearch"

def find_words_after_pottersearch(text):
  """
  Finds words after the "!pottersearch" keyword and returns them as a string.

  Args:
    text: The input text to search within.

  Returns:
    A string containing the words found after "!pottersearch", or an empty string if not found.
  """

  # Locate the starting position of "!pottersearch"
  start_index = text.find("!pottersearch")

  # If the keyword is not found, return an empty string
  if start_index == -1:
    return ""

  # Extract the text after the keyword and return it as a string
  return text[start_index + len("!pottersearch"):].strip()

# Looking for comments
for comment in subreddit.stream.comments():
    if keyword in comment.body:
        try:
            search_term = find_words_after_pottersearch(comment.body)
            
            print(search_term)
            req = requests.post("https://1100h19.pythonanywhere.com/api/search", headers = {'Access-Control-Allow-Origin': '*'}, json={"data": {
            "search": search_term,
            "books": [True, True, True, True, True, True, True],
            "page": 1,
            }})
            if req.status_code != 200:
               print("error!!!")
            reply = f"I found these entries for the search term '{search_term}'.\n"
            reply += "\n___\n"
            found = req.json()['found'][:10]
            for entry in found:
               reply += entry['text'].replace('<b>', '*').replace('</b>', '*')
               reply += "\n___\n"
            reply += '\n'
            base_url = "https://www.potter-search.com/"
            params = {'search': search_term}
            query_string = urlencode(params)
            full_url = base_url + query_string
            reply += f"See more results at [{full_url}]({full_url})"
            # Reply to the comment
            comment.reply(reply[:10000])
            print(f"Replied to comment {comment.id}")
        except praw.exceptions.APIException as e:
            # Handle exceptions from the Reddit API
            print(e)
print("done!")
