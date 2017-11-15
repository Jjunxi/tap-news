from cloudAMQP_client import CloudAMQPClient

CLOUDAMQP_URL = 'amqp://kjtrorgp:2y18a3ItmACvQj408WRPQ1za2kXixz37@mustang.rmq.cloudamqp.com/kjtrorgp'
QUEUE_NAME = 'test'

def test_basic():
    client = CloudAMQPClient(CLOUDAMQP_URL, QUEUE_NAME)

    sentMsg = {'test_key':'test_value'}
    client.sendMessage(sentMsg)
    client.sleep(5)
    receivedMsg = client.getMessage()
    assert sentMsg == receivedMsg
    print 'test_basic passed.'

if __name__ == "__main__":
    test_basic()
