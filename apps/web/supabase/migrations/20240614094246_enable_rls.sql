drop view if exists "public"."jobs_dashboard_v";

alter table "public"."cover_letters" enable row level security;

alter table "public"."education" enable row level security;

alter table "public"."jobs" enable row level security;

alter table "public"."notes" enable row level security;

alter table "public"."projects" enable row level security;

alter table "public"."resumes" enable row level security;

alter table "public"."work_experience" enable row level security;

create policy "Only owners can modify cover letters"
on "public"."cover_letters"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Only owners can modify education"
on "public"."education"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = user_id));

create policy "Owners can modify job"
on "public"."jobs"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Only owners can modify notes"
on "public"."notes"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Only owners can modify projects"
on "public"."projects"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Only owners can modify resumes"
on "public"."resumes"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Only owners can modify work experience"
on "public"."work_experience"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = user_id));



