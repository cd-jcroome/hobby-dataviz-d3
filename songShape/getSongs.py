from bs4 import BeautifulSoup as bs
import requests
import urllib
import sys
import re

_URL = 'https://free-midi.org/download'

# get list of all locations for artists songs, e.g. "3-17152-a-boys-best-friend-white-stripes"
artist_page = requests.get(sys.argv[1])
soup = bs(artist_page.text, "html.parser")

tracks = soup.select('div[itemprop="tracks"]')
print(tracks)
# hit freemidi.org/getter-[location]
# print(soup)
# download midi file to artist folder
