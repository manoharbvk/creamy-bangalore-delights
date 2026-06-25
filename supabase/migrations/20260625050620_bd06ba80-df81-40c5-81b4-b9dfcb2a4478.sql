DROP POLICY IF EXISTS "Anyone can place an order" ON public.orders;

CREATE POLICY "Anyone can place a valid order"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'new'
  AND length(trim(customer_name)) >= 2
  AND phone ~ '^[0-9+() -]{7,20}$'
  AND length(trim(address)) >= 8
  AND jsonb_typeof(items) = 'array'
  AND jsonb_array_length(items) > 0
  AND total > 0
);