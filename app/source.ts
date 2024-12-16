/**import { createMDXSource } from 'fumadocs-mdx';
import type { InferMetaType, InferPageType } from 'fumadocs-core/source';
import { loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { createElement } from 'react';
import { IconContainer } from '@/components/ui/icon';
import { meta, docs } from '@/.source';

export const source = loader({
  baseUrl: '/docs',
  icon(icon) {
    console.log("If Icon", icon)
    if (icon && icon in icons)
      return createElement(IconContainer, {
        icon: icons[icon as keyof typeof icons],
      });
  },
  source: createMDXSource(docs, meta),
 
});





export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;**/

import { createMDXSource } from "fumadocs-mdx";
import { icons } from "lucide-react";
import { createElement } from "react";
import { IconContainer } from "@/components/ui/icon";
import { meta, docs } from "@/.source";
import { customLoader } from "./sourceLoader";
import { source as sourceLib } from "@/lib/source";

type CustomMeta = {
  slug?: string;
  path?: string;
} & Record<string, any>;

type TransformOpt = (meta: CustomMeta) => CustomMeta

/**
  * @unused For now
  *   
**/

const transform : TransformOpt = (meta: CustomMeta) => {
  return meta;
}


export const source = customLoader({
  baseUrl: "/docs",
  source: createMDXSource(docs, meta),
  icon(icon) {
    if (icon && icon in icons)
      return createElement(IconContainer, {
        icon: icons[icon as keyof typeof icons],
      });
  },

  
  transform: transform
  
});


export type FullSource = typeof source & typeof sourceLib