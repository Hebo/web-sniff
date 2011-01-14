from scapy.all import sr1,IP, ICMP, sniff
import urllib
import re
import collections

# BPF filter to capture all IPv4 HTTP packets to and from port 80, 
# i.e. print only packets that contain data, not, for example, SYN and FIN
# packets and ACK-only packets
BPF_FILTER = "tcp port 80 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)"

re_headers = re.compile(r'(?P<name>.*?): (?P<value>.*?)\r\n')

# Since google stores multiple searches in the url, we first try to locate
# the most recent one, if it exists
re_google = re.compile(r'^GET /search\?\S*[\?&]q=([^&]+).*(?:&q=([^&]+))?.* HTTP/1.1')

# store recent queries in double ended queue to avoid lots of duplication
recents = collections.deque(maxlen=20)

def packet_parse(pkt):
    # parse out http headers 
    # pkt.load contains raw http request
    headers = dict(re_headers.findall(pkt.load))
    if not headers.has_key("Host"):
        return
    
    # only google supported for now
    if headers['Host'].find("google.com") == 1:
        return
    
    # get search query
    match = re_google.match(pkt.load)
    if not match:
        return
    query = urllib.unquote_plus(match.group(1))
    
    if query in recents:
        # allow it to repeat eventually when it is pushed out of the deque
        recents.append(None) # filler
        return
    else:
        recents.append(query)
    
    # craft statement to print
    statement =  "{0} > ".format(pkt.payload.src)
    statement += "Google: \"{0}\"".format(query)
    
    print statement

# sniff until interrupted
results = sniff(filter=BPF_FILTER, prn=packet_parse)
print repr(results)