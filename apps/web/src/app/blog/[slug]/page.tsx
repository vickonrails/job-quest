import { getPostContent } from '@/utils/content'

export default async function page({ params }: { params: { slug: string } }) {
  const content = await getPostContent(params.slug)
  if (!content) return <NotFound />
  const { title, date } = content.data

  return (
    <section>
      <header className="mt-28 mb-6">
        <h2 className="uppercase text-muted-foreground text-sm mb-2 tracking-widest">Updates</h2>
        <h1 className="text-4xl mb-2 md:text-5xl font-bold md:leading-none from-accent-foreground to-muted-foreground bg-gradient-to-br text-transparent bg-clip-text">{title}</h1>
        <time className="text-sm text-muted-foreground">{date}</time>
      </header>
      <Content html={content.content} />
    </section>
  )
}

/**
 * Blog post content
 */
function Content({ html }: { html: string }) {
  return (
    <div className="content-body mb-10" dangerouslySetInnerHTML={{ __html: html }} />
  )
}

/**
 * 404 fallback
 */
function NotFound() {
  return (
    <section className="py-20">
      <h1 className="text-4xl mb-2 md:text-5xl font-bold md:leading-none from-accent-foreground to-muted-foreground bg-gradient-to-br text-center text-transparent bg-clip-text">Content not found</h1>
    </section>
  )
}