from scapy.all import sr1,IP, ICMP, sniff
import urllib
import re
import collections

# BPF filter to capture all IPv4 HTTP packets to and from port 80, 
# i.e. print only packets that contain data, not, for example, SYN and FIN
# packets and ACK-only packets
BPF_FILTER = "tcp port 80 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)"

re_headers = re.compile(r'(?P<name>.*?): (?P<value>.*?)\r\n')

# store recent queries in double ended queue to avoid lots of duplication
recents = collections.deque(maxlen=20)

class Handler(object):
    """default handler to merely parse out the host"""
    @classmethod
    def test(cls, p):
        """test if the packet content can be parsed by this handler"""
        pass
    @classmethod
    def parse(cls, p):
        """parse the packet and return a formatted string containing useful info"""
        pass
 
        
class GoogleHandler(Handler):
    # Since google stores multiple searches in the url, we first try to locate
    # the most recent one, if it exists
    re_google = re.compile(r'^GET /search\?\S*[\?&]q=([^&]+).*(?:&q=([^&]+))?.* HTTP/1.1')
    
    @classmethod
    def test(cls, p):
        return True
    @classmethod
    def parse(cls, p):
        # get search query
        match = cls.re_google.match(p.load)
        if not match:
            return
        query = urllib.unquote_plus(match.group(1))
        
        # craft statement to print
        statement =  "{0} > ".format(p.payload.src)
        statement += "Google: \"{0}\"".format(query)
        
        return statement


def parse_packet(pkt):
    # parse out http headers 
    # pkt.load contains raw http request
    headers = dict(re_headers.findall(pkt.load))
    if not headers.has_key("Host"):
        return
    
    # only google supported for now
    if headers['Host'].find("google.com") == -1:
        return
    
    #todo: rewrite logic
    statement = GoogleHandler.parse(pkt)
    if statement:
        if statement in recents:
            # allow it to repeat eventually when it is pushed out of the deque
            recents.append(None) # filler
            return
        else:
            recents.append(statement)
        
        print statement
    

if __name__ == "__main__":
    handlers = []
    handlers.append(GoogleHandler())
    
    # sniff until interrupted
    results = sniff(filter=BPF_FILTER, prn=parse_packet)
    print repr(results)