
CREATE type skill AS (
  label varchar(255)
);

-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  professional_summary text,
  location text,
  title varchar(255),
  linkedin_url varchar(255),
  personal_website varchar(255),
  github_url varchar(255),
  email_address varchar(255),
  skills skill[],

  constraint username_length check (char_length(username) >= 3)
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

-- Create Jobs Table
CREATE TABLE jobs (
    id UUID DEFAULT (uuid_generate_v4()) PRIMARY KEY,
    position VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_site VARCHAR(255),
    user_id uuid not null,
    foreign key (user_id) references auth.users (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(255),
    status INT NOT NULL,
    order_column DOUBLE PRECISION default 0,
    priority INT,
    labels TEXT[],
    description TEXT,
    source_id VARCHAR(255),
    source VARCHAR(20),
    link VARCHAR(255)
);

-- Create Resume Table
CREATE TABLE resumes (
    id UUID DEFAULT (uuid_generate_v4()) PRIMARY KEY,
    user_id uuid not null,
    foreign key (user_id) references profiles(id),
    title VARCHAR(255),
    professional_summary TEXT,
    full_name VARCHAR(255),
    location VARCHAR(255),
    email_address VARCHAR(255),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    personal_website VARCHAR(255),
    skills skill[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Table for Projects
CREATE TABLE projects (
    id UUID DEFAULT (uuid_generate_v4()) PRIMARY KEY,
    user_id uuid not null,
    foreign key (user_id) references profiles(id),
    resume_id uuid,
    foreign key (resume_id) references resumes(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR,
    description TEXT,
    start_date DATE,
    end_date DATE,
    url TEXT,
    skills skill[],   
    highlights TEXT
);

-- Create Work Experience Table
CREATE TABLE work_experience (
    id UUID DEFAULT (uuid_generate_v4()) PRIMARY KEY,
    user_id uuid not null,
    foreign key (user_id) references profiles(id),
    resume_id uuid,
    foreign key (resume_id) references resumes(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    company_name TEXT,
    job_title TEXT,
    location TEXT,
    start_date DATE NOT NULL,
    still_working_here boolean,
    end_date DATE,
    highlights TEXT
);

-- Create Education Table
CREATE TABLE education (
    id UUID DEFAULT (uuid_generate_v4()) PRIMARY KEY,
    user_id uuid not null,
    foreign key (user_id) references profiles(id),
    resume_id uuid,
    foreign key (resume_id) references resumes(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    institution VARCHAR,
    degree VARCHAR,
    field_of_study VARCHAR,
    location VARCHAR,
    start_date DATE NOT NULL,
    end_date DATE,
    still_studying_here boolean,
    highlights TEXT
);

-- Create Notes Table
create table
  notes (
    id uuid default (uuid_generate_v4 ()) primary key,
    job_id uuid not null,
    foreign key (job_id) references jobs (id),
    user_id uuid not null,
    foreign key (user_id) references auth.users (id),
    status int not null,
    text text not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
  );