alter table "public"."highlights" drop constraint "highlights_type_check";

create table "public"."cover_letters" (
    "id" uuid not null default uuid_generate_v4(),
    "text" text
);


alter table "public"."jobs" add column "cover_letter_id" uuid;

CREATE UNIQUE INDEX cover_letters_pkey ON public.cover_letters USING btree (id);

alter table "public"."cover_letters" add constraint "cover_letters_pkey" PRIMARY KEY using index "cover_letters_pkey";

alter table "public"."jobs" add constraint "jobs_cover_letter_id_fkey" FOREIGN KEY (cover_letter_id) REFERENCES cover_letters(id) ON DELETE CASCADE not valid;

alter table "public"."jobs" validate constraint "jobs_cover_letter_id_fkey";

alter table "public"."highlights" add constraint "highlights_type_check" CHECK (((type)::text = ANY ((ARRAY['work_experience'::character varying, 'project'::character varying, 'education'::character varying])::text[]))) not valid;

alter table "public"."highlights" validate constraint "highlights_type_check";

grant delete on table "public"."cover_letters" to "anon";

grant insert on table "public"."cover_letters" to "anon";

grant references on table "public"."cover_letters" to "anon";

grant select on table "public"."cover_letters" to "anon";

grant trigger on table "public"."cover_letters" to "anon";

grant truncate on table "public"."cover_letters" to "anon";

grant update on table "public"."cover_letters" to "anon";

grant delete on table "public"."cover_letters" to "authenticated";

grant insert on table "public"."cover_letters" to "authenticated";

grant references on table "public"."cover_letters" to "authenticated";

grant select on table "public"."cover_letters" to "authenticated";

grant trigger on table "public"."cover_letters" to "authenticated";

grant truncate on table "public"."cover_letters" to "authenticated";

grant update on table "public"."cover_letters" to "authenticated";

grant delete on table "public"."cover_letters" to "service_role";

grant insert on table "public"."cover_letters" to "service_role";

grant references on table "public"."cover_letters" to "service_role";

grant select on table "public"."cover_letters" to "service_role";

grant trigger on table "public"."cover_letters" to "service_role";

grant truncate on table "public"."cover_letters" to "service_role";

grant update on table "public"."cover_letters" to "service_role";


