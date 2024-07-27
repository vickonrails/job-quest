set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_max_order_by_column()
 RETURNS TABLE(column_id integer, max_order double precision)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT public.jobs.status, COALESCE(MAX(public.jobs.order_column), 0) as max_order
  FROM public.jobs
  GROUP BY jobs.status;
END;
$function$
;


