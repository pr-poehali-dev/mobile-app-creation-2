"""API для управления бронированиями сеансов в бассейне"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta

def get_db_connection():
    """Создание подключения к базе данных"""
    return psycopg2.connect(
        os.environ['SUPABASE_TX'],
        options='-c client_encoding=UTF8'
    )

def handler(event: dict, context) -> dict:
    """Обработчик запросов бронирования"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    try:
        if method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            user_id = query_params.get('userId')
            session_date = query_params.get('date')
            
            if user_id:
                return get_user_bookings(int(user_id))
            elif session_date:
                return get_sessions_by_date(session_date)
            else:
                return get_upcoming_sessions()
                
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'book':
                return book_session(body)
            elif action == 'cancel':
                return cancel_booking(body)
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid action'})
                }
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def get_upcoming_sessions() -> dict:
    """Получение предстоящих сеансов"""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT s.id, s.session_date, s.start_time, s.end_time,
                       s.available_slots, s.total_slots,
                       t.name as trainer_name, t.specialization
                FROM sessions s
                LEFT JOIN trainers t ON s.trainer_id = t.id
                WHERE s.session_date >= CURRENT_DATE
                ORDER BY s.session_date, s.start_time
                LIMIT 20
            """)
            sessions = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'sessions': [dict(s) for s in sessions]
                }, default=str)
            }
    finally:
        conn.close()

def get_sessions_by_date(date: str) -> dict:
    """Получение сеансов на определенную дату"""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT s.id, s.session_date, s.start_time, s.end_time,
                       s.available_slots, s.total_slots,
                       t.name as trainer_name, t.specialization
                FROM sessions s
                LEFT JOIN trainers t ON s.trainer_id = t.id
                WHERE s.session_date = %s
                ORDER BY s.start_time
            """, (date,))
            sessions = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'sessions': [dict(s) for s in sessions]
                }, default=str)
            }
    finally:
        conn.close()

def get_user_bookings(user_id: int) -> dict:
    """Получение бронирований пользователя"""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT b.id, b.status, b.booked_at,
                       s.session_date, s.start_time, s.end_time,
                       t.name as trainer_name, t.specialization
                FROM bookings b
                JOIN sessions s ON b.session_id = s.id
                LEFT JOIN trainers t ON s.trainer_id = t.id
                WHERE b.user_id = %s
                ORDER BY s.session_date DESC, s.start_time DESC
            """, (user_id,))
            bookings = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'bookings': [dict(b) for b in bookings]
                }, default=str)
            }
    finally:
        conn.close()

def book_session(data: dict) -> dict:
    """Бронирование сеанса"""
    user_id = data.get('userId')
    session_id = data.get('sessionId')
    
    if not all([user_id, session_id]):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing userId or sessionId'})
        }
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Проверка доступности мест
            cur.execute("SELECT available_slots FROM sessions WHERE id = %s", (session_id,))
            session = cur.fetchone()
            
            if not session or session['available_slots'] <= 0:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No available slots'})
                }
            
            # Создание бронирования
            cur.execute(
                """INSERT INTO bookings (user_id, session_id, status)
                   VALUES (%s, %s, 'active')
                   ON CONFLICT (user_id, session_id) DO NOTHING
                   RETURNING id""",
                (user_id, session_id)
            )
            booking = cur.fetchone()
            
            if not booking:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Already booked'})
                }
            
            # Уменьшение доступных мест
            cur.execute(
                "UPDATE sessions SET available_slots = available_slots - 1 WHERE id = %s",
                (session_id,)
            )
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'bookingId': booking['id']
                })
            }
    finally:
        conn.close()

def cancel_booking(data: dict) -> dict:
    """Отмена бронирования"""
    booking_id = data.get('bookingId')
    
    if not booking_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing bookingId'})
        }
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Получение session_id для обновления слотов
            cur.execute(
                "SELECT session_id FROM bookings WHERE id = %s AND status = 'active'",
                (booking_id,)
            )
            booking = cur.fetchone()
            
            if not booking:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Booking not found or already cancelled'})
                }
            
            # Отмена бронирования
            cur.execute(
                "UPDATE bookings SET status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP WHERE id = %s",
                (booking_id,)
            )
            
            # Увеличение доступных мест
            cur.execute(
                "UPDATE sessions SET available_slots = available_slots + 1 WHERE id = %s",
                (booking['session_id'],)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
    finally:
        conn.close()