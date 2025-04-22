from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, session, send_from_directory
import json
import os
import datetime
import re
import uuid
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'byd_admin_secret_key'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = datetime.timedelta(hours=2)

# 邮件配置
app.config['MAIL_SERVER'] = 'smtp.example.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'admin@example.com'
app.config['MAIL_PASSWORD'] = 'password'
app.config['MAIL_DEFAULT_SENDER'] = 'admin@example.com'

# 登录尝试限制
LOGIN_ATTEMPTS = {}
MAX_LOGIN_ATTEMPTS = 5
LOGIN_COOLDOWN = 300  # 秒

# 密码重置令牌存储
PASSWORD_RESET_TOKENS = {}
TOKEN_VALID_DURATION = 3600  # 令牌有效期，单位秒

# Data paths
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
USERS_FILE = os.path.join(DATA_DIR, 'users.json')
SALES_DATA_FILE = os.path.join(DATA_DIR, 'sales_data.json')
ACTIVITY_LOG_FILE = os.path.join(DATA_DIR, 'activity_log.json')
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Create data directory if it doesn't exist
os.makedirs(DATA_DIR, exist_ok=True)

# Default data
DEFAULT_USERS = {
    "admin": {
        "password": generate_password_hash("admin123", method='pbkdf2:sha256'),
        "role": "admin",
        "display_name": "系统管理员",
        "email": "admin@example.com",
        "last_login": None,
        "created_at": datetime.datetime.now().isoformat()
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

DEFAULT_ACTIVITY_LOG = []

# User roles and permissions
ROLES = {
    "admin": {
        "name": "管理员",
        "description": "拥有系统的所有操作权限",
        "permissions": ["manage_users", "edit_sales", "view_logs", "system_settings"]
    },
    "editor": {
        "name": "编辑者",
        "description": "可以编辑销售数据",
        "permissions": ["edit_sales"]
    },
    "viewer": {
        "name": "访问者",
        "description": "只能查看数据，不能修改",
        "permissions": []
    }
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

# Initialize activity log
read_json_file(ACTIVITY_LOG_FILE, DEFAULT_ACTIVITY_LOG)

# Log user activity
def log_activity(username, action, details=None):
    logs = read_json_file(ACTIVITY_LOG_FILE, DEFAULT_ACTIVITY_LOG)
    
    log_entry = {
        "timestamp": datetime.datetime.now().isoformat(),
        "username": username,
        "action": action,
        "details": details,
        "ip_address": request.remote_addr
    }
    
    logs.insert(0, log_entry)  # Add to the beginning for latest first
    
    # Keep a reasonable number of logs (e.g., last 1000)
    if len(logs) > 1000:
        logs = logs[:1000]
    
    write_json_file(ACTIVITY_LOG_FILE, logs)

# Authentication decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'username' not in session:
            flash('请登录以访问此页面', 'error')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Permission decorator
def permission_required(permission):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'username' not in session:
                flash('请登录以访问此页面', 'error')
                return redirect(url_for('login'))
            
            if 'role' not in session:
                flash('您的账户没有角色配置', 'error')
                return redirect(url_for('dashboard'))
            
            role = session['role']
            if role == 'admin':  # Admin has all permissions
                return f(*args, **kwargs)
            
            if role in ROLES and permission in ROLES[role]['permissions']:
                return f(*args, **kwargs)
            
            flash('您没有权限执行此操作', 'error')
            return redirect(url_for('dashboard'))
        
        return decorated_function
    return decorator

# 密码强度检查
def check_password_strength(password):
    """检查密码强度"""
    # 至少8个字符
    if len(password) < 8:
        return False, "密码长度必须至少为8个字符"
    
    # 检查复杂度：至少包含一个大写字母、一个小写字母、一个数字和一个特殊字符
    if not re.search(r'[A-Z]', password):
        return False, "密码必须包含至少一个大写字母"
    
    if not re.search(r'[a-z]', password):
        return False, "密码必须包含至少一个小写字母"
    
    if not re.search(r'[0-9]', password):
        return False, "密码必须包含至少一个数字"
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "密码必须包含至少一个特殊字符"
    
    return True, "密码强度符合要求"

# 登录尝试管理
def check_login_attempts(username, ip_address):
    """检查登录尝试次数"""
    key = f"{username}_{ip_address}"
    current_time = datetime.datetime.now().timestamp()
    
    # 清理过期的尝试记录
    for k in list(LOGIN_ATTEMPTS.keys()):
        if current_time - LOGIN_ATTEMPTS[k]['timestamp'] > LOGIN_COOLDOWN:
            del LOGIN_ATTEMPTS[k]
    
    # 检查是否已被锁定
    if key in LOGIN_ATTEMPTS:
        if LOGIN_ATTEMPTS[key]['attempts'] >= MAX_LOGIN_ATTEMPTS:
            time_elapsed = current_time - LOGIN_ATTEMPTS[key]['timestamp']
            if time_elapsed < LOGIN_COOLDOWN:
                return False, int(LOGIN_COOLDOWN - time_elapsed)
            else:
                # 冷却时间已过，重置尝试次数
                del LOGIN_ATTEMPTS[key]
    
    return True, 0

# 记录登录尝试
def record_login_attempt(username, ip_address, success):
    """记录登录尝试"""
    key = f"{username}_{ip_address}"
    current_time = datetime.datetime.now().timestamp()
    
    if success:
        # 登录成功，清除尝试记录
        if key in LOGIN_ATTEMPTS:
            del LOGIN_ATTEMPTS[key]
    else:
        # 登录失败，增加尝试次数
        if key not in LOGIN_ATTEMPTS:
            LOGIN_ATTEMPTS[key] = {'attempts': 1, 'timestamp': current_time}
        else:
            LOGIN_ATTEMPTS[key]['attempts'] += 1
            LOGIN_ATTEMPTS[key]['timestamp'] = current_time

# 发送电子邮件
def send_email(to, subject, body):
    """发送电子邮件的函数"""
    try:
        msg = MIMEMultipart()
        msg['From'] = app.config['MAIL_DEFAULT_SENDER']
        msg['To'] = to
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP(app.config['MAIL_SERVER'], app.config['MAIL_PORT'])
        server.starttls()
        server.login(app.config['MAIL_USERNAME'], app.config['MAIL_PASSWORD'])
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"发送电子邮件失败: {str(e)}")
        return False

# Routes
@app.route('/')
def index():
    if 'username' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        remember = request.form.get('remember') == '1'
        
        if not username or not password:
            flash('用户名和密码不能为空', 'error')
            return render_template('login.html')
        
        # 检查登录尝试次数限制
        ip_address = request.remote_addr
        can_login, cooldown = check_login_attempts(username, ip_address)
        if not can_login:
            flash(f'登录尝试次数过多，请在{cooldown}秒后重试', 'error')
            return render_template('login.html')
        
        # 加载用户数据
        users = read_json_file(USERS_FILE, DEFAULT_USERS)
        
        if username in users and check_password_hash(users[username]['password'], password):
            # 登录成功，重置尝试次数
            record_login_attempt(username, ip_address, True)
            
            # 更新最后登录时间
            last_login = users[username].get('last_login')
            users[username]['last_login'] = datetime.datetime.now().isoformat()
            write_json_file(USERS_FILE, users)
            
            # 设置会话数据
            session['username'] = username
            session['role'] = users[username]['role']
            session['display_name'] = users[username].get('display_name', username)
            session['last_login'] = last_login
            session['permissions'] = ROLES[users[username]['role']]['permissions']
            
            # 如果记住登录，设置会话为永久
            if remember:
                session.permanent = True
                app.permanent_session_lifetime = datetime.timedelta(days=30)
            
            # 记录活动
            log_activity(username, "login", "用户登录成功")
            
            return redirect(url_for('dashboard'))
        else:
            # 登录失败，记录失败尝试
            record_login_attempt(username, ip_address, False)
            flash('用户名或密码不正确', 'error')
    
    return render_template('login.html')

@app.route('/reset-password-request', methods=['POST'])
def reset_password_request():
    """请求密码重置"""
    username = request.form.get('reset-username')
    if not username:
        flash('请输入用户名', 'error')
        return redirect(url_for('login'))
    
    # 检查用户是否存在
    users = read_json_file(USERS_FILE, DEFAULT_USERS)
    if username not in users:
        # 为了安全，我们不显示用户不存在的消息
        flash('如果该用户存在，我们已向其发送了重置链接', 'info')
        return redirect(url_for('login'))
    
    # 生成重置令牌
    token = str(uuid.uuid4())
    
    # 存储令牌与用户关联
    PASSWORD_RESET_TOKENS[token] = {
        'username': username,
        'expires': datetime.datetime.now().timestamp() + TOKEN_VALID_DURATION
    }
    
    # 发送重置邮件
    reset_url = url_for('reset_password', token=token, _external=True)
    email = users[username].get('email')
    
    if not email:
        flash('该用户未设置电子邮件地址', 'error')
        return redirect(url_for('login'))
    
    email_body = f"""
    <p>您好，</p>
    <p>我们收到了重置您比亚迪汽车管理系统密码的请求。</p>
    <p>请点击下面的链接重置您的密码：</p>
    <p><a href="{reset_url}">{reset_url}</a></p>
    <p>此链接将在1小时内有效。如果您没有请求重置密码，请忽略此邮件。</p>
    <p>比亚迪汽车管理系统团队</p>
    """
    
    if send_email(email, "密码重置请求 - 比亚迪汽车管理系统", email_body):
        flash('密码重置链接已发送到您的邮箱', 'success')
        log_activity(username, "password_reset_request", "用户请求密码重置")
    else:
        flash('发送重置邮件失败，请联系管理员', 'error')
    
    return redirect(url_for('login'))

@app.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    """处理密码重置"""
    # 检查令牌是否有效
    if token not in PASSWORD_RESET_TOKENS:
        flash('无效或已过期的重置链接', 'error')
        return redirect(url_for('login'))
    
    token_data = PASSWORD_RESET_TOKENS[token]
    
    # 检查令牌是否过期
    if datetime.datetime.now().timestamp() > token_data['expires']:
        del PASSWORD_RESET_TOKENS[token]
        flash('重置链接已过期', 'error')
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        if not password or not confirm_password:
            flash('请填写所有字段', 'error')
            return render_template('reset_password.html', token=token)
        
        if password != confirm_password:
            flash('两次输入的密码不匹配', 'error')
            return render_template('reset_password.html', token=token)
        
        # 检查密码强度
        is_strong, message = check_password_strength(password)
        if not is_strong:
            flash(message, 'error')
            return render_template('reset_password.html', token=token)
        
        # 更新密码
        username = token_data['username']
        users = read_json_file(USERS_FILE, DEFAULT_USERS)
        
        if username in users:
            users[username]['password'] = generate_password_hash(password, method='pbkdf2:sha256')
            write_json_file(USERS_FILE, users)
            
            # 删除已使用的令牌
            del PASSWORD_RESET_TOKENS[token]
            
            # 记录活动
            log_activity(username, "password_reset", "用户重置了密码")
            
            flash('密码已成功重置，请使用新密码登录', 'success')
            return redirect(url_for('login'))
        else:
            flash('用户不存在', 'error')
            return redirect(url_for('login'))
    
    return render_template('reset_password.html', token=token)

@app.route('/logout')
def logout():
    if 'username' in session:
        log_activity(session['username'], "logout")
    
    session.pop('username', None)
    session.pop('role', None)
    session.pop('display_name', None)
    session.pop('permissions', None)
    flash('您已成功退出登录', 'info')
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    # Safely load sales data
    sales_data = read_json_file(SALES_DATA_FILE, DEFAULT_SALES_DATA)
    
    # Get recent activity for admins
    recent_activity = []
    if session['role'] == 'admin':
        logs = read_json_file(ACTIVITY_LOG_FILE, DEFAULT_ACTIVITY_LOG)
        recent_activity = logs[:10]  # Get the 10 most recent activities
    
    return render_template('dashboard.html', sales_data=sales_data, recent_activity=recent_activity)

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
@permission_required('edit_sales')
def update_sales():
    data = request.json
    
    # Log the update
    log_activity(session['username'], "update_sales", {"data": "Sales data updated"})
    
    # Safely write sales data
    write_json_file(SALES_DATA_FILE, data, ensure_ascii=False)
    
    return jsonify({"success": True})

@app.route('/api/add_quarter', methods=['POST'])
@login_required
@permission_required('edit_sales')
def add_quarter():
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
    
    # Log the activity
    log_activity(session['username'], "add_quarter", {"quarter": quarter})
    
    # Safely write sales data
    write_json_file(SALES_DATA_FILE, sales_data, ensure_ascii=False)
    
    return jsonify({"success": True})

@app.route('/users')
@login_required
@permission_required('manage_users')
def users():
    # Safely read users data
    users_data = read_json_file(USERS_FILE, DEFAULT_USERS)
    
    # Don't send password hashes to the template
    users_display = {}
    for username, data in users_data.items():
        users_display[username] = {
            'role': data['role'],
            'display_name': data.get('display_name', username),
            'email': data.get('email', ''),
            'last_login': data.get('last_login', 'Never'),
            'created_at': data.get('created_at', '')
        }
    
    return render_template('users.html', users=users_display, roles=ROLES)

@app.route('/api/users', methods=['GET'])
@login_required
@permission_required('manage_users')
def get_users():
    # Safely read users data
    users_data = read_json_file(USERS_FILE, DEFAULT_USERS)
    
    # Don't send password hashes
    users_display = {}
    for username, data in users_data.items():
        users_display[username] = {
            'role': data['role'],
            'display_name': data.get('display_name', username),
            'email': data.get('email', ''),
            'last_login': data.get('last_login', 'Never'),
            'created_at': data.get('created_at', '')
        }
    
    return jsonify(users_display)

@app.route('/api/users', methods=['POST'])
@login_required
@permission_required('manage_users')
def add_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'editor')
    display_name = data.get('display_name', username)
    email = data.get('email', '')
    
    # 验证角色
    if role not in ROLES:
        return jsonify({"error": "无效的角色类型"}), 400
    
    # 安全读取用户数据
    users_data = read_json_file(USERS_FILE, DEFAULT_USERS)
    
    if username in users_data:
        return jsonify({"error": "用户名已存在"}), 400
    
    # 验证用户名格式
    if not re.match(r'^[a-zA-Z0-9_]{3,20}$', username):
        return jsonify({"error": "用户名只能包含字母、数字和下划线，长度3-20个字符"}), 400
    
    # 验证邮箱格式
    if email and not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
        return jsonify({"error": "邮箱格式不正确"}), 400
    
    # 验证密码强度
    is_strong, message = check_password_strength(password)
    if not is_strong:
        return jsonify({"error": message}), 400
    
    # 创建新用户
    users_data[username] = {
        "password": generate_password_hash(password, method='pbkdf2:sha256'),
        "role": role,
        "display_name": display_name,
        "email": email,
        "last_login": None,
        "created_at": datetime.datetime.now().isoformat()
    }
    
    # 记录活动
    log_activity(session['username'], "add_user", {"username": username, "role": role})
    
    # 安全写入用户数据
    write_json_file(USERS_FILE, users_data)
    
    return jsonify({"success": True})

@app.route('/api/users/<username>', methods=['GET'])
@login_required
@permission_required('manage_users')
def get_user(username):
    users_data = read_json_file(USERS_FILE, DEFAULT_USERS)
    
    if username not in users_data:
        return jsonify({"error": "User not found"}), 404
    
    user_data = users_data[username]
    # Don't send password hash
    user_display = {
        'username': username,
        'role': user_data['role'],
        'display_name': user_data.get('display_name', username),
        'email': user_data.get('email', ''),
        'last_login': user_data.get('last_login', 'Never'),
        'created_at': user_data.get('created_at', '')
    }
    
    return jsonify(user_display)

@app.route('/api/users/<username>', methods=['PUT'])
@login_required
@permission_required('manage_users')
def update_user(username):
    data = request.json
    
    # 安全检查
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # 读取用户数据
    users_data = read_json_file(USERS_FILE, DEFAULT_USERS)
    
    if username not in users_data:
        return jsonify({"error": "User not found"}), 404
    
    # 获取当前用户数据
    user_data = users_data[username]
    
    # 更新字段
    if 'role' in data and data['role'] in ROLES:
        user_data['role'] = data['role']
    
    if 'display_name' in data:
        user_data['display_name'] = data['display_name']
    
    if 'email' in data:
        # 验证邮箱格式
        if data['email'] and not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', data['email']):
            return jsonify({"error": "邮箱格式不正确"}), 400
        user_data['email'] = data['email']
    
    # 更新密码（如果提供）
    if 'password' in data and data['password']:
        # 验证密码强度
        is_strong, message = check_password_strength(data['password'])
        if not is_strong:
            return jsonify({"error": message}), 400
        
        user_data['password'] = generate_password_hash(data['password'], method='pbkdf2:sha256')
    
    # 更新用户数据
    users_data[username] = user_data
    
    # 记录活动
    log_activity(session['username'], "update_user", {"username": username})
    
    # 写入更新后的数据
    write_json_file(USERS_FILE, users_data)
    
    return jsonify({"success": True})

@app.route('/api/users/<username>', methods=['DELETE'])
@login_required
@permission_required('manage_users')
def delete_user(username):
    if username == session['username']:
        return jsonify({"error": "无法删除当前登录用户"}), 400
    
    # Safely read users data
    users_data = read_json_file(USERS_FILE, DEFAULT_USERS)
    
    if username not in users_data:
        return jsonify({"error": "找不到用户"}), 404
    
    # Log activity before deletion
    log_activity(session['username'], "delete_user", {"username": username})
    
    # Delete the user
    del users_data[username]
    
    # Safely write users data
    write_json_file(USERS_FILE, users_data)
    
    return jsonify({"success": True})

@app.route('/activity-logs')
@login_required
@permission_required('view_logs')
def activity_logs():
    # Get logs data
    logs = read_json_file(ACTIVITY_LOG_FILE, DEFAULT_ACTIVITY_LOG)
    
    return render_template('activity_logs.html', logs=logs)

@app.route('/api/activity-logs')
@login_required
@permission_required('view_logs')
def get_activity_logs():
    # Get logs data
    logs = read_json_file(ACTIVITY_LOG_FILE, DEFAULT_ACTIVITY_LOG)
    
    # Get query parameters for filtering
    username = request.args.get('username')
    action = request.args.get('action')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    limit = int(request.args.get('limit', 100))
    
    # Apply filters
    filtered_logs = logs
    
    if username:
        filtered_logs = [log for log in filtered_logs if log['username'] == username]
    
    if action:
        filtered_logs = [log for log in filtered_logs if log['action'] == action]
    
    if start_date:
        filtered_logs = [log for log in filtered_logs if log['timestamp'] >= start_date]
    
    if end_date:
        filtered_logs = [log for log in filtered_logs if log['timestamp'] <= end_date]
    
    # Apply limit
    filtered_logs = filtered_logs[:limit]
    
    return jsonify(filtered_logs)

@app.route('/settings')
@login_required
@permission_required('system_settings')
def settings():
    system_info = {
        'version': '2.0',
        'flask_version': '2.3.3',
        'python_version': '3.11.5',
        'os': os.name,
        'database_type': 'JSON File System',
        'last_backup': '未备份'
    }
    
    # 检查是否有备份文件
    backup_dir = os.path.join(DATA_DIR, 'backups')
    os.makedirs(backup_dir, exist_ok=True)
    
    backups = []
    if os.path.exists(backup_dir):
        for file in os.listdir(backup_dir):
            if file.endswith('.zip'):
                file_path = os.path.join(backup_dir, file)
                timestamp = os.path.getmtime(file_path)
                date = datetime.datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')
                size = os.path.getsize(file_path) / 1024  # KB
                backups.append({
                    'filename': file,
                    'date': date,
                    'size': f"{size:.2f} KB"
                })
    
    backups.sort(key=lambda x: x['date'], reverse=True)
    if backups:
        system_info['last_backup'] = backups[0]['date']
    
    return render_template('settings.html', 
                          system_info=system_info, 
                          roles=ROLES, 
                          backups=backups)

@app.route('/api/backup', methods=['POST'])
@login_required
@permission_required('system_settings')
def backup_data():
    """创建系统数据备份"""
    import zipfile
    import tempfile
    from datetime import datetime
    
    try:
        # 创建备份目录
        backup_dir = os.path.join(DATA_DIR, 'backups')
        os.makedirs(backup_dir, exist_ok=True)
        
        # 创建备份文件名
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_filename = f"byd_backup_{timestamp}.zip"
        backup_path = os.path.join(backup_dir, backup_filename)
        
        # 创建临时目录
        with tempfile.TemporaryDirectory() as temp_dir:
            # 复制数据文件到临时目录
            for file in ['users.json', 'sales_data.json', 'activity_log.json']:
                src_path = os.path.join(DATA_DIR, file)
                if os.path.exists(src_path):
                    dst_path = os.path.join(temp_dir, file)
                    with open(src_path, 'r', encoding='utf-8') as src, open(dst_path, 'w', encoding='utf-8') as dst:
                        dst.write(src.read())
            
            # 创建备份信息文件
            info_path = os.path.join(temp_dir, 'backup_info.json')
            backup_info = {
                'timestamp': datetime.now().isoformat(),
                'version': '2.0',
                'username': session.get('username'),
                'files': ['users.json', 'sales_data.json', 'activity_log.json']
            }
            with open(info_path, 'w', encoding='utf-8') as f:
                json.dump(backup_info, f, indent=4, ensure_ascii=False)
            
            # 创建ZIP文件
            with zipfile.ZipFile(backup_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for file in os.listdir(temp_dir):
                    file_path = os.path.join(temp_dir, file)
                    zipf.write(file_path, arcname=file)
        
        # 记录活动
        log_activity(session.get('username'), 'create_backup', f"创建了数据备份: {backup_filename}")
        
        return jsonify({
            'status': 'success',
            'message': '备份创建成功',
            'filename': backup_filename,
            'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'size': f"{os.path.getsize(backup_path)/1024:.2f} KB"
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'备份创建失败: {str(e)}'
        }), 500

@app.route('/api/restore/<filename>', methods=['POST'])
@login_required
@permission_required('system_settings')
def restore_data(filename):
    """从备份恢复系统数据"""
    import zipfile
    import tempfile
    
    try:
        # 验证文件名安全性，防止路径遍历
        if '..' in filename or '/' in filename:
            return jsonify({
                'status': 'error',
                'message': '无效的文件名'
            }), 400
        
        backup_path = os.path.join(DATA_DIR, 'backups', filename)
        if not os.path.exists(backup_path):
            return jsonify({
                'status': 'error',
                'message': '备份文件不存在'
            }), 404
        
        # 创建临时目录解压文件
        with tempfile.TemporaryDirectory() as temp_dir:
            # 解压备份文件
            with zipfile.ZipFile(backup_path, 'r') as zipf:
                zipf.extractall(temp_dir)
            
            # 验证备份信息
            info_path = os.path.join(temp_dir, 'backup_info.json')
            if not os.path.exists(info_path):
                return jsonify({
                    'status': 'error',
                    'message': '无效的备份文件: 缺少备份信息'
                }), 400
            
            with open(info_path, 'r', encoding='utf-8') as f:
                backup_info = json.load(f)
            
            # 恢复数据文件
            for file in backup_info.get('files', []):
                src_path = os.path.join(temp_dir, file)
                if os.path.exists(src_path):
                    dst_path = os.path.join(DATA_DIR, file)
                    with open(src_path, 'r', encoding='utf-8') as src, open(dst_path, 'w', encoding='utf-8') as dst:
                        dst.write(src.read())
        
        # 记录活动
        log_activity(session.get('username'), 'restore_backup', f"从备份中恢复了数据: {filename}")
        
        return jsonify({
            'status': 'success',
            'message': '数据恢复成功，请刷新页面查看更新后的数据'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'数据恢复失败: {str(e)}'
        }), 500

@app.route('/api/backup/<filename>', methods=['DELETE'])
@login_required
@permission_required('system_settings')
def delete_backup(filename):
    """删除备份文件"""
    try:
        # 验证文件名安全性，防止路径遍历
        if '..' in filename or '/' in filename:
            return jsonify({
                'status': 'error',
                'message': '无效的文件名'
            }), 400
        
        backup_path = os.path.join(DATA_DIR, 'backups', filename)
        if not os.path.exists(backup_path):
            return jsonify({
                'status': 'error',
                'message': '备份文件不存在'
            }), 404
        
        # 删除备份文件
        os.remove(backup_path)
        
        # 记录活动
        log_activity(session.get('username'), 'delete_backup', f"删除了备份文件: {filename}")
        
        return jsonify({
            'status': 'success',
            'message': '备份文件已删除'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'删除备份文件失败: {str(e)}'
        }), 500

@app.route('/download-backup/<filename>')
@login_required
@permission_required('system_settings')
def download_backup(filename):
    """下载备份文件"""
    # 验证文件名安全性，防止路径遍历
    if '..' in filename or '/' in filename:
        flash('无效的文件名', 'error')
        return redirect(url_for('settings'))
    
    backup_dir = os.path.join(DATA_DIR, 'backups')
    return send_from_directory(backup_dir, filename, as_attachment=True)

@app.route('/frontend')
@login_required
def frontend():
    """Display the frontend website inside the admin interface"""
    return render_template('frontend.html')

@app.route('/frontend-assets/<path:filename>')
def frontend_assets(filename):
    """Serve static files for the frontend"""
    return send_from_directory(ROOT_DIR, filename)

@app.route('/account')
@login_required
def account():
    """User's personal account management page"""
    users_data = read_json_file(USERS_FILE, DEFAULT_USERS)
    username = session['username']
    
    if username not in users_data:
        flash('用户数据错误', 'error')
        return redirect(url_for('dashboard'))
    
    user_data = users_data[username]
    # Don't send password hash
    user_display = {
        'username': username,
        'role': user_data['role'],
        'display_name': user_data.get('display_name', username),
        'email': user_data.get('email', ''),
        'last_login': user_data.get('last_login', 'Never'),
        'created_at': user_data.get('created_at', '')
    }
    
    return render_template('account.html', user=user_display)

@app.route('/api/account', methods=['PUT'])
@login_required
def update_account():
    """更新当前用户的账户信息"""
    data = request.json
    username = session['username']
    
    # 读取用户数据
    users_data = read_json_file(USERS_FILE, DEFAULT_USERS)
    
    if username not in users_data:
        return jsonify({"error": "User not found"}), 404
    
    # 获取当前用户数据
    user_data = users_data[username]
    
    # 更新允许的字段（用户不能更改自己的角色）
    if 'display_name' in data:
        user_data['display_name'] = data['display_name']
        session['display_name'] = data['display_name']
    
    if 'email' in data:
        # 验证邮箱格式
        if data['email'] and not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', data['email']):
            return jsonify({"error": "邮箱格式不正确"}), 400
        user_data['email'] = data['email']
    
    # 更新密码（如果提供）
    if 'current_password' in data and 'new_password' in data:
        if not check_password_hash(user_data['password'], data['current_password']):
            return jsonify({"error": "当前密码不正确"}), 400
        
        # 验证新密码强度
        is_strong, message = check_password_strength(data['new_password'])
        if not is_strong:
            return jsonify({"error": message}), 400
        
        user_data['password'] = generate_password_hash(data['new_password'], method='pbkdf2:sha256')
    
    # 更新用户数据
    users_data[username] = user_data
    
    # 记录活动
    log_activity(username, "update_account")
    
    # 写入更新后的数据
    write_json_file(USERS_FILE, users_data)
    
    return jsonify({"success": True})

@app.route('/api/sales/analysis', methods=['GET'])
@login_required
def sales_analysis():
    """提供更高级的销售数据分析功能"""
    analysis_type = request.args.get('type', 'model_comparison')
    models = request.args.getlist('models')
    quarters = request.args.getlist('quarters')
    
    # 读取销售数据
    sales_data = read_json_file(SALES_DATA_FILE, DEFAULT_SALES_DATA)
    quarterly_sales = sales_data['quarterly_sales']
    
    if analysis_type == 'model_comparison':
        # 准备车型间比较数据
        result = {
            'models': [],
            'quarters': [],
            'data': []
        }
        
        # 筛选季度
        if quarters:
            filtered_quarters = [q for q in quarterly_sales if q['quarter'] in quarters]
        else:
            filtered_quarters = quarterly_sales
        
        # 按季度排序
        filtered_quarters.sort(key=lambda x: x['quarter'])
        
        # 提取季度列表
        result['quarters'] = [q['quarter'] for q in filtered_quarters]
        
        # 如果没有指定模型，使用所有模型
        all_models = set()
        for quarter in filtered_quarters:
            for model in quarter['models']:
                all_models.add(model['name'])
        
        target_models = models if models else list(all_models)
        result['models'] = target_models
        
        # 为每个模型构建销量数据
        for model_name in target_models:
            model_data = []
            for quarter in filtered_quarters:
                model_found = False
                for model in quarter['models']:
                    if model['name'] == model_name:
                        model_data.append({
                            'sales': model['sales'],
                            'change': model.get('change', 0)
                        })
                        model_found = True
                        break
                if not model_found:
                    model_data.append({
                        'sales': 0,
                        'change': 0
                    })
            
            result['data'].append({
                'model': model_name,
                'sales': model_data
            })
    
    elif analysis_type == 'quarterly_growth':
        # 计算季度间增长率
        result = {
            'quarters': [],
            'growth_data': []
        }
        
        # 按季度排序
        quarterly_sales.sort(key=lambda x: x['quarter'])
        
        # 提取季度列表
        result['quarters'] = [q['quarter'] for q in quarterly_sales]
        
        # 计算每个车型的季度环比增长率
        for i in range(1, len(quarterly_sales)):
            current_quarter = quarterly_sales[i]
            prev_quarter = quarterly_sales[i-1]
            
            growth_items = []
            
            # 对当前季度的每个车型计算增长率
            for curr_model in current_quarter['models']:
                # 寻找上一季度相同车型
                prev_sales = 0
                for prev_model in prev_quarter['models']:
                    if prev_model['name'] == curr_model['name']:
                        prev_sales = prev_model['sales']
                        break
                
                # 计算增长率
                if prev_sales > 0:
                    growth_rate = ((curr_model['sales'] - prev_sales) / prev_sales) * 100
                else:
                    growth_rate = 100  # 新增车型，设置为100%增长
                
                growth_items.append({
                    'model': curr_model['name'],
                    'previous_sales': prev_sales,
                    'current_sales': curr_model['sales'],
                    'growth_rate': round(growth_rate, 2)
                })
            
            # 按增长率排序
            growth_items.sort(key=lambda x: x['growth_rate'], reverse=True)
            
            result['growth_data'].append({
                'quarter_comparison': f"{prev_quarter['quarter']} → {current_quarter['quarter']}",
                'items': growth_items
            })
    
    elif analysis_type == 'market_share':
        # 计算市场份额
        result = {
            'quarters': [],
            'share_data': []
        }
        
        # 筛选季度
        if quarters:
            filtered_quarters = [q for q in quarterly_sales if q['quarter'] in quarters]
        else:
            filtered_quarters = quarterly_sales
            
        # 按季度排序
        filtered_quarters.sort(key=lambda x: x['quarter'])
        
        # 提取季度列表
        result['quarters'] = [q['quarter'] for q in filtered_quarters]
        
        # 计算每个季度的市场份额
        for quarter in filtered_quarters:
            total_sales = sum(model['sales'] for model in quarter['models'])
            
            share_items = []
            for model in quarter['models']:
                share = (model['sales'] / total_sales) * 100 if total_sales > 0 else 0
                share_items.append({
                    'model': model['name'],
                    'sales': model['sales'],
                    'share': round(share, 2)
                })
            
            # 按市场份额排序
            share_items.sort(key=lambda x: x['share'], reverse=True)
            
            result['share_data'].append({
                'quarter': quarter['quarter'],
                'total_sales': total_sales,
                'items': share_items
            })
    
    return jsonify(result)

@app.route('/analysis')
@login_required
def analysis():
    """数据分析页面"""
    # 安全加载销售数据
    sales_data = read_json_file(SALES_DATA_FILE, DEFAULT_SALES_DATA)
    
    return render_template('analysis.html', sales_data=sales_data)

if __name__ == '__main__':
    app.run(debug=True) 