from scapy.all import sr1,IP, ICMP, sniff
import urllib
import re
import collections # deque
import json
import time
import redis


# BPF filter to capture all IPv4 HTTP packets to and from port 80, 
# i.e. print only packets that contain data, not, for example, SYN and FIN
# packets and ACK-only packets
BPF_FILTER = "tcp port 80 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)"

# Pattern to parse out http headers from raw request
re_headers = re.compile(r'(?P<name>.*?): (?P<value>.*?)\r\n')

handlers = []

# store recent queries in double ended queue to avoid lots of duplication
recents = collections.deque(maxlen=20)
def check_recent(key):
    """check the recents queue for key and return if located"""
    if key:
        if key in recents:
            # allow it to repeat eventually when it is pushed out of the deque
            #recents.append(None) # filler
            return True
        else:
            recents.append(key)    
            return False


class UrlHandler(object):
    """merely parse out the url"""
    re_url = re.compile(r'^GET (/.*) HTTP/1.1')
    
    def __init__(self):
        self.redis_server = redis.Redis("localhost")
        
    def parse(self, pkt):
        """parse the packet and push the data to redis"""
        
        # parse out http headers 
        # pkt.load contains raw http request
        headers = dict(re_headers.findall(pkt.load))
        if not headers.has_key("Host"):
            return
        
        if check_recent(headers['Host']):
            return
        
        # extract url from GET request
        match = self.re_url.match(pkt.load)
        if not match:
            return
        
        request = {'time': time.strftime("%H:%M"), 'ip': pkt.payload.src, 
                    'host': headers['Host'], 'url': match.group(1)}
        self.redis_server.publish("requests", json.dumps(request))
        
        return


if __name__ == "__main__":    
    # sniff until interrupted
    handler = UrlHandler()
    results = sniff(filter=BPF_FILTER, prn=handler.parse)
    print repr(results)