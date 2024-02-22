create table "public"."highlights" (
    "id" uuid not null default uuid_generate_v4(),
    "type" character varying(20),
    "text" text not null,
    "work_experience_id" uuid,
    "education_id" uuid
);

alter table "public"."education" drop column "highlights";

alter table "public"."projects" drop column "highlights";

alter table "public"."work_experience" drop column "highlights";

CREATE UNIQUE INDEX highlights_pkey ON public.highlights USING btree (id);

alter table "public"."highlights" add constraint "highlights_pkey" PRIMARY KEY using index "highlights_pkey";

alter table "public"."highlights" add constraint "highlights_education_id_fkey" FOREIGN KEY (education_id) REFERENCES education(id) ON DELETE CASCADE not valid;

alter table "public"."highlights" validate constraint "highlights_education_id_fkey";

alter table "public"."highlights" add constraint "highlights_type_check" CHECK (((type)::text = ANY ((ARRAY['work_experience'::character varying, 'project'::character varying, 'education'::character varying])::text[]))) not valid;

alter table "public"."highlights" validate constraint "highlights_type_check";

alter table "public"."highlights" add constraint "highlights_work_experience_id_fkey" FOREIGN KEY (work_experience_id) REFERENCES work_experience(id) ON DELETE CASCADE not valid;

alter table "public"."highlights" validate constraint "highlights_work_experience_id_fkey";

grant delete on table "public"."highlights" to "anon";

grant insert on table "public"."highlights" to "anon";

grant references on table "public"."highlights" to "anon";

grant select on table "public"."highlights" to "anon";

grant trigger on table "public"."highlights" to "anon";

grant truncate on table "public"."highlights" to "anon";

grant update on table "public"."highlights" to "anon";

grant delete on table "public"."highlights" to "authenticated";

grant insert on table "public"."highlights" to "authenticated";

grant references on table "public"."highlights" to "authenticated";

grant select on table "public"."highlights" to "authenticated";

grant trigger on table "public"."highlights" to "authenticated";

grant truncate on table "public"."highlights" to "authenticated";

grant update on table "public"."highlights" to "authenticated";

grant delete on table "public"."highlights" to "service_role";

grant insert on table "public"."highlights" to "service_role";

grant references on table "public"."highlights" to "service_role";

grant select on table "public"."highlights" to "service_role";

grant trigger on table "public"."highlights" to "service_role";

grant truncate on table "public"."highlights" to "service_role";

grant update on table "public"."highlights" to "service_role";


