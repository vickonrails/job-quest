alter table "public"."highlights" drop constraint "highlights_type_check";

alter table "public"."jobs" alter column "link" set data type text using "link"::text;

alter table "public"."jobs" alter column "source" set data type text using "source"::text;

CREATE UNIQUE INDEX jobs_link_key ON public.jobs USING btree (link);

alter table "public"."jobs" add constraint "jobs_link_key" UNIQUE using index "jobs_link_key";

alter table "public"."highlights" add constraint "highlights_type_check" CHECK (((type)::text = ANY ((ARRAY['work_experience'::character varying, 'project'::character varying, 'education'::character varying])::text[]))) not valid;

alter table "public"."highlights" validate constraint "highlights_type_check";


