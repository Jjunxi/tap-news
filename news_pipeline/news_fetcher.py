import os
import sys
from faker import Faker

# from newspaper import Article

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
sys.path.append(os.path.join(os.path.dirname(__file__), 'scrapers'))

import cnn_news_scraper
from cloudAMQP_client import CloudAMQPClient

SLEEP_TIME_IN_SECONDS = 3

# TODO: add your own queue url and name
DEDUPE_NEWS_TASK_QUEUE_URL = "amqp://aydehjks:UGzDXoy3_liMYmnzQZxXE-NsVNrV-LPR@elephant.rmq.cloudamqp.com/aydehjks"
DEDUPE_NEWS_TASK_QUEUE_NAME = "dedupe Q"
SCRAPE_NEWS_TASK_QUEUE_URL = "amqp://aydehjks:UGzDXoy3_liMYmnzQZxXE-NsVNrV-LPR@elephant.rmq.cloudamqp.com/aydehjks"
SCRAPE_NEWS_TASK_QUEUE_NAME = "scrape Q"
scrape_news_queue_client = CloudAMQPClient(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)
dedupe_news_queue_client = CloudAMQPClient(DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)


fake = Faker()

def isBlank (myString):
    return not (myString and myString.strip())


def handle_message(msg):
    if msg is None or not isinstance(msg, dict):
        print('message is broken')
        return

    print('parse a news...')
    task = msg

    # article = Article(task['url'])
    # article.download()
    # article.parse()
    # task['text'] = article.text
    text = cnn_news_scraper.extract_news(task['url'])
    if isBlank(text):
        print('news is blank')
        text = fake.text()
        # return

    task['text'] = text
    dedupe_news_queue_client.sendMessage(task)


while True:
    if scrape_news_queue_client is not None:
        try:
            msg = scrape_news_queue_client.getMessage()
            if msg is not None:
                # Parse and process the task
                try:
                    handle_message(msg)
                except Exception as e:
                    print e
                    pass
        except:
            pass
        scrape_news_queue_client.sleep(SLEEP_TIME_IN_SECONDS)
