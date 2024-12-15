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
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import Image from "next/image";
import LogoIcon from "../../images/EmbeddedLogoText.png"
// Ensure type safety for the route parameters
type RouteParams = { slug?: string[] };

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const slugPath = params.slug?.join("/") || "";
  console.log("Requested slug:", slugPath);

  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContent={{ enabled: true, style: "clerk" }}
      full={page.data.full}
    >
      <span className="DocPage_frame absolute inset-0 z-[-1] h-[64rem] max-h-screen overflow-hidden flex justify-center"><Image src={LogoIcon.src} width={1250} height={1250} className=" w-[25vw] aspect-[1690/931] opacity-25 mt-[10vh] sm:mt-[12vh] lg:mt-[8vh] xl:mt-[6vh] fixed m-auto" alt={""}></Image> </span>

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
  params: Promise<RouteParams>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
