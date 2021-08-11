#imports that will be used for the project
from bs4 import BeautifulSoup
import requests
import csv

# scraps information from fox news

def fox_webscapper (): 
    url = "https://www.foxnews.com/"
    website = requests.get(url)
    text = website.text
    soup = BeautifulSoup(text, "html.parser")
    content = soup.find_all("a")

    #loops through the soup to find all of the articles and links
    list = []
    id = 0
    for item in content:
        temp = item.text
        link = item['href']
        if len(temp) <= 45:
            pass
        else:
        #list.append([id, ' '.join(temp)])
            list.append([id, temp, link])
            id += 1

    # creates a new csv file and writes the list to the file
    with open('foxnews.csv', 'w') as csvfile:
        fieldnames = ['id', 'content', 'link']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for item in list:
            writer.writerow({'id': item[0], 'content': item[1], 'link': item[2]})

    print('Fox News has been scrapped.')
