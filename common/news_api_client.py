import requests
import json
# from json import loads
from time import sleep
from termcolor import colored

NEWS_API_KEY = "dde11377207d41b8853f467b81059389"
NEWS_API_ENDPOINT = "https://newsapi.org/v1/"
ARTICALS_API = "articles"

BBC = 'bbc'
CNN = 'cnn'
DEFAULT_SOURCES = [CNN]

SORT_BY_TOP = 'top'
SORT_BY_POPULAR = 'popular'

def buildUrl(end_point=NEWS_API_ENDPOINT, api_name=ARTICALS_API):
    return end_point + api_name

def getNewsFromSource(sources=[DEFAULT_SOURCES], sortBy=SORT_BY_TOP):
    articles = []
    for source in sources:
        payload = {'apiKey': NEWS_API_KEY,
                   'source': source,
                   'sortBy': sortBy}
        response = requests.get(buildUrl(), params=payload)
        res_json = json.loads(response.content)
        count = len(res_json['articles']) if 'articles' in res_json else 0
        # print('Fetching %d news from %s' % (count, source))
        print(colored('Fetching %d news from %s' % (count, source), 'red'))

        # Extract news from response
        if (res_json is not None and
            res_json['status'] == 'ok' and
            res_json['source'] is not None):
            # Populate news source in each article
            for news in res_json['articles']:
                news['source'] = res_json['source']

            articles.extend(res_json['articles'])
        
        sleep(1)

    return articles
