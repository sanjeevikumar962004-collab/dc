import os
import re
import random

html_dir = r"c:\Users\Ebinazer R\Videos\3 new themes\construction"
image_dir = os.path.join(html_dir, "image")

# Get list of local images
local_images = []
for f in os.listdir(image_dir):
    if f.endswith(".webp") or f.endswith(".jpg") or f.endswith(".png"):
        local_images.append(f"image/{f}")

if not local_images:
    print("No local images found.")
    exit(1)

html_files = [f for f in os.listdir(html_dir) if f.endswith(".html")]

unsplash_pattern = re.compile(r'https://images\.unsplash\.com/[^\'"\s)]+')

for filename in html_files:
    filepath = os.path.join(html_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Find all matches
    matches = unsplash_pattern.findall(content)
    
    if matches:
        print(f"Replacing {len(matches)} links in {filename}")
        for match in matches:
            # Pick a random image
            replacement = random.choice(local_images)
            content = content.replace(match, replacement, 1)
            
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(content)
    else:
        print(f"No Unsplash links found in {filename}")

print("Replacement complete.")
