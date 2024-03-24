---
layout: post
title:  "Potter Search March 2024 Updates"
date:   2024-03-24 17:15:55 -0700
categories: potter search
background: '/img/site_background2.jpg'

---

I'm excited to introduce a bunch of new fixes and a brand new feature for Potter Search.

* Query parameters for books: https://www.potter-search.com/?search=expelliarmus&books=7
  * Now the selected book is encoded in the query parameters. Just pick the book you're trying to search and make a search. You can copy and share the URL and only that book will be searched!
* Bug fixes
  * Fix issue where it wasn't possible to make a search right after making a search.
  * Fix some general bugs.
* General Performance Searches
  * Reduce some inefficiences where Potter Search was making multiple requests.
  * Compress images to make loading them in your browser faster.
  * Load some of the JavaScript and CSS later on. Improve performance of the website!
   
What features or bug fixes would you like to see in future Potter Search updates?

<script id="dsq-count-scr" src="//pottersearch.disqus.com/count.js" async></script>
<div id="disqus_thread"></div>
<script>
    /**
    *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
    *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */
    /*
    var disqus_config = function () {
    this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    */
    (function() { // DON'T EDIT BELOW THIS LINE
    var d = document, s = d.createElement('script');
    s.src = 'https://pottersearch.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
    })();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
