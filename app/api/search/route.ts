"use cache"
import { Page } from '@/Modules/fumadocs-core/dist/source/index';
import { FullSource, source } from '../../source';
import { createFromSource } from 'fumadocs-core/search/server';
import { source as sourceLib } from "@/lib/source"
import { NextRequest, NextResponse } from 'next/server';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import type { NextApiRequest } from 'next';

type FullSearch = Array<{
  id: string,
  content: string,
  type: string,
  url: string
}>

async function GetRequest(req: NextRequest) {
  "use cache"
  if (req && req.method !== "POST") {
    return HandleSearch(req)
  } else {
    return NextResponse.json(null, { status: 405})
  }
}

async function HandleSearch(req: NextRequest) {
  "use cache"
  const { GET } = createFromSource(sourceLib as FullSource, (page: Page) => (
    {
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: page.data.structuredData,
    }))

  var reqUrl = req.url

  let NewURL: string = reqUrl

  if (reqUrl.includes("&")) {
    NewURL = reqUrl.split("&")[0]
  }

  

  const mockRequest = new NextRequest(NewURL)
  
  const fullSearch: FullSearch = await (await GET(mockRequest as NextRequest | any)).json()
  const tagRequested = req.nextUrl.searchParams.get("tag") || null
  var endSearch: FullSearch = []

  if (tagRequested) {
    for (var entry of fullSearch) {
      var url: string | string[] = entry.url
      if (url.includes("#")) {
        url = url.split("#")[0]
      }
      url = url.split("/")
      if (url[0] === '') {
        url.splice(0, 1)
      }
      if (url[0] === 'docs') {
        url.splice(0, 1)
      }
      if (source.getPage(url)?.tags.includes(tagRequested)) {
        endSearch.push(entry)
      }

    }

  } else {
    endSearch = fullSearch
  }
  return NextResponse.json(endSearch)
}
export { GetRequest as GET }