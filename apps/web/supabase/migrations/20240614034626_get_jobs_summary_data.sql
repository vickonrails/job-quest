set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_job_stage_counts(userid uuid)
 RETURNS TABLE(recently_added bigint, favorites bigint, applying bigint, interviewing bigint)
 LANGUAGE plpgsql
AS $function$
begin
    return query
    select
        (SELECT COUNT(*) FROM (
            SELECT id
            FROM public.jobs
            WHERE user_id = userid
            ORDER BY created_at DESC
            LIMIT 15
         ) AS recently_added_subquery) AS recently_added,

        (SELECT COUNT(*) FROM (
            SELECT id
            FROM public.jobs
            WHERE user_id = userid
            ORDER BY priority DESC
            LIMIT 15
         ) AS favorites_subquery) AS favorites,

        (select COUNT(*) from public.jobs where user_id = userid AND status = 1) AS applying,
        (select COUNT(*) from public.jobs where user_id = userid AND status = 3) AS interviewing;
END;
$function$
;


