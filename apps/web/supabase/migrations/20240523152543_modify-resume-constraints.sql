alter table "public"."jobs" drop constraint "jobs_cover_letter_id_fkey";

alter table "public"."education" drop constraint "education_resume_id_fkey";

alter table "public"."jobs" drop constraint "jobs_resume_id_fkey";

alter table "public"."projects" drop constraint "projects_resume_id_fkey";

alter table "public"."work_experience" drop constraint "work_experience_resume_id_fkey";

drop view if exists "public"."jobs_dashboard_v";

alter table "public"."cover_letters" add column "job_id" uuid;

alter table "public"."jobs" drop column "cover_letter_id";

alter table "public"."cover_letters" add constraint "cover_letters_job_id_fkey" FOREIGN KEY (job_id) REFERENCES jobs(id) not valid;

alter table "public"."cover_letters" validate constraint "cover_letters_job_id_fkey";

alter table "public"."education" add constraint "education_resume_id_fkey" FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE not valid;

alter table "public"."education" validate constraint "education_resume_id_fkey";

alter table "public"."jobs" add constraint "jobs_resume_id_fkey" FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE SET NULL not valid;

alter table "public"."jobs" validate constraint "jobs_resume_id_fkey";

alter table "public"."projects" add constraint "projects_resume_id_fkey" FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE not valid;

alter table "public"."projects" validate constraint "projects_resume_id_fkey";

alter table "public"."work_experience" add constraint "work_experience_resume_id_fkey" FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE not valid;

alter table "public"."work_experience" validate constraint "work_experience_resume_id_fkey";

create or replace view "public"."jobs_dashboard_v" as  SELECT count(*) AS count,
    'recently_added'::text AS field
   FROM jobs
  WHERE (jobs.created_at >= (CURRENT_DATE - '7 days'::interval))
UNION
 SELECT count(*) AS count,
    'favorites'::text AS field
   FROM jobs
  WHERE (jobs.priority >= 4)
UNION
 SELECT count(*) AS count,
    'applying'::text AS field
   FROM jobs
  WHERE (jobs.status = 1)
UNION
 SELECT count(*) AS count,
    'interviewing'::text AS field
   FROM jobs
  WHERE (jobs.status = 3);



