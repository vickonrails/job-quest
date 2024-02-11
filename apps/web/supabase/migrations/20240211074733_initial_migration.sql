create type "public"."skill" as ("label" character varying(255));

create table "public"."education" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "resume_id" uuid,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "institution" character varying,
    "degree" character varying,
    "field_of_study" character varying,
    "location" character varying,
    "start_date" date not null,
    "end_date" date,
    "still_studying_here" boolean,
    "highlights" text
);


create table "public"."jobs" (
    "id" uuid not null default uuid_generate_v4(),
    "position" character varying(255) not null,
    "company_name" character varying(255) not null,
    "company_site" character varying(255),
    "user_id" uuid not null,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "location" character varying(255),
    "status" integer not null,
    "order_column" double precision default 0,
    "priority" integer,
    "labels" text[],
    "description" text,
    "source_id" character varying(255),
    "source" character varying(20),
    "link" character varying(255)
);


create table "public"."notes" (
    "id" uuid not null default uuid_generate_v4(),
    "job_id" uuid not null,
    "user_id" uuid not null,
    "status" integer not null,
    "text" text not null,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP
);


create table "public"."profiles" (
    "id" uuid not null,
    "updated_at" timestamp with time zone,
    "username" text,
    "full_name" text,
    "avatar_url" text,
    "professional_summary" text,
    "location" text,
    "title" character varying(255),
    "linkedin_url" character varying(255),
    "personal_website" character varying(255),
    "github_url" character varying(255),
    "email_address" character varying(255),
    "skills" skill[]
);


alter table "public"."profiles" enable row level security;

create table "public"."projects" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "resume_id" uuid,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "title" character varying,
    "description" text,
    "start_date" date,
    "end_date" date,
    "url" text,
    "skills" skill[],
    "highlights" text
);


create table "public"."resumes" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "title" character varying(255),
    "professional_summary" text,
    "full_name" character varying(255),
    "location" character varying(255),
    "email_address" character varying(255),
    "linkedin_url" character varying(255),
    "github_url" character varying(255),
    "personal_website" character varying(255),
    "skills" skill[],
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP
);


create table "public"."work_experience" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "resume_id" uuid,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "company_name" text,
    "job_title" text,
    "location" text,
    "start_date" date not null,
    "still_working_here" boolean,
    "end_date" date,
    "highlights" text
);


CREATE UNIQUE INDEX education_pkey ON public.education USING btree (id);

CREATE UNIQUE INDEX jobs_pkey ON public.jobs USING btree (id);

CREATE UNIQUE INDEX notes_pkey ON public.notes USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);

CREATE UNIQUE INDEX resumes_pkey ON public.resumes USING btree (id);

CREATE UNIQUE INDEX work_experience_pkey ON public.work_experience USING btree (id);

alter table "public"."education" add constraint "education_pkey" PRIMARY KEY using index "education_pkey";

alter table "public"."jobs" add constraint "jobs_pkey" PRIMARY KEY using index "jobs_pkey";

alter table "public"."notes" add constraint "notes_pkey" PRIMARY KEY using index "notes_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."resumes" add constraint "resumes_pkey" PRIMARY KEY using index "resumes_pkey";

alter table "public"."work_experience" add constraint "work_experience_pkey" PRIMARY KEY using index "work_experience_pkey";

alter table "public"."education" add constraint "education_resume_id_fkey" FOREIGN KEY (resume_id) REFERENCES resumes(id) not valid;

alter table "public"."education" validate constraint "education_resume_id_fkey";

alter table "public"."education" add constraint "education_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."education" validate constraint "education_user_id_fkey";

alter table "public"."jobs" add constraint "jobs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."jobs" validate constraint "jobs_user_id_fkey";

alter table "public"."notes" add constraint "notes_job_id_fkey" FOREIGN KEY (job_id) REFERENCES jobs(id) not valid;

alter table "public"."notes" validate constraint "notes_job_id_fkey";

alter table "public"."notes" add constraint "notes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."notes" validate constraint "notes_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."profiles" add constraint "username_length" CHECK ((char_length(username) >= 3)) not valid;

alter table "public"."profiles" validate constraint "username_length";

alter table "public"."projects" add constraint "projects_resume_id_fkey" FOREIGN KEY (resume_id) REFERENCES resumes(id) not valid;

alter table "public"."projects" validate constraint "projects_resume_id_fkey";

alter table "public"."projects" add constraint "projects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."projects" validate constraint "projects_user_id_fkey";

alter table "public"."resumes" add constraint "resumes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."resumes" validate constraint "resumes_user_id_fkey";

alter table "public"."work_experience" add constraint "work_experience_resume_id_fkey" FOREIGN KEY (resume_id) REFERENCES resumes(id) not valid;

alter table "public"."work_experience" validate constraint "work_experience_resume_id_fkey";

alter table "public"."work_experience" add constraint "work_experience_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."work_experience" validate constraint "work_experience_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$function$
;

grant delete on table "public"."education" to "anon";

grant insert on table "public"."education" to "anon";

grant references on table "public"."education" to "anon";

grant select on table "public"."education" to "anon";

grant trigger on table "public"."education" to "anon";

grant truncate on table "public"."education" to "anon";

grant update on table "public"."education" to "anon";

grant delete on table "public"."education" to "authenticated";

grant insert on table "public"."education" to "authenticated";

grant references on table "public"."education" to "authenticated";

grant select on table "public"."education" to "authenticated";

grant trigger on table "public"."education" to "authenticated";

grant truncate on table "public"."education" to "authenticated";

grant update on table "public"."education" to "authenticated";

grant delete on table "public"."education" to "service_role";

grant insert on table "public"."education" to "service_role";

grant references on table "public"."education" to "service_role";

