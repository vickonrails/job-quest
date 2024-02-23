alter table "public"."highlights" drop constraint "highlights_type_check";

alter table "public"."jobs" add column "resume_id" uuid;

alter table "public"."jobs" add constraint "jobs_resume_id_fkey" FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE not valid;

alter table "public"."jobs" validate constraint "jobs_resume_id_fkey";

alter table "public"."highlights" add constraint "highlights_type_check" CHECK (((type)::text = ANY ((ARRAY['work_experience'::character varying, 'project'::character varying, 'education'::character varying])::text[]))) not valid;

alter table "public"."highlights" validate constraint "highlights_type_check";


