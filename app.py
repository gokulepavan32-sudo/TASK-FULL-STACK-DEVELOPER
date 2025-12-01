from flask import Flask, render_template, request, jsonify, redirect, url_for

app = Flask(__name__)

# In-memory storage for content
content_store = []

@app.route('/')
def home():
    return redirect(url_for('add_content'))

@app.route('/add', methods=['GET', 'POST'])
def add_content():
    if request.method == 'POST':
        title = request.form.get('title', '').strip()
        content = request.form.get('content', '').strip()
        
        if title and content:
            content_store.append({
                'id': len(content_store) + 1,
                'title': title,
                'content': content
            })
            return redirect(url_for('display_content'))
    
    return render_template('add.html')

@app.route('/display')
def display_content():
    return render_template('display.html', contents=content_store)

@app.route('/api/content')
def api_content():
    return jsonify(content_store)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)