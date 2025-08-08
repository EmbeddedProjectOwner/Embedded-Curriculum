import { indexMatchingTags } from "@/lib/tagMatcher"
import React, { ReactElement, ReactNode } from "react"
import type { langs, OutputCodeBlock, langTypes, Outputs, HandleOutputProps } from "./CodeBlock";


const AnalyzeChildren = (node: ReactNode): { text: string; } => {
    /* Handle plain text nodes */
    if (typeof node === "string") {
        return { text: node };
    }

    /* Handle arrays of nodes */
    if (Array.isArray(node)) {
        return node.reduce<{ text: string; }>(
            (acc, child) => {
                const { text } = AnalyzeChildren(child);
                return {
                    text: acc.text + text,
                };
            },
            { text: "" }
        );
    }

    /* Handle React elements */
    if (React.isValidElement(node)) {
        const { className, children } = node.props ?? {};

        // Skip elements with the nd-copy-ignore class
        if (typeof className === "string" && className.includes("nd-copy-ignore")) {
            return { text: "" };
        }

        // Recursively extract text from children
        const { text} = AnalyzeChildren(children);

        return {
            text,
        };
    }

    /* Fallback for unsupported node types */
    return { text: "" };
};

function checkCodeLang(children: OutputCodeBlock): langs | langTypes | undefined {
    var langTypes: langTypes = {}

    const advance = (node: React.ReactNode) => {
        if (!node) return;

        if (typeof node === "string") return; // skip plain text

        if (Array.isArray(node)) {
            node.forEach(advance);
            return;
        }

        if (React.isValidElement(node)) {
            const { langtype, children: childNodes } = node.props ?? {};

            if (langtype) {
                langTypes[`${Object.keys(langTypes).length}_${langtype}`] = { element: node };
            }

            advance(childNodes); // go deeper
        }
    };

     // 1️⃣ If the root has a langtype, return it immediately (single-lang case)
      if (children.props?.langtype) {
          return children.props.langtype as langs;
      }
  
      // 2️⃣ Otherwise, advance the children to collect all langtypes
      advance(children.props?.children);
/*
    const outputLang: langs | null = (children.props && children.props.langtype) ? children.props.langtype : null


    if (outputLang) return outputLang

    if (children && Array.isArray(children))
        children.forEach((entry) => {
    console.log('1', entry.props)
            for (let i of React.Children.toArray(entry.props.children) as [OutputCodeBlock]) {
                var actualElement = i.props.children
                console.log(actualElement)
                if (actualElement && actualElement.props.langtype) {

                    langTypes[langTypes.length + `_${actualElement.props.langtype}`] = { element: actualElement }
                }
            }
        })*/



    // return Object.keys(langTypes).length > 0 ? langTypes : undefined;
    console.log("langType", langTypes)
    return langTypes
}

const langs = ["js", "jsx", "ts", "tsx", "c", "cs", "gql", "py", "bash", "sh", "shell", "zsh", "html", "css", "c++"]


function handleLangs(langType: langs, code: ReactElement & {langtype?: langs}): Outputs | null | undefined {
    //let tempDiv = document.createElement("div")
    let outputContext: string

    const outputs: Outputs = {}


    const extractedText = AnalyzeChildren((code as any)?.props?.children);
    console.log("extract",extractedText)
    if (code && code.props && code.props.langtype != langType) return null;
    if (langs.includes(langType)) {
        outputs[langType] = extractedText.text

    }
    /* if (langType == "html") {

     

          tempDiv.innerHTML = ReactDOMServer.renderToString(((newCode) as unknown as any).props.children)
          var pre = tempDiv.getElementsByTagName('pre').item(0)
  
          if (pre) {
  
              pre.querySelectorAll('.nd-copy-ignore').forEach((node) => {
                  node.remove();
              });
  
              outputContext = pre.textContent || ""
          } else {
  
              outputContext = tempDiv.textContent || ""
          }
  
          if (pre && pre.getAttribute('langtype') !== 'html') return null;
  
  
  
          outputs.html = outputContext

    } else if (langType === "css") {

         tempDiv.innerHTML = ReactDOMServer.renderToString(((code) as unknown as any).props.children)
          var pre = tempDiv.getElementsByTagName('pre').item(0)
  
          if (pre) {
  
              pre.querySelectorAll('.nd-copy-ignore').forEach((node) => {
                  node.remove();
              });
  
              outputContext = pre.textContent || ""
          } else {
  
              outputContext = tempDiv.textContent || ""
          }
  
          if (pre && pre.getAttribute('langtype') !== 'css') return null;
  
          if (outputContext) {
  
              outputs.css = outputContext
          }
        }
         */

console.log("ops-out", outputs)
    return outputs
}

export function HandleOutput(children: HandleOutputProps["children"]): Outputs | null | undefined {
    if (children) {

        const langType = checkCodeLang(children as OutputCodeBlock)
        console.log(langType)
        const outputs: Outputs = {
            html: null,
            css: null,
        }

        if (typeof langType == "object") {

            for (let langs in langType) {
                var langSplit: langs = langs.split("_")[1] as langs
                console.log(langType[langs])
                const output = handleLangs(langSplit, langType[langs].element)

                if (output) {
                    outputs[langSplit] = output[langSplit]
                }

            }

        } else if (langType) {
            const output = handleLangs(langType, (children as any)[0] as ReactElement)
            if (output) {

                outputs[langType] = output[langType]
            }
        }

        return outputs
    } else {
        return null
    }
}