"use cache"
/**import { source } from "@/lib/source";
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContent={{
        enabled: true,
        style: "clerk",
      }}
      full={page.data.full}
    >
          <span className="DocPage_frame absolute inset-0 z-[-1] h-[64rem] max-h-screen overflow-hidden"></span>

      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents }} />
      </DocsBody>
    </DocsPage>

  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
**/
import { source } from "../../source";
import { Skeleton } from "@/components/shadcn";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import Image from "next/image";
import LogoIcon from "../../images/EmbeddedLogoText.png"
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ScrollWrapper } from "@/app/scrollWrapper";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { LoaderFunc } from "@/lib/loaderFunc";



const DocsPage = dynamic(() => import("fumadocs-ui/page").then((mod) => mod.DocsPage), {
  loading: LoaderFunc
})

const DocsBody = dynamic(() => import("fumadocs-ui/page").then((mod) => mod.DocsBody), {
  loading: LoaderFunc
})

const DocsDescription = dynamic(() => import("fumadocs-ui/page").then((mod) => mod.DocsDescription), {
  loading: LoaderFunc
})

const DocsTitle = dynamic(() => import("fumadocs-ui/page").then((mod) => mod.DocsTitle), {
  loading: LoaderFunc
})

// Ensure type safety for the route parameters
type RouteParams = { slug?: string[] };

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  "use cache"

  if (process.env.NODE_ENV == "development") {
    cacheLife('seconds') // Remove for production
  }

  const params = await props.params;
  const slugPath = params.slug?.join("/") || "";
  console.log("Requested slug:", slugPath);

  const page = await source.getPage(params.slug);
  if (!page) notFound();


  const MDX = page.data.body;

  return (
    <>
      <Suspense fallback={LoaderFunc()}>

        <ScrollWrapper>
          <Suspense>
            <DocsPage

              toc={page.data.toc}
              tableOfContent={{ enabled: true, style: "clerk" }}
              full={page.data.full}
            >
              <span className="DocPage_frame absolute inset-0 z-[-1] h-[64rem] max-h-screen overflow-hidden flex justify-center"><Image src={LogoIcon.src} width={1250} height={1250} className=" w-[25vw] aspect-[1690/931] opacity-25 mt-[10vh] sm:mt-[12vh] lg:mt-[8vh] xl:mt-[6vh] fixed m-auto" alt={""}></Image> </span>
              <Suspense>
                <DocsTitle>{page.data.title}</DocsTitle>
              </Suspense>
              <Suspense>
                <DocsDescription>{page.data.description}</DocsDescription>
              </Suspense>
              <Suspense>
                <DocsBody suppressHydrationWarning>

                  <MDX suppressHydrationWarning components={{ ...defaultMdxComponents }} />
                </DocsBody>
              </Suspense>
            </DocsPage>
          </Suspense>
        </ScrollWrapper>
      </Suspense>

    </>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<RouteParams>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      url: `/docs/${page.slugs.join('/')}`,
    },
  };
}
