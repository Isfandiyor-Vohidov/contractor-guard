-- Тестовые данные для разработки

-- 1. Создаём пользователя в auth.users (выполняется через Dashboard или API, здесь для примера)
-- В реальном seed нужно предварительно создать пользователя через Supabase Auth,
-- затем его id использовать ниже. Для простоты замените '11111111-1111-1111-1111-111111111111' на реальный UUID.

-- Удаляем старые данные
truncate table public.chunks, public.audit_results, public.audits,
             public.documents, public.projects, public.credit_transactions,
             public.subscriptions, public.users cascade;

-- Вставляем тестового пользователя (заранее созданного в auth)
insert into public.users (id, email, role, credits_balance, tier)
values ('11111111-1111-1111-1111-111111111111', 'dev@contractorguard.local', 'admin', 1000, 'pro');

-- Проекты
insert into public.projects (id, user_id, name)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Редизайн лендинга'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Мобильное приложение');

-- Документы (ТЗ и Результат)
insert into public.documents (id, project_id, type, raw_text)
values
  ('c0000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'TZ', 'Кнопка "Купить" должна быть красной (#FF0000). Сайт должен открываться за 2 секунды. Должна быть мобильная адаптация.'),
  ('c0000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Result', 'Кнопка "Купить" оранжевая. Сайт загружается 3 секунды. Мобильная версия отсутствует.'),
  ('c0000000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'TZ', 'Экран входа должен содержать поля Email и Пароль. Цвет фона белый.'),
  ('c0000000-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Result', 'Экран входа с полями Email, Пароль и кнопкой Войти. Фон белый.');

-- Аудит (один завершённый, один pending)
insert into public.audits (id, project_id, status, score)
values
  ('d0000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'success', 33),
  ('d0000000-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'pending', null);

-- Результаты аудита для первого проекта
insert into public.audit_results (id, audit_id, requirement, finding, status)
values
  (uuid_generate_v4(), 'd0000000-0000-0000-0000-000000000001', 'Кнопка "Купить" красная', 'Кнопка оранжевая, не соответствует', 'fail'),
  (uuid_generate_v4(), 'd0000000-0000-0000-0000-000000000001', 'Сайт открывается за 2 секунды', 'Загрузка 3 секунды, превышение', 'partial'),
  (uuid_generate_v4(), 'd0000000-0000-0000-0000-000000000001', 'Мобильная адаптация', 'Мобильная версия отсутствует', 'fail');