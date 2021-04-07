# Random YouTube Video

Since YouTube API doesn't provide any simple method to get a random YouTube video, this will search with different random strings or random words from an English dictionnary and get a random item from the results.

YouTube Data API also have quite restrictive usage quotas. As of Q1 2021, daily quota for free usage is 10000 credits, with each search request consuming 100.

To avoid this restriction, the code will store all the videos IDs from its random search requests in the local storage for future usage. When YouTube Data API doesn't provide an answer anymore, because of a depleted quota reason or any other, it will use the local storage video IDs. 


## How to run

Needs a YouTube Data API v3 key, to be configured in Google Developper Console.
Once you obtain the YouTube Data API key, paste in `example_config.json` and rename the file `config.json`.

Run it with any web server for static files.
