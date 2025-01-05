
import { Page } from '@/Modules/fumadocs-core/dist/source/index';
import { FullSource, source } from '../../source';
import { createFromSource } from 'fumadocs-core/search/server';
import { source as sourceLib } from "@/lib/source"
import { NextRequest, NextResponse } from 'next/server';
import type { NextApiRequest } from 'next';

export const revalidate = false
type FullSearch = Array<{
  id: string,
  content: string,
  type: string,
  url: string
}>

async function GetRequest(req: NextRequest) {
  
  if (req && req.method !== "POST") {
    return HandleSearch(req)
  } else {
    return NextResponse.json(null, { status: 405})
  }
}


const { /*GET,*/  staticGET : GET } = createFromSource(sourceLib as FullSource, (page: Page) => (
  {
    title: page.data.title,
    description: page.data.description,
    url: page.url,
    id: page.url,
    structuredData: page.data.structuredData,
  }))

async function HandleSearch(req: NextRequest) {
 

  const staticOutput = await (await GET()).json()
  return NextResponse.json(staticOutput)
  /*var reqUrl = req.url

  let NewURL: string = reqUrl

  if (reqUrl.includes("&")) {
    NewURL = reqUrl.split("&")[0]
  }*/
//console.log(await (await staticGET()).json())
  
/*
  const mockRequest = new NextRequest(NewURL)
  
  const fullSearch: FullSearch = await (await GET(/*mockRequest as NextRequest | any/)).json()
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
      const requestPage = source.getPage(url)
      if (requestPage?.tags.includes(tagRequested)) {
        entry.url = requestPage.slugs.join("/")
        endSearch.push(entry)
      }

    }

  } else {
    endSearch = fullSearch
  }
  console.log(endSearch)
  return NextResponse.json(endSearch)*/
}
export { GetRequest as GET }

/*export const { staticGET : GET } = createFromSource(sourceLib as FullSource, (page: Page) => (
  {
    title: page.data.title,
    description: page.data.description,
    url: page.url,
    id: page.url,
    structuredData: page.data.structuredData,
  }))
*/