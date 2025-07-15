import type { HTMLCodeOptions } from "../../../../app/(HTMLOutputs)/LayoutHTML"
import { CodeBlock } from "@/Modules/fumadocs-ui/dist/components/codeblock"
import React, { useEffect } from "react"
import ReactDOMServer from 'react-dom/server'

type langs = "js" | "jsx" | "ts" | "tsx" | "c" | "cs" | "gql" | "py" | "bash" | "sh" | "shell" | "zsh" | "html" | "css" | "c++"
export interface CodeBlockProps extends HTMLCodeOptions {
    children: typeof CodeBlock | any,
    className: string,
    style: string
}

export interface HandleOutputProps {
    setTrigger: React.Dispatch<React.SetStateAction<boolean>>,
    setOutput: React.Dispatch<React.SetStateAction<string | null>>,
    setCSSOutput: React.Dispatch<React.SetStateAction<string | null>>,
    output: string | null,
    children: CodeBlockProps['children']
}

interface langTypes {
    [index: string]: {
        element: any,
    }
}

function checkCodeLang(children: any): langs | langTypes | undefined {
    const outputLang: langs | undefined = (children.props && children.props.langtype) ? children.props.langtype : null
    if (children) {
    var langTypes: langTypes = {}
    
    if (outputLang) return outputLang
    
    for (let i of React.Children.toArray(children.props.children)) {
        var actualElement = i.props.children
        if (actualElement.props.langtype) {

            langTypes[langTypes.length + `_${actualElement.props.langtype}`] = { element: actualElement }
        }
    }
    return langTypes
}
}

function handleLangs(langType: langs, setOutput: HandleOutputProps["setOutput"], setCSSOutput: HandleOutputProps["setCSSOutput"], code: any): void {
    let tempDiv = document.createElement("div")
    let outputContext: string

    if (langType == "html") {
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

        if (pre && pre.getAttribute('langtype') !== 'html') return;

        if (outputContext) {

            setOutput(outputContext);
        }

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

        if (pre && pre.getAttribute('langtype') !== 'css') return;

        if (outputContext) {

            setCSSOutput(outputContext);
        }
    }
}

export async function  HandleOutput({ setOutput, output, setTrigger, children, setCSSOutput }: HandleOutputProps): Promise<void> {
    setTrigger((prev) => !prev)
    if (!output && children) {
       
        const langType = checkCodeLang(await children)


        if (typeof langType == "object") {

            for (let langs in langType) {
                var langSplit: langs = langs.split("_")[1] as langs
                handleLangs(langSplit, setOutput, setCSSOutput, langType[langs].element)
            }

        } else if (langType) {
            handleLangs(langType, setOutput, setCSSOutput, children)
        }
    }
}