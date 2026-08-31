COMP1649 LECTURE READER — VERSION 2

STRUCTURE
---------
index.html
css/style.css
js/app.js
js/slides.js
slides/slide-1.html
slides/slide-3.html
...

HOW CONTENT WORKS
-----------------
Each slide is a separate HTML file.

Example:
slides/slide-17.html

You can edit the lecture content directly in that file without touching app.js.

To add a completely new slide:
1. Create a new file, for example: slides/slide-37.html
2. Add the HTML content.
3. Add only its metadata to js/slides.js.

RUNNING LOCALLY
---------------
Because the website uses fetch() to load slide HTML files, do NOT simply double-click index.html.

Option A — Python:
python3 -m http.server 8000
Then open http://localhost:8000

Option B — VS Code:
Use the Live Server extension.

Option C — Deploy:
GitHub Pages, Netlify, Vercel, Apache, or Nginx.

MOBILE DESIGN
-------------
- Uses 100dvh.
- Header and bottom navigation stay outside the scrolling content.
- Only lecture content scrolls.
- On small phones the slide uses the full width rather than a desktop card.
- Previous/Next remain reachable.
- Swipe left/right changes slides.

OPTIONAL HTML CLASSES
---------------------
<div class="highlight">Important idea</div>
<div class="note">Teaching note</div>
<div class="example">Example</div>
<img src="images/example.png" alt="Description">
