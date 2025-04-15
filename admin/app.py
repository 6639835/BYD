from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, session, send_from_directory
import json
import os
import datetime
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'byd_admin_secret_key'

# Data paths
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
USERS_FILE = os.path.join(DATA_DIR, 'users.json')
SALES_DATA_FILE = os.path.join(DATA_DIR, 'sales_data.json')
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Create data directory if it doesn't exist
os.makedirs(DATA_DIR, exist_ok=True)

# Default data
DEFAULT_USERS = {
    "admin": {
        "password": generate_password_hash("admin123", method='pbkdf2:sha256'),
        "role": "admin"
    }
}

DEFAULT_SALES_DATA = {
    "quarterly_sales": [
        {
            "quarter": "2024Q1",
            "models": [
                {"name": "宋PLUS", "sales": 125678, "change": 15.2},
                {"name": "秦PLUS", "sales": 98765, "change": 10.5},
                {"name": "汉", "sales": 85432, "change": 8.3},
                {"name": "海豚", "sales": 75321, "change": 25.1},
                {"name": "元PLUS", "sales": 65432, "change": 12.8}
            ]
        }
    ]
}

# Helper function to safely read a JSON file
def read_json_file(file_path, default_data):
    try:
        if os.path.exists(file_path) and os.path.getsize(file_path) > 0:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        # If file doesn't exist or is empty, initialize it with default data
        write_json_file(file_path, default_data)
        return default_data
    except json.JSONDecodeError:
        # If file is corrupted, initialize it with default data
        write_json_file(file_path, default_data)
        return default_data

# Helper function to safely write a JSON file
def write_json_file(file_path, data, ensure_ascii=True):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=ensure_ascii)

# Initialize users data
read_json_file(USERS_FILE, DEFAULT_USERS)

# Initialize sales data
read_json_file(SALES_DATA_FILE, DEFAULT_SALES_DATA)

# Authentication decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'username' not in session:
            flash('Please login to access this page', 'error')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Routes
@app.route('/')
def index():
    if 'username' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        # Safely read the users file
        users = read_json_file(USERS_FILE, DEFAULT_USERS)
        
        if username in users and check_password_hash(users[username]['password'], password):
            session['username'] = username
            session['role'] = users[username]['role']
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password', 'error')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    session.pop('role', None)
    flash('You have been logged out', 'info')
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    # Safely load sales data
    sales_data = read_json_file(SALES_DATA_FILE, DEFAULT_SALES_DATA)
    
    return render_template('dashboard.html', sales_data=sales_data)

@app.route('/sales')
@login_required
def sales():
    # Safely load sales data
    sales_data = read_json_file(SALES_DATA_FILE, DEFAULT_SALES_DATA)
    
    return render_template('sales.html', sales_data=sales_data)

@app.route('/api/sales', methods=['GET'])
@login_required
def get_sales():
    # Safely load sales data
    sales_data = read_json_file(SALES_DATA_FILE, DEFAULT_SALES_DATA)
    
    return jsonify(sales_data)

@app.route('/api/sales', methods=['POST'])
@login_required
def update_sales():
    if session['role'] != 'admin':
        return jsonify({"error": "Permission denied"}), 403
    
    data = request.json
    
    # Safely write sales data
    write_json_file(SALES_DATA_FILE, data, ensure_ascii=False)
    
    return jsonify({"success": True})

@app.route('/api/add_quarter', methods=['POST'])
@login_required
def add_quarter():
    if session['role'] != 'admin':
        return jsonify({"error": "Permission denied"}), 403
    
    data = request.json
    quarter = data.get('quarter')
    models = data.get('models', [])
    
    # Safely read sales data
    sales_data = read_json_file(SALES_DATA_FILE, DEFAULT_SALES_DATA)
    
    # Check if quarter already exists
    for idx, q in enumerate(sales_data['quarterly_sales']):
        if q['quarter'] == quarter:
            sales_data['quarterly_sales'][idx]['models'] = models
            break
    else:
        # Quarter doesn't exist, add it
        sales_data['quarterly_sales'].append({
            'quarter': quarter,
            'models': models
        })
    
    # Safely write sales data
    write_json_file(SALES_DATA_FILE, sales_data, ensure_ascii=False)
    
    return jsonify({"success": True})

@app.route('/users')
@login_required
def users():
    if session['role'] != 'admin':
        flash('Permission denied', 'error')
        return redirect(url_for('dashboard'))
    
    # Safely read users data
    users_data = read_json_file(USERS_FILE, DEFAULT_USERS)
    
    # Don't send password hashes to the template
    users_display = {username: {'role': data['role']} for username, data in users_data.items()}
    
    return render_template('users.html', users=users_display)

@app.route('/api/users', methods=['GET'])
@login_required
def get_users():
    if session['role'] != 'admin':
        return jsonify({"error": "Permission denied"}), 403
    
    # Safely read users data
    users_data = read_json_file(USERS_FILE, DEFAULT_USERS)
    
    # Don't send password hashes
    users_display = {username: {'role': data['role']} for username, data in users_data.items()}
    
    return jsonify(users_display)

@app.route('/api/users', methods=['POST'])
@login_required
def add_user():
    if session['role'] != 'admin':
        return jsonify({"error": "Permission denied"}), 403
    
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'editor')
    
    # Safely read users data
    users_data = read_json_file(USERS_FILE, DEFAULT_USERS)
    
    if username in users_data:
        return jsonify({"error": "Username already exists"}), 400
    
    users_data[username] = {
        "password": generate_password_hash(password, method='pbkdf2:sha256'),
        "role": role
    }
    
    # Safely write users data
    write_json_file(USERS_FILE, users_data)
    
    return jsonify({"success": True})

@app.route('/api/users/<username>', methods=['DELETE'])
@login_required
def delete_user(username):
    if session['role'] != 'admin':
        return jsonify({"error": "Permission denied"}), 403
    
    if username == session['username']:
        return jsonify({"error": "Cannot delete yourself"}), 400
    
    # Safely read users data
    users_data = read_json_file(USERS_FILE, DEFAULT_USERS)
    
    if username not in users_data:
        return jsonify({"error": "User not found"}), 404
    
    del users_data[username]
    
    # Safely write users data
    write_json_file(USERS_FILE, users_data)
    
    return jsonify({"success": True})

@app.route('/frontend')
@login_required
def frontend():
    """Display the frontend website inside the admin interface"""
    return render_template('frontend.html')

@app.route('/frontend-assets/<path:filename>')
def frontend_assets(filename):
    """Serve static files for the frontend"""
    return send_from_directory(ROOT_DIR, filename)

if __name__ == '__main__':
    app.run(debug=True) 