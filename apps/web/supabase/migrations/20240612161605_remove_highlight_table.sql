revoke delete on table "public"."highlights" from "anon";

revoke insert on table "public"."highlights" from "anon";

revoke references on table "public"."highlights" from "anon";

revoke select on table "public"."highlights" from "anon";

revoke trigger on table "public"."highlights" from "anon";

revoke truncate on table "public"."highlights" from "anon";

revoke update on table "public"."highlights" from "anon";

revoke delete on table "public"."highlights" from "authenticated";

revoke insert on table "public"."highlights" from "authenticated";

revoke references on table "public"."highlights" from "authenticated";

revoke select on table "public"."highlights" from "authenticated";

revoke trigger on table "public"."highlights" from "authenticated";

revoke truncate on table "public"."highlights" from "authenticated";

revoke update on table "public"."highlights" from "authenticated";

revoke delete on table "public"."highlights" from "service_role";

revoke insert on table "public"."highlights" from "service_role";

revoke references on table "public"."highlights" from "service_role";

revoke select on table "public"."highlights" from "service_role";

revoke trigger on table "public"."highlights" from "service_role";

revoke truncate on table "public"."highlights" from "service_role";

revoke update on table "public"."highlights" from "service_role";

alter table "public"."highlights" drop constraint "highlights_education_id_fkey";

alter table "public"."highlights" drop constraint "highlights_type_check";

alter table "public"."highlights" drop constraint "highlights_work_experience_id_fkey";

alter table "public"."highlights" drop constraint "public_highlights_user_id_fkey";

alter table "public"."highlights" drop constraint "highlights_pkey";

drop index if exists "public"."highlights_pkey";

drop table "public"."highlights";

alter table "public"."education" add column "highlights" text;

alter table "public"."projects" add column "highlights" text;

alter table "public"."work_experience" add column "highlights" text;


