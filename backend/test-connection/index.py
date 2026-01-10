"""Тест подключения к Supabase"""
import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Проверка всех доступных строк подключения"""
    
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    result = {
        'secrets': {
            'SUPABASE_CONN': os.environ.get('SUPABASE_CONN', 'NOT SET')[:60] + '...',
            'SUPABASE_CONNECTION': os.environ.get('SUPABASE_CONNECTION', 'NOT SET')[:60] + '...',
            'SUPABASE_DB_URL': os.environ.get('SUPABASE_DB_URL', 'NOT SET')[:60] + '...',
        }
    }
    
    # Пробуем подключиться
    for secret_name in ['SUPABASE_CONN', 'SUPABASE_CONNECTION', 'SUPABASE_DB_URL']:
        db_url = os.environ.get(secret_name)
        if db_url and db_url != 'NOT SET':
            try:
                conn = psycopg2.connect(db_url)
                conn.close()
                result[f'{secret_name}_test'] = 'SUCCESS'
                break
            except Exception as e:
                result[f'{secret_name}_test'] = f'FAILED: {str(e)[:100]}'
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(result, indent=2)
    }
