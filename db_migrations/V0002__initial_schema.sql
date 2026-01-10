-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы тренеров
CREATE TABLE IF NOT EXISTS trainers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы сеансов
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    trainer_id INTEGER REFERENCES trainers(id),
    total_slots INTEGER NOT NULL DEFAULT 10,
    available_slots INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы бронирований
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    session_id INTEGER REFERENCES sessions(id) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, session_id)
);

-- Создание индексов для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_session ON bookings(session_id);

-- Добавление тестовых тренеров
INSERT INTO trainers (name, specialization) VALUES
    ('Анна Петрова', 'Плавание на спине'),
    ('Максим Волков', 'Фристайл'),
    ('Елена Соколова', 'Детское плавание')
ON CONFLICT DO NOTHING;

-- Добавление тестовых сеансов на следующие 7 дней
INSERT INTO sessions (session_date, start_time, end_time, trainer_id, total_slots, available_slots)
SELECT 
    CURRENT_DATE + (day || ' days')::interval,
    (time_slot || ':00')::time,
    (time_slot + 1 || ':00')::time,
    ((day + time_slot) % 3) + 1,
    10,
    10
FROM 
    generate_series(0, 6) AS day,
    generate_series(9, 17) AS time_slot
ON CONFLICT DO NOTHING;