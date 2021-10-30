# Potter Search

Tool for searching through the 7 Harry Potter books. Hosted at potter-search.com

## Potter Search API
The API is accesible at https://1100h19.pythonanywhere.com/

#### `GET /`

Ping to make sure the server is up and running.

#### `POST /api/search`

Payload

```
{
    "search": "search_term",
    "books": [/* List of 7 booleans representing which books are checked off */],
    "page": 1 // Requests are paginated to 20 items
}
```

Response

```
{
    "found": [
        "text": "...",
        "book": "The Deathly Hallows"
    ]
}
```

#### `POST /api/count`

Payload

```
{
    "search": "search_term",
}
```

Response

```
{
    "found": [{"book1": 90, ... , "book7": 0}]
    "search": "search_term"
}
```

### How It Works
React frontend makes requests to Flask backend. The frontend is hosted on AWS Amplify and the backend is hosted at GCP App Engine.

### To Do
* Fuzzy matching
* Parallax scrolling
