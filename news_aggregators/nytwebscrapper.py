import csv
from bs4 import BeautifulSoup
import requests

def nyt_webscapper():
    url = "https://www.nytimes.com/"
    website = requests.get(url)
    text = website.text
    soup = BeautifulSoup(text, "html.parser")
    content = soup.find_all("a")

    #loops through the soup to find all of the articles and links
    list = []
    id = 0
    for item in content:
        temp = item.text.strip()
        if len(temp) <= 45:
            pass
        else:
            link = item.get('href')
            if 'interactive' in link:
                pass
            else: 
                list.append([id, temp, link])
                id += 1

    # creates a new csv file and writes the list to the file
    with open('nytHome.csv', 'w') as csvfile:
        fieldnames = ['id', 'content', 'link']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for item in list:
            writer.writerow({'id': item[0], 'content': item[1], 'link': item[2]})

    print('The New York Times has been scrapped.')