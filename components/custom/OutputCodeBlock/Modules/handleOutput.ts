import { indexMatchingTags } from "@/lib/tagMatcher"
import { CodeBlock } from "@/Modules/fumadocs-ui/dist/components/codeblock"
import React, { HTMLAttributes, MutableRefObject, ReactElement, ReactHTML, ReactHTMLElement, ReactNode, SyntheticEvent, useEffect } from "react"
import ReactDOMServer from 'react-dom/server'


type langs = "js" | "jsx" | "ts" | "tsx" | "c" | "cs" | "gql" | "py" | "bash" | "sh" | "shell" | "zsh" | "html" | "css" | "c++"

export type ExternalResourceTable<T> = {
    [index: string | number]: T
} & Array<{}>
export type Externals = {
    components?: ExternalResourceTable<ReactNode>,
    images?: ExternalResourceTable<string>
} & Array<{}>

export interface HTMLCodeOptions {
    optionNum?: number,
    tabs?: boolean,
    tabProps?: { title: string },
    class_Name?: string,
    customHTML?: string,
    customCSS?: string,
    includePage?: boolean,
    resizeable?: boolean,
    followMinResize?: boolean,
    resizeX?: boolean,
    onResize?: (e: SyntheticEvent<HTMLIFrameElement, Event>) => void,
    externals: Externals
    initialHeight?: number,
    iframeRef?: MutableRefObject<HTMLIFrameElement | null>
}

export interface CodeBlockProps extends HTMLCodeOptions {
    children: typeof CodeBlock | ReactNode | any,
    className: string,
    style: string,
    rawCode: any,
    ref: React.Ref<{ utilizeOutput: () => void; }> // now passed as regular prop
}


export interface HandleOutputProps {
    setTrigger: React.Dispatch<React.SetStateAction<boolean>>,
    setOutput: React.Dispatch<React.SetStateAction<string | null>>,
    setCSSOutput: React.Dispatch<React.SetStateAction<string | null>>,
    output: string | null,
    children: CodeBlockProps['children']
    externals: Externals
}

interface langTypes {
    [index: string]: {
        element: any,
    }
}

type OutputCodeBlock = ReactElement<OutputCodeBlockProps>

interface OutputCodeBlockProps extends ReactHTMLElement<HTMLElement> {
    children?: OutputCodeBlock // Will be one child
    langtype: langs
}

function checkCodeLang(children: OutputCodeBlock): langs | langTypes | undefined {
    const outputLang: langs | null = (children.props && children.props.langtype) ? children.props.langtype : null



    var langTypes: langTypes = {}

    if (outputLang) return outputLang
    if (children)
        for (let i of React.Children.toArray(children.props.children) as [OutputCodeBlock]) {

            var actualElement = i.props.children
            actualElement
            if (actualElement && actualElement.props.langtype) {

                langTypes[langTypes.length + `_${actualElement.props.langtype}`] = { element: actualElement }
            }
        }
    console.log(children, React.Children.toArray(children))
   /* if (children.props?.children) {
        for (const i of React.Children.toArray(children.props.children)) {
            if (typeof i === 'object' && i !== null && 'props' in i) {
                const actualElement = i.props.children;
                if (actualElement && typeof actualElement === 'object' && 'props' in actualElement && actualElement.props.langtype) {
                    langTypes[langTypes.length + `_${actualElement.props.langtype}`] = { element: actualElement };
                }
            }
        }
    }

    return Object.keys(langTypes).length > 0 ? langTypes : undefined;*/
    return langTypes
}

type CodeTagIndex = Array<{
    tagContent: string,
    startPos: number, // Start of nearest <
    endPos: number, // Start of nearest /> after start
}>



function handleLangs(langType: langs, setOutput: HandleOutputProps["setOutput"], setCSSOutput: HandleOutputProps["setCSSOutput"], code: ReactNode, output: string | null, externals: HandleOutputProps["externals"]): void {
    let tempDiv = document.createElement("div")
    let outputContext: string
    var editied = false

    type Outputs = {
        HTML: string | null,
        CSS: string | null,
    }
    const outputs: Outputs = {
        HTML: null,
        CSS: null
    }

    if (langType == "html") {
        var newCode = code //output

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

        if (pre && pre.getAttribute('langtype') !== 'html') return;



        setOutput(outputContext)


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

            setCSSOutput(outputContext)
        }
    }

    return 
}

export async function HandleOutput({ setOutput, output, setTrigger, children, setCSSOutput, ...options }: HandleOutputProps): Promise<void> {
    setTrigger((prev) => !prev)
    if (!output && children) {

        const langType = checkCodeLang(await children)

        if (typeof langType == "object") {

            for (let langs in langType) {
                var langSplit: langs = langs.split("_")[1] as langs
                handleLangs(langSplit, setOutput, setCSSOutput, langType[langs].element, output, options.externals)
            }

        } else if (langType) {
            handleLangs(langType, setOutput, setCSSOutput, children, output, options.externals)
        }
    }
}