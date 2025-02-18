'use client'
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import HTML from "@/app/(HTMLOutputs)/LayoutHTML";
import { CodeBlockProps, HandleOutput } from "./Modules/handleOutput";
import { twMerge } from "tailwind-merge";


const CodeBlockOutput: React.FC<CodeBlockProps> = ( {children, className, ...codeOptions} ) => {
    const [output, setOutput] = useState<string | null>(null);
    const [CSSOutput, setCSSOutput] = useState<string | null>(null);
    const [trigger, setTrigger] = useState<boolean>(true)

    const handleOutput = () => HandleOutput({ children, output, setOutput, setTrigger, setCSSOutput })
    const finalClassName = `${codeOptions.style ?? codeOptions.style}  ${(codeOptions.resizeable || codeOptions.resizeable == undefined) ? 'resize-y' : ''} min-h-[15vh] max-h-[250vh] overflow-scroll w-full border-muted-foreground bg-white rounded-md`
    return (
        <>
            {children}
            <div className={className ? className : "space-y-4"}>
                <Button variant={"outline"} onClick={handleOutput}>
                    Show Output
                </Button>
                {(output && !trigger) && ((
                    <div className="mt-[1.5%]">

                        <HTML tabs={false} class_Name={codeOptions.style ? twMerge(finalClassName, codeOptions.style) : finalClassName } {...codeOptions} customHTML={output} customCSS={(!output.includes(`<link rel="stylesheet"`) && CSSOutput) ? CSSOutput : undefined} includePage={!output.includes("<html>")}></HTML>
                    </div>
                ))}
            </div>
        </>
    );

};

export default CodeBlockOutput;