grant select on table "public"."education" to "service_role";

grant trigger on table "public"."education" to "service_role";

grant truncate on table "public"."education" to "service_role";

grant update on table "public"."education" to "service_role";

grant delete on table "public"."jobs" to "anon";

grant insert on table "public"."jobs" to "anon";

grant references on table "public"."jobs" to "anon";

grant select on table "public"."jobs" to "anon";

grant trigger on table "public"."jobs" to "anon";

grant truncate on table "public"."jobs" to "anon";

grant update on table "public"."jobs" to "anon";

grant delete on table "public"."jobs" to "authenticated";

grant insert on table "public"."jobs" to "authenticated";

grant references on table "public"."jobs" to "authenticated";

grant select on table "public"."jobs" to "authenticated";

grant trigger on table "public"."jobs" to "authenticated";

grant truncate on table "public"."jobs" to "authenticated";

grant update on table "public"."jobs" to "authenticated";

grant delete on table "public"."jobs" to "service_role";

grant insert on table "public"."jobs" to "service_role";

grant references on table "public"."jobs" to "service_role";

grant select on table "public"."jobs" to "service_role";

grant trigger on table "public"."jobs" to "service_role";

grant truncate on table "public"."jobs" to "service_role";

grant update on table "public"."jobs" to "service_role";

grant delete on table "public"."notes" to "anon";

grant insert on table "public"."notes" to "anon";

grant references on table "public"."notes" to "anon";

grant select on table "public"."notes" to "anon";

grant trigger on table "public"."notes" to "anon";

grant truncate on table "public"."notes" to "anon";

grant update on table "public"."notes" to "anon";

grant delete on table "public"."notes" to "authenticated";

grant insert on table "public"."notes" to "authenticated";

grant references on table "public"."notes" to "authenticated";

grant select on table "public"."notes" to "authenticated";

grant trigger on table "public"."notes" to "authenticated";

grant truncate on table "public"."notes" to "authenticated";

grant update on table "public"."notes" to "authenticated";

grant delete on table "public"."notes" to "service_role";

grant insert on table "public"."notes" to "service_role";

grant references on table "public"."notes" to "service_role";

grant select on table "public"."notes" to "service_role";

grant trigger on table "public"."notes" to "service_role";

grant truncate on table "public"."notes" to "service_role";

grant update on table "public"."notes" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."projects" to "anon";

grant insert on table "public"."projects" to "anon";

grant references on table "public"."projects" to "anon";

grant select on table "public"."projects" to "anon";

grant trigger on table "public"."projects" to "anon";

grant truncate on table "public"."projects" to "anon";

grant update on table "public"."projects" to "anon";

grant delete on table "public"."projects" to "authenticated";

grant insert on table "public"."projects" to "authenticated";

grant references on table "public"."projects" to "authenticated";

grant select on table "public"."projects" to "authenticated";

grant trigger on table "public"."projects" to "authenticated";

grant truncate on table "public"."projects" to "authenticated";

grant update on table "public"."projects" to "authenticated";

grant delete on table "public"."projects" to "service_role";

grant insert on table "public"."projects" to "service_role";

grant references on table "public"."projects" to "service_role";

grant select on table "public"."projects" to "service_role";

grant trigger on table "public"."projects" to "service_role";

grant truncate on table "public"."projects" to "service_role";

grant update on table "public"."projects" to "service_role";

grant delete on table "public"."resumes" to "anon";

grant insert on table "public"."resumes" to "anon";

grant references on table "public"."resumes" to "anon";

grant select on table "public"."resumes" to "anon";

grant trigger on table "public"."resumes" to "anon";

grant truncate on table "public"."resumes" to "anon";

grant update on table "public"."resumes" to "anon";

grant delete on table "public"."resumes" to "authenticated";

grant insert on table "public"."resumes" to "authenticated";

grant references on table "public"."resumes" to "authenticated";

grant select on table "public"."resumes" to "authenticated";

grant trigger on table "public"."resumes" to "authenticated";

grant truncate on table "public"."resumes" to "authenticated";

grant update on table "public"."resumes" to "authenticated";

grant delete on table "public"."resumes" to "service_role";

grant insert on table "public"."resumes" to "service_role";

grant references on table "public"."resumes" to "service_role";

grant select on table "public"."resumes" to "service_role";

grant trigger on table "public"."resumes" to "service_role";

grant truncate on table "public"."resumes" to "service_role";

grant update on table "public"."resumes" to "service_role";

grant delete on table "public"."work_experience" to "anon";

grant insert on table "public"."work_experience" to "anon";

grant references on table "public"."work_experience" to "anon";

grant select on table "public"."work_experience" to "anon";

grant trigger on table "public"."work_experience" to "anon";

grant truncate on table "public"."work_experience" to "anon";

grant update on table "public"."work_experience" to "anon";

grant delete on table "public"."work_experience" to "authenticated";

grant insert on table "public"."work_experience" to "authenticated";

grant references on table "public"."work_experience" to "authenticated";

grant select on table "public"."work_experience" to "authenticated";

grant trigger on table "public"."work_experience" to "authenticated";

grant truncate on table "public"."work_experience" to "authenticated";

grant update on table "public"."work_experience" to "authenticated";

grant delete on table "public"."work_experience" to "service_role";

grant insert on table "public"."work_experience" to "service_role";

grant references on table "public"."work_experience" to "service_role";

grant select on table "public"."work_experience" to "service_role";

grant trigger on table "public"."work_experience" to "service_role";

grant truncate on table "public"."work_experience" to "service_role";

grant update on table "public"."work_experience" to "service_role";

create policy "Public profiles are viewable by everyone."
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Users can insert their own profile."
on "public"."profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Users can update own profile."
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));



