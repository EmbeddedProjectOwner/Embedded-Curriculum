'use client'
import { memo, RefObject, useMemo, useRef } from "react";
import { CodeBlockProps } from "./Modules/handleOutput";
import { Button } from '@/components/ui/button';
import CodeBlockOutput from "./outputCodeBlockClient";
import type { CodeBlockOutputRef, CodeBlockWrapperProps } from "./Modules/CodeBlock";



const OutputButton = ({ trigger }: { trigger: () => void }) => {
    return (
        <Button variant={"outline"} onClick={trigger}>
            Show Output
        </Button>
    )
}



function CodeBlockWrapper ({ children, wrapperOptions, childrenOut, ...codeOptions } : CodeBlockWrapperProps) {
    const ref = useRef<CodeBlockOutputRef>(null)

    const ButtonLocation = wrapperOptions.buttonLocation
    const OutputLocation = wrapperOptions.outputLocation

    const triggerOutput = () => {
        console.log('trigger')
        ref.current?.utilizeOutput()
    }
    
    return (
        <>




            {ButtonLocation == "Above Content" && <OutputButton trigger={triggerOutput}></OutputButton>}
            {OutputLocation == "Above" && <CodeBlockOutput {...codeOptions} ref={ref}></CodeBlockOutput>}


            {childrenOut.included}
            {ButtonLocation == "Below Original" && <OutputButton trigger={triggerOutput}></OutputButton>}

            {childrenOut.ignored}

            {ButtonLocation == "Below Content" && <OutputButton trigger={triggerOutput}></OutputButton>}
            {OutputLocation == "Below" && <CodeBlockOutput {...codeOptions} ref={ref}></CodeBlockOutput>}

        </>
    )
}

export default memo(CodeBlockWrapper)
 