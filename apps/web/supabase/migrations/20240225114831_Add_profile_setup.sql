alter table "public"."highlights" drop constraint "highlights_type_check";

alter table "public"."profiles" add column "is_profile_setup" boolean default false;

alter table "public"."highlights" add constraint "highlights_type_check" CHECK (((type)::text = ANY ((ARRAY['work_experience'::character varying, 'project'::character varying, 'education'::character varying])::text[]))) not valid;

alter table "public"."highlights" validate constraint "highlights_type_check";

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

-- Had to add this manually because of https://github.com/supabase/cli/issues/120
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();