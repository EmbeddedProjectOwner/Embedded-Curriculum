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

const LoaderFunc = () => (<><div className="space-y-6 p-6 max-w-4xl mx-auto">
  {/* Header Section */}
  <div className="space-y-4">
    <Skeleton.Skeleton className="h-8 w-1/4 bg-gray-700" /> {/* Title */}
    <Skeleton.Skeleton className="h-6 w-2/3 bg-gray-700" /> {/* Subtitle */}
  </div>

  {/* Logo */}
  <div className="h-16 w-16 bg-gray-700 rounded-lg mx-auto" />

  {/* Table of Contents */}
  <div className="space-y-2">
    <Skeleton.Skeleton className="h-6 w-1/3 bg-gray-700" /> {/* Table of Contents Title */}
    <Skeleton.Skeleton className="h-10 w-full bg-gray-800 rounded-md" /> {/* Dropdown */}
  </div>

  {/* Introduction Section */}
  <div className="space-y-3">
    <Skeleton.Skeleton className="h-6 w-1/4 bg-gray-700" /> {/* Introduction Title */}
    <Skeleton.Skeleton className="h-4 w-full bg-gray-800 rounded-md" /> {/* Paragraph Line 1 */}
    <Skeleton.Skeleton className="h-4 w-5/6 bg-gray-800 rounded-md" /> {/* Paragraph Line 2 */}
    <Skeleton.Skeleton className="h-4 w-2/3 bg-gray-800 rounded-md" /> {/* Paragraph Line 3 */}
  </div>
</div></>)

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
                <DocsBody>

                  <MDX components={{ ...defaultMdxComponents }} />
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
