alter table "public"."highlights" drop constraint "highlights_type_check";

alter table "public"."jobs" add column "keywords" text[];

alter table "public"."highlights" add constraint "highlights_type_check" CHECK (((type)::text = ANY ((ARRAY['work_experience'::character varying, 'project'::character varying, 'education'::character varying])::text[]))) not valid;

alter table "public"."highlights" validate constraint "highlights_type_check";


