set check_function_bodies = off;

create type "public"."work_experience_type" as ("company_name" text, "end_date" date, "job_title" text, "location" text, "start_date" date, "still_working_here" boolean, "user_id" uuid);

create type "public"."education_type" as ("degree" text, "end_date" date, "field_of_study" text, "institution" text, "location" text, "start_date" date, "still_studying_here" boolean, "user_id" uuid);

create type "public"."profile_type" as ("email_address" text, "full_name" text, "location" text, "professional_summary" text, "title" text, "skills" skill[], "github_url" text, "personal_website" text, "linkedin_url" text);

create type "public"."project_type" as ("description" text, "end_date" date, "skills" skill[], "start_date" date, "title" text, "url" text, "user_id" uuid);

CREATE OR REPLACE FUNCTION public.setup_profile(user_id_param uuid, profile profile_type, work_experience work_experience_type[], projects project_type[], education education_type[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  insert INTO public.profiles (id, email_address, full_name, location, professional_summary, title, skills, github_url, personal_website, linkedin_url)
  values (
    user_id_param,
    profile.email_address,
    profile.full_name,
    profile.location,
    profile.professional_summary,
    profile.title,
    profile.skills,
    profile.github_url,
    profile.personal_website,
    profile.linkedin_url
  )
  on conflict (id) do update
  SET
    email_address = excluded.email_address,
    full_name = excluded.full_name,
    location = excluded.location,
    professional_summary = excluded.professional_summary,
    title = excluded.title,
    skills = excluded.skills,
    github_url = excluded.github_url,
    personal_website = excluded.personal_website,
    linkedin_url = excluded.linkedin_url;

delete from public.work_experience where user_id = user_id_param AND resume_id is null;

insert into public.work_experience ( company_name, end_date, job_title, location, start_date, still_working_here, user_id)
  SELECT we.company_name, we.end_date, we.job_title, we.location, we.start_date, we.still_working_here, we.user_id
  FROM unnest(work_experience) AS we;

delete from public.projects where user_id = user_id_param AND resume_id is null;

insert into public.projects (description, end_date, skills, start_date, title, url, user_id)
  SELECT project.description, project.end_date, project.skills, project.start_date, project.title, project.url, project.user_id
  FROM unnest(projects) AS project;

delete from public.education where user_id = user_id_param AND resume_id is null;
insert into public.education (degree, start_date, end_date, field_of_study, institution, location, still_studying_here, user_id)
  SELECT edu.degree, edu.start_date, edu.end_date, edu.field_of_study, edu.institution, edu.location, edu.still_studying_here, edu.user_id
  FROM unnest(education) AS edu;

end;
$function$
;


