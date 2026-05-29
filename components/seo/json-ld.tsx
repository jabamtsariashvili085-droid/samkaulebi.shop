// Renders a JSON-LD <script> for schema.org structured data.
// Server component — output lands in the initial HTML for crawlers/AI agents.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
