-- Расширения (pgvector уже включён вручную, пропускаем его создание)
-- create extension if not exists "pgvector"; -- не нужно, если включено

create extension if not exists "uuid-ossp";

-- Пользователи (расширяем auth.users)
create table if not exists public.users (
  id uuid references auth.users not null primary key,
  email text unique,
  role text default 'user' check (role in ('user', 'admin')),
  credits_balance integer default 10,
  tier text default 'free' check (tier in ('free', 'pro')),
  created_at timestamptz default now()
);

alter table public.users enable row level security;

create policy "Users can view own profile" on users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on users
  for update using (auth.uid() = id);

-- Проекты
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  created_at timestamptz default now()
);

alter table public.projects enable row level security;

create policy "User owns projects" on projects
  for all using (auth.uid() = user_id);

-- Документы
create table if not exists public.documents (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects on delete cascade,
  type text check (type in ('TZ', 'Result')),
  raw_text text,
  file_url text,
  created_at timestamptz default now()
);

alter table public.documents enable row level security;

create policy "Docs via project ownership" on documents
  for all using (
    exists (
      select 1 from projects
      where projects.id = documents.project_id
        and projects.user_id = auth.uid()
    )
  );

-- Аудиты
create table if not exists public.audits (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects on delete cascade,
  status text default 'pending' check (status in ('pending', 'processing', 'success', 'failed')),
  score integer,
  created_at timestamptz default now()
);

alter table public.audits enable row level security;

create policy "Audits via project ownership" on audits
  for all using (
    exists (
      select 1 from projects
      where projects.id = audits.project_id
        and projects.user_id = auth.uid()
    )
  );

-- Результаты аудита
create table if not exists public.audit_results (
  id uuid default uuid_generate_v4() primary key,
  audit_id uuid references audits on delete cascade,
  requirement text not null,
  finding text,
  status text check (status in ('ok', 'partial', 'fail')),
  created_at timestamptz default now()
);

alter table public.audit_results enable row level security;

create policy "Results via audit ownership" on audit_results
  for all using (
    exists (
      select 1 from audits
      join projects on audits.project_id = projects.id
      where audits.id = audit_results.audit_id
        and projects.user_id = auth.uid()
    )
  );

-- Чанки (векторная таблица) — pgvector уже включён, поэтому просто создаём
create table if not exists public.chunks (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references documents on delete cascade,
  content text,
  embedding vector(1536)
);

create index if not exists chunks_embedding_idx on chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

alter table public.chunks enable row level security;

create policy "Chunks via document ownership" on chunks
  for all using (
    exists (
      select 1 from documents
      join projects on documents.project_id = projects.id
      where documents.id = chunks.document_id
        and projects.user_id = auth.uid()
    )
  );

-- Транзакции кредитов
create table if not exists public.credit_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  amount integer not null,
  type text check (type in ('purchase', 'usage', 'refund')),
  audit_id uuid references audits on delete set null,
  created_at timestamptz default now()
);

alter table public.credit_transactions enable row level security;

create policy "User owns transactions" on credit_transactions
  for select using (auth.uid() = user_id);

-- Подписки
create table if not exists public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  stripe_subscription_id text,
  stripe_customer_id text,
  status text,
  current_period_end timestamptz,
  created_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "User owns subscriptions" on subscriptions
  for all using (auth.uid() = user_id);

-- Вспомогательные функции
create or replace function add_credits(user_id uuid, amount int)
returns void language plpgsql as $$
begin
  update users
  set credits_balance = credits_balance + amount
  where id = user_id;
end;
$$;

create or replace function deduct_credits(user_id uuid, amount int)
returns void language plpgsql as $$
declare
  current_balance int;
begin
  select credits_balance into current_balance
  from users where id = user_id;
  if current_balance < amount then
    raise exception 'Insufficient credits';
  end if;
  update users
  set credits_balance = credits_balance - amount
  where id = user_id;
end;
$$;

-- Функция поиска чанков
create or replace function match_chunks(
  query_embedding vector(1536),
  doc_id uuid,
  match_count int default 3
)
returns table (
  id uuid,
  content text,
  similarity float
)
language plpgsql as $$
begin
  return query
  select
    chunks.id,
    chunks.content,
    1 - (chunks.embedding <=> query_embedding) as similarity
  from chunks
  where chunks.document_id = doc_id
  order by chunks.embedding <=> query_embedding
  limit match_count;
end;
$$;