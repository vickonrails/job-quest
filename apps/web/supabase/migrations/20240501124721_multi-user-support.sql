alter table "_realtime"."tenants" drop column "enable_authorization";

alter table "_realtime"."tenants" drop column "jwt_jwks";


alter table "public"."cover_letters" add column "user_id" uuid not null;

alter table "public"."education" add column "user_id" uuid not null;

alter table "public"."highlights" add column "user_id" uuid not null;

alter table "public"."jobs" add column "user_id" uuid not null;

alter table "public"."notes" add column "user_id" uuid not null;

alter table "public"."projects" add column "user_id" uuid not null;

alter table "public"."resumes" add column "user_id" uuid not null;

alter table "public"."work_experience" add column "user_id" uuid;

alter table "public"."cover_letters" add constraint "public_cover_letters_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."cover_letters" validate constraint "public_cover_letters_user_id_fkey";

alter table "public"."education" add constraint "public_education_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."education" validate constraint "public_education_user_id_fkey";

alter table "public"."highlights" add constraint "public_highlights_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."highlights" validate constraint "public_highlights_user_id_fkey";

alter table "public"."jobs" add constraint "public_jobs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."jobs" validate constraint "public_jobs_user_id_fkey";

alter table "public"."notes" add constraint "public_notes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."notes" validate constraint "public_notes_user_id_fkey";

alter table "public"."projects" add constraint "public_projects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."projects" validate constraint "public_projects_user_id_fkey";

alter table "public"."resumes" add constraint "public_resumes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."resumes" validate constraint "public_resumes_user_id_fkey";

alter table "public"."work_experience" add constraint "public_work_experience_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."work_experience" validate constraint "public_work_experience_user_id_fkey";


