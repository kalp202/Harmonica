# Importing required libraries
from bs4 import BeautifulSoup as bs
import requests
import argparse
import logging
import datetime
import time

# Importing custom defined storage class
from storage_class import Songs

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s:  %(message)s',
    level=logging.INFO
)

logger = logging.getLogger(__name__)

# Declaring variables for collecting info
HOST = "http://myswar.co/{}"

DEFAULT_OUT_DIR = './'
DEFAULT_FILE_NAME = 'songs.csv'


# Function to get URL for albums of the year
def _get_year_url(current_year):
    year_string = "album/year/{}"
    url_for_year = HOST.format(year_string.format(current_year))
    return url_for_year


def getPage(url):
    response = None
    connecting = 0
    while not response:
        try:
            response = requests.get(url)
            response.raise_for_status()
        except requests.exceptions.ConnectionError:
            print("A connection error occurred. Please check your internet connection.")
            time.sleep(5)
        except requests.exceptions.Timeout:
            print("The request timed out.")
            connecting+=1
            time.sleep(2)
            if connecting > 3:
                return None
        except requests.exceptions.HTTPError:
            return None
        except requests.exceptions.RequestException as e:
            print("An error occurred:", e)
            return None    
    return response

# Function to get total pages for an year
def _get_total_pages(current_year):
    url_for_year = _get_year_url(current_year)
    response = getPage(url_for_year)
    
    if not response:
        return 0

    attrs = {
        'title': 'Go to last page'
    }
    parsed_page = bs(response.content, 'html5lib')
    total_pages_link = parsed_page.find('a', attrs=attrs)['href']
    total_pages = total_pages_link.split('?')[0].split('year/')[1] \
        .split('/')[1]
    return int(total_pages)


# Function to get the album title and link
def _get_album_from_table(album_table):
    name = album_table.tbody.tr.td.a['title']
    link = album_table.tbody.tr.td.a['href']
    return [name, link]


# Retrieves all albums from a page
def _get_albums_for_a_page(album_year, page):
    url_for_year = _get_year_url(album_year)
    url_for_page = url_for_year + "/{}".format(page)
    all_albums = []
    response = getPage(url_for_page)
    if not response:
        return all_albums
    div_attrs = {
        'class': 'albumlisting_width'
    }
    table_attrs = {
        'class': 'song_detail_display_table'
    }
    parsed_page = bs(response.content, 'html5lib')
    albums_div = parsed_page.find('div', attrs=div_attrs)
    all_albums_tables = albums_div.findAll('table', attrs=table_attrs)
    for album_table in all_albums_tables:
        all_albums.append(_get_album_from_table(album_table))
    return all_albums


def get_poster(parsed):
    try:
        img_link = parsed.find_all('img', {"class": "img_albumart"})[
            0].get_attribute_list("src")[0]
        img_link = img_link.split("/")
        img_link[-1] = "200x200.jpg"
        return "/".join(img_link)
    except : 
        return None

# Function to get song tables from the album
def _get_songs_from_albums(album_list, songs_store, year):
    total_processed = 0
    for album in album_list:
        attrs = {
            'class': 'song_detail_display_table'
        }
        response = getPage(album[1])
        if not response:
            return 0
        parsed_page = bs(response.content, 'html5lib')
        songs_tables = parsed_page.findAll('table', attrs=attrs)
        for song_table in songs_tables:
            lst_songs = _get_songs_details_from_table(album[0],song_table)
            total_processed = _process_song(
                lst_songs,
                songs_store,
                album[0],
                year,
                get_poster(parsed_page)
            )
    return total_processed


def get_song_name(song_table):
    try:
        song_name = song_table.find('a').get_text().strip()
        return song_name
    except:
        return None


def get_download_link(song_table):
    try:
        link_list = song_table.find_all("tr")[1].find_all('a')
        link_list = list(
            map(lambda x: x.get_attribute_list("href")[0], link_list))
        link_list = list(filter(lambda x: x.startswith(
            "https://www.youtube.com"), link_list))[0]
        return link_list
    except:
        return None


def get_meta_data(song_table):
    res = dict({})
    try:
        all_types = song_table.find_all("tr")[2].find_all(
            "span", {"class": "attribute_lable"})
        for types in all_types:
            text = types.find_next_sibling().get_text().split(",")
            curr_text = types.get_text()
            if curr_text.startswith("Singer"):
                res['singer'] = text
            elif curr_text.startswith("Music Director"):
                res['director'] = text
            elif curr_text.startswith("Lyricist"):
                res['lyricist'] = text
            elif curr_text.startswith("Genre"):
                res['genre'] = text

        return res
    except:
        return res

# Retrieve relavant information from the song table
def _get_songs_details_from_table(albumname, song_table):
    song_name = get_song_name(song_table)
    print(song_name)
    download_link = get_download_link(song_table)
    meta_data = get_meta_data(song_table)
    return [
            song_name, 
            download_link,
            meta_data.get('singer'),
            meta_data.get('director'),
            meta_data.get('lyricist'),
            meta_data.get('genre'),
        ]


# Add song to the storage class
def _process_song(song_details, songs_storage, album_name, current_year, poster):
    if song_details:
        total = songs_storage.add_item(
            title=song_details[0],
            singers=song_details[2],
            directors=song_details[3],
            lyricist=song_details[4],
            genre=song_details[5],
            album=album_name,
            download_link=song_details[1],
            poster=poster,
            year=current_year,
        )
        return total
    else:
        return 0


# Driver function
def main(current_year, out_dir=DEFAULT_OUT_DIR, file_name=DEFAULT_FILE_NAME):
    logger.info("Started for year{}".format(current_year))
    songs_storage = Songs(
        current_year,
        out_dir,
        file_name
    )
    total_pages = _get_total_pages(current_year)
    logger.info("Total pages : {}".format(total_pages))
    for page in range(1, total_pages + 1):
        logger.info("Started fetching data for page : {}".format(page))
        albums_of_page = _get_albums_for_a_page(
            current_year,
            page
        )
        logger.info("Total albums on page : {}".format(len(albums_of_page)))
        processed_songs = _get_songs_from_albums(
            albums_of_page,
            songs_storage,
            current_year
        )
        if processed_songs != 0:
            logger.info("Total songs processed after page {} : {}"
                        .format(page, processed_songs))
    total_songs_added = songs_storage.commit()
    logger.info("Total Songs Written to disk : {}".format(total_songs_added))


# Parameters for execution
if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Get Hindi songs',
        add_help=True,
    )
    parser.add_argument(
        '--year',
        help='Get data for an year.')
    parser.add_argument(
        '--dir',
        help='Specify output directory')
    parser.add_argument(
        '--file',
        help='Specify file name')
    args = parser.parse_args()
    if args.year:
        year = args.year
    else:
        year = datetime.datetime.now().year
    if args.dir:
        output_dir = args.dir
    else:
        output_dir = DEFAULT_OUT_DIR
    if args.file:
        output_file = args.file
    else:
        output_file = DEFAULT_FILE_NAME
    
    main(year, output_dir, output_file)

