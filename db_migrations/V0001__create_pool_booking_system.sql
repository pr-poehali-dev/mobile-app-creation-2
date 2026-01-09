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
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы сеансов плавания
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    trainer_id INTEGER REFERENCES trainers(id),
    total_slots INTEGER NOT NULL DEFAULT 15,
    available_slots INTEGER NOT NULL DEFAULT 15,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы бронирований
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id INTEGER REFERENCES sessions(id),
    status VARCHAR(20) DEFAULT 'active',
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP,
    UNIQUE(user_id, session_id)
);

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_session ON bookings(session_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Добавление тестовых тренеров
INSERT INTO trainers (name, specialization) VALUES 
    ('Анна Петрова', 'Плавание на спине'),
    ('Дмитрий Смирнов', 'Кроль'),
    ('Елена Волкова', 'Брасс')
ON CONFLICT DO NOTHING;

-- Добавление тестовых сеансов на ближайшие дни
INSERT INTO sessions (session_date, start_time, end_time, trainer_id, total_slots, available_slots) VALUES
    (CURRENT_DATE, '07:00', '08:00', 1, 15, 15),
    (CURRENT_DATE, '08:00', '09:00', 2, 15, 15),
    (CURRENT_DATE, '09:00', '10:00', 3, 15, 15),
    (CURRENT_DATE + 1, '07:00', '08:00', 1, 15, 15),
    (CURRENT_DATE + 1, '08:00', '09:00', 2, 15, 15),
    (CURRENT_DATE + 1, '09:00', '10:00', 3, 15, 15),
    (CURRENT_DATE + 2, '07:00', '08:00', 1, 15, 15),
    (CURRENT_DATE + 2, '08:00', '09:00', 2, 15, 15),
    (CURRENT_DATE + 2, '09:00', '10:00', 3, 15, 15)
ON CONFLICT DO NOTHING;
