import csv
from bs4 import BeautifulSoup
import requests

# this is for fox business

def vox_webscapper():
    url = "https://www.vox.com/"
    website = requests.get(url)
    text = website.text
    soup = BeautifulSoup(text, "html.parser")
    content = soup.find_all("a")

    #loops through the soup to find all of the articles and links
    list = []
    id = 0
    for item in content:
        temp = item.text.strip().strip("\n")
        if len(temp) <= 45:
            pass
        else:
            link = item.get('href')
            list.append([id, temp, link])
            id += 1

    # creates a new csv file and writes the list to the file
    with open('voxHome.csv', 'w') as csvfile:
        fieldnames = ['id', 'content', 'link']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for item in list:
            writer.writerow({'id': item[0], 'content': item[1], 'link': item[2]})
    
    print('Vox has been scrapped.')

