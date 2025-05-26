
# **How I Scraped Data from EEX**

While building my Clean Spark Spread Dashboard ([check it here](#)), I needed up-to-date natural gas spot prices. I wanted a free, automated way to pull this data — and ended up trying to scrape it from the EEX website: [https://www.eex.com/en/market-data/market-data-hub/natural-gas/spot](https://www.eex.com/en/market-data/market-data-hub/natural-gas/spot).

Of course, it wasn't as easy as I expected: basic methods based on Python's modules `requests` and `BeautifulSoup` did not appear to work properly, and I'm far from being an expert in web scraping. But after some trial and error, I found a reliable (if not perfect) solution using Selenium. Since several people asked me how I did it, I’m sharing the full method and code in this post.

---

## **Pre-requisites**

I used:

- **Selenium** for browser automation  
- **Pandas** for data manipulation  
- **ChromeDriver** (or another browser driver) installed for Selenium to work  
- Optional: `logging` and `datetime` to keep track of script execution and saved files

---

## **Setting Up Selenium**

The first step is to set up Selenium by importing the necessary functions:

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
```

Then, specify the Chrome options:

```python
options = Options()  # creates a ChromeOptions object to customize how Chrome behaves
options.add_argument("--headless")  # runs Chrome without opening a visible window
options.add_argument("--no-sandbox")  # disables Chrome’s security sandboxing features
options.add_argument("--disable-dev-shm-usage")  # avoids Chrome using /dev/shm (shared memory)
```

Calling the driver:

```python
# Necessary to have chromedriver installed (in the same folder or in PATH)
driver = webdriver.Chrome(options=options)
```

---

## **Connecting to the Page**

The data can be found at [EEX Natural Gas Spot Market](https://www.eex.com/en/market-data/market-data-hub/natural-gas/spot). There is a table, updated every day, which contains prices for different spot products (TTF, NBP, PEG...).

![EEX Table](./images/2025-05-26_eex_table.png)

I started by connecting to the page:

```python
driver.get("https://www.eex.com/en/market-data/market-data-hub/natural-gas/spot")
```

Then, I had to identify the correct location of the table. To do that, right-click on the page and select **"Inspect"**. It opens the DOM (Document Object Model), where you can locate the exact HTML element that contains the table. When you hover over the lines in the DOM, it will highlight the corresponding element in the page.

Once you have done that, right-click on the table element and choose **"Copy full XPath"** (`"/html/body/main/div[2]/div/div/div[2]/div/table"` in this case).

> I used XPath to locate the table, but if you're maintaining this long-term, it's safer to use a class name or other attribute if available. XPath is sensitive to layout changes.

---

## **Extracting the Table and Saving to CSV**

```python
table_xpath = "/html/body/main/div[2]/div/div/div[2]/div/table"
table_element = wait.until(
    EC.presence_of_element_located((By.XPATH, table_xpath))
)
html_string = driver.execute_script(
    "return arguments[0].outerHTML;", table_element
)

# To ensure correct formatting of captured values
html_string = html_string.replace("\u202f", "")

# Create CSV file
df = pd.read_html(StringIO(html_string), decimal=",", thousands=" ")[0]
df.to_csv(output_file, index=False)
```

You may note in the code just above that I added two things:  
1. I used `"wait"` to be sure the content of the table has been rendered before collecting it.  
2. I added this line: `html_string = html_string.replace("\u202f", "")` to correct the format of the extracted data.

You can now schedule this script to run daily (e.g. with Windows Task Scheduler or a cron job) and build a historical database.

---

## **Potential Pitfalls**

In the end, it’s not very complex to get the data, but you can only collect data for the **current day**, so it will take time to create a solid database (that’s why I only have data from April 2025 in my projects). For natural gas spot prices, you can find data going back **45 days**, but you'll have to collect each data point manually.

Also, keep in mind that the EEX layout might change — and when it does, the script will likely break.

Eventually, you might run into anti-bot issues. EEX doesn’t usually throw captchas at light scraping, but if you’re making too many requests or acting too much like a robot, you could get blocked. Play nice: add pauses and avoid hammering their servers.

---

## **Full Code**

You'll find my scraper function below. I’ve also added a `try/except` block in case EEX asks you to accept cookies.
