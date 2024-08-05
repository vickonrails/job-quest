import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import html from 'remark-html'
import gfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

/**
 * @param path 
 * @returns all .mdx files in a directory
 */
function getMDXContent(path: string) {
    const files = fs.readdirSync(path)
    return files.filter((content) => content.endsWith('.mdx'))
}

/**
 * @param slug
 * @returns first blogpost with given slug
 */
async function getMatchingContent(slug: string) {
    const contentPath = path.join(process.cwd(), 'src', 'app', 'blog', 'content')
    const mdxFiles = getMDXContent(contentPath)
    const fileContents = mdxFiles.map(async x => {
        const filePath = path.join(contentPath, x);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const frontMatter = matter(fileContent);
        const { data } = frontMatter

        const processedContentPromise = await unified()
            .use(remarkParse)
            .use(html, { sanitize: false })
            .use(gfm)
            .use(rehypeHighlight)
            .process(frontMatter.content);
        const processedContent = processedContentPromise.toString()

        return {
            data: {
                title: data.title,
                slug: data.slug,
                date: data.date,
                draft: data.draft,
                description: data.description
            },
            content: processedContent.toString()
        }
    })

    const contentMatch = (await Promise.all(fileContents)).filter(file => {
        const { data: { slug: contentSlug } } = file
        return slug === contentSlug
    })

    return contentMatch[0]
}

/**
 * 
 * @param slug 
 * @returns complete post for a given slug
 */
export function getPostContent(slug: string) {
    return getMatchingContent(slug)
}