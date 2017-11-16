import datetime
import hashlib
import os
import redis
import sys

# import common package in parent directory
# similar to set PATH
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
import news_api_client
from cloudAMQP_client import CloudAMQPClient

NEWS_SOURCES = [
    'bbc-news',
    'bbc-sport',
    'bloomberg',
    'cnn',
    'entertainment-weekly',
    'espn',
    'ign',
    'techcrunch',
    'the-new-york-times',
    'the-wall-street-journal',
    'the-washington-post'
]

REDIS_HOST = "localhost"
REDIS_PORT = 6379

NEWS_TIME_OUT_IN_SECONDS = 3600 * 24 * 1
SLEEP_TIME_IN_SECONDS = 15

redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT)

# TODO: add your own queue url and name
SCRAPE_NEWS_TASK_QUEUE_URL = "amqp://aydehjks:UGzDXoy3_liMYmnzQZxXE-NsVNrV-LPR@elephant.rmq.cloudamqp.com/aydehjks"
SCRAPE_NEWS_TASK_QUEUE_NAME = "scrape Q"

cloudAMQP_client = CloudAMQPClient(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)

while True:
    news_list = news_api_client.getNewsFromSource()
    print('Fetch %d news from source' % len(news_list))
    num_of_new_news = 0

    for news in news_list:
        news_digest = hashlib.md5(news['title'].encode('utf-8')).digest().encode('base64')

        if redis_client.get(news_digest) is None:
            print('Fetch a fresh news')
            num_of_new_news = num_of_new_news + 1
            news['digest'] = news_digest

            # If 'publishedAt' is None, set it to current UTC time.
            if news['publishedAt'] is None:
                # Make the time in format YYYY-MM_DDTHH:MM:SS in UTC
                news['publishedAt'] = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')

            redis_client.set(news_digest, news)
            # redis can clear document automatically
            redis_client.expire(news_digest, NEWS_TIME_OUT_IN_SECONDS)

            cloudAMQP_client.sendMessage(news)
        else:
            print('Fetch an old news')

    print("Send %d news to scrap Q" % num_of_new_news)

    # AMQP connection keeps alive
    cloudAMQP_client.sleep(SLEEP_TIME_IN_SECONDS)
