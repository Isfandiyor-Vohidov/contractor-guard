CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(1536),
  doc_id uuid,
  match_count int DEFAULT 3
)
RETURNS TABLE (
  id uuid,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    chunks.id,
    chunks.content,
    1 - (chunks.embedding <=> query_embedding) AS similarity
  FROM chunks
  WHERE chunks.document_id = doc_id
  ORDER BY chunks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;