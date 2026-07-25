export default async function middleware(request: Request) {
  const acceptHeader = request.headers.get('accept') || ''

  const linkHeaderValue = [
    '</.well-known/api-catalog>; rel="api-catalog"',
    '</.well-known/agent-skills/index.json>; rel="agent-skills"',
    '</.well-known/mcp/server-card.json>; rel="mcp-server-card"',
    '</.well-known/oauth-authorization-server>; rel="oauth-authorization-server"',
    '</.well-known/oauth-protected-resource>; rel="oauth-protected-resource"',
    '</auth.md>; rel="authorizing-realm"',
    '</.well-known/ai-plugin.json>; rel="ai-plugin"',
    '</llms-full.txt>; rel="llms-full"',
    '</.well-known/security.txt>; rel="security-policy"',
  ].join(', ')

  if (acceptHeader.includes('text/markdown')) {
    const url = new URL(request.url)
    let pathname = url.pathname

    if (pathname === '/' || pathname === '/index.html') {
      pathname = '/index.md'
    } else if (!pathname.endsWith('.md') && !pathname.includes('.')) {
      pathname = `${pathname}.md`
    }

    try {
      const markdownUrl = new URL(pathname, url.origin)
      const res = await fetch(markdownUrl)
      if (res.ok) {
        const text = await res.text()
        return new Response(text, {
          status: 200,
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'x-markdown-tokens': '850',
            'Link': linkHeaderValue,
            'Vary': 'Accept',
          },
        })
      }
    } catch {
      // Fallback if fetch fails
    }
  }
}
