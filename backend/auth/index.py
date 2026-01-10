"""API для регистрации и авторизации пользователей"""
import json
import os
import hashlib
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Создание подключения к базе данных"""
    db_url = os.environ.get('SUPABASE_TX') or os.environ.get('DATABASE_URL')
    return psycopg2.connect(db_url)

def hash_password(password: str) -> str:
    """Хеширование пароля"""
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    """Обработчик запросов регистрации и авторизации"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        if action == 'register':
            return register_user(body)
        elif action == 'login':
            return login_user(body)
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid action'})
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def register_user(data: dict) -> dict:
    """Регистрация нового пользователя"""
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    phone = data.get('phone', '')
    
    if not all([email, password, first_name, last_name]):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing required fields'})
        }
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Проверка существования пользователя
            cur.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cur.fetchone():
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email already registered'})
                }
            
            # Создание пользователя
            password_hash = hash_password(password)
            cur.execute(
                """INSERT INTO users (email, password_hash, first_name, last_name, phone)
                   VALUES (%s, %s, %s, %s, %s) RETURNING id, email, first_name, last_name, phone""",
                (email, password_hash, first_name, last_name, phone)
            )
            user = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'user': dict(user)
                })
            }
    finally:
        conn.close()

def login_user(data: dict) -> dict:
    """Авторизация пользователя"""
    email = data.get('email')
    password = data.get('password')
    
    if not all([email, password]):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing email or password'})
        }
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            password_hash = hash_password(password)
            cur.execute(
                """SELECT id, email, first_name, last_name, phone
                   FROM users WHERE email = %s AND password_hash = %s""",
                (email, password_hash)
            )
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid credentials'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'user': dict(user)
                })
            }
    finally:
        conn.close()