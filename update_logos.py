import os
from bs4 import BeautifulSoup

html_dir = r"c:\Users\Ebinazer R\Videos\3 new themes\construction"
html_files = [f for f in os.listdir(html_dir) if f.endswith(".html")]

for filename in html_files:
    filepath = os.path.join(html_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    
    # Target all divs with class "logo"
    logos = soup.find_all(class_="logo")
    for logo in logos:
        logo['onclick'] = "window.location.href='index.html';"
        
        # Add style="cursor: pointer;" safely
        style = logo.get('style', '')
        if 'cursor:' not in style:
            logo['style'] = (style + '; cursor: pointer;').strip(';')
            
    # Target all divs with class "sidebar-logo"
    sidebar_logos = soup.find_all(class_="sidebar-logo")
    for logo in sidebar_logos:
        logo['onclick'] = "window.location.href='index.html';"
        
        # Add style="cursor: pointer;" safely
        style = logo.get('style', '')
        if 'cursor:' not in style:
            logo['style'] = (style + '; cursor: pointer;').strip(';')
            
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(str(soup))

print("Successfully updated all logo elements globally.")
