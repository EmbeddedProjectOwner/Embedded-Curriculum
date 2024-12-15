import { createMDXSource } from "fumadocs-mdx";
import { loader, type LoaderOptions } from "fumadocs-core/source";
import { icons } from "lucide-react";
import { createElement } from "react";
import { IconContainer } from "@/components/ui/icon";
import { meta, docs } from "@/.source";
import matter from "gray-matter";
import { source } from "./source";

type CustomMeta = {
    slug?: string;
    path?: string;
} & Record<string, any>;

type CustomLoaderOptions = LoaderOptions & {
    transform: (meta: CustomMeta) => CustomMeta;
};

interface ValidData {
    title: string,
    slug: string,
    description: string,
    icon: string
}

export function customLoader(options: CustomLoaderOptions) {
    const baseLoader = loader(options);

    return {
        ...baseLoader,

        getPage(slug: string[] | undefined) {
            const page = baseLoader.getPage(slug);

            if (page && options.transform) {
                page.data.meta = options.transform(page.data.meta as CustomMeta);
            }
            return page;
        },
        
        generateParams() {
            const params = baseLoader.generateParams();

            if (options.transform) {
                return params.map((param) => (
                    {
                        ...param,
                        slug: options.transform(param.slug as CustomMeta).path,
                    }));
            }
            return params;
        },
    };
}
