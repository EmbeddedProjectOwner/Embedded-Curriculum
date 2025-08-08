import { ReactElement, ReactNode } from "react"

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

export type CodeBlockOutputRef = {
    utilizeOutput: () => void;
}

export type FilterOutput = {
    included: React.ReactNode[],
    ignored: React.ReactNode[] | null,
}

export interface CodeBlockProps extends HTMLCodeOptions {
    children?: ReactNode[] | ReactElement,
    className: string,
    style: string,
    rawCode: any,
}

type buttonLocations = "Below Content" | "Above Content" | "Below Original"
type outputLocations = "Below" | "Above"

export interface CodeBlockServerProps extends CodeBlockProps {
    implementWrapper: boolean = false,
    wrapperOptions: {
        buttonLocation: buttonLocations = "Below Content",
        outputLocation: outputLocations = "Below"
    }
    clientRef?: React.ref<CodeBlockOutputRef>
    children: ReactNode[],

}

export interface CodeBlockClientProps extends CodeBlockProps, React.RefAttributes<CodeBlockOutputRef> {
    output: Outputs | null | undefined
    ref?: React.ref<CodeBlockOutputRef>
}

export interface CodeBlockWrapperProps extends CodeBlockClientProps {
    wrapperOptions: {
        buttonLocation: buttonLocations = "Below Content",
        outputLocation: outputLocations = "Below"
    },
    childrenOut: FilterOutput
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

type CodeTagIndex = Array<{
    tagContent: string,
    startPos: number, // Start of nearest <
    endPos: number, // Start of nearest /> after start
}>


type Outputs = {
    [index in langs]?: string | null
}