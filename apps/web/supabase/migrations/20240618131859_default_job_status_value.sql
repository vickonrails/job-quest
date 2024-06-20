alter table "public"."jobs" alter column "status" set default 0;

alter table "public"."jobs" alter column "status" drop not null;


