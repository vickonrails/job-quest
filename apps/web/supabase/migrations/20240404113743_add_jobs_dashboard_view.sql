alter table "public"."jobs" alter column "order_column" set default '10'::double precision;

create or replace view "public"."jobs_dashboard_v" as  SELECT count(*) AS count,
    'recently_added'::text AS field
   FROM jobs
  WHERE (jobs.created_at >= (CURRENT_DATE - '7 days'::interval))
UNION
 SELECT count(*) AS count,
    'favorites'::text AS field
   FROM jobs
  WHERE (jobs.priority >= 4)
UNION
 SELECT count(*) AS count,
    'applying'::text AS field
   FROM jobs
  WHERE (jobs.status = 1)
UNION
 SELECT count(*) AS count,
    'interviewing'::text AS field
   FROM jobs
  WHERE (jobs.status = 3);



