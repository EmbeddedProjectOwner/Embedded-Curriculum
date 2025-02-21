'use client'
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import HTML from "@/app/(HTMLOutputs)/LayoutHTML";
import { CodeBlockProps, HandleOutput } from "./Modules/handleOutput";
import { twMerge } from "tailwind-merge";

const CodeBlockOutput: React.FC<CodeBlockProps> = ({ children, className, ...codeOptions }) => {
    const [output, setOutput] = useState<string | null>(null);
    const [CSSOutput, setCSSOutput] = useState<string | null>(null);
    const [trigger, setTrigger] = useState<boolean>(true);
    const [finalClassName, setFinalClassname] = useState<string>("");

    const handleOutput = () => HandleOutput({ children, output, setOutput, setTrigger, setCSSOutput });

    useEffect(() => {
        let updatedClassName = `${codeOptions.style ?? ""} ${(codeOptions.resizeable || codeOptions.resizeable === undefined) ? 'resize-y' : ''} 
            min-h-[15vh] max-h-[250vh] overflow-scroll w-full border-muted-foreground bg-white rounded-md`;

        if (codeOptions.resizeable || codeOptions.resizeable === undefined) {
            if (codeOptions.resizeX) {
                updatedClassName = twMerge(updatedClassName, "resize", "overflow-x-hidden", "max-w-[100%]");
            }
        }
        

        if (codeOptions.style) {
            updatedClassName = twMerge(updatedClassName, codeOptions.style);
        }

        setFinalClassname(updatedClassName);
    }, [codeOptions.resizeable, codeOptions.resizeX, codeOptions.style]);

    return (
        <>
            {children}
            <div className={className || "space-y-4"}>
                <Button variant="outline" onClick={handleOutput}>
                    Show Output
                </Button>
                {output && !trigger && (
                    <div className="mt-[1.5%]">
                        <HTML 
                            tabs={false} 
                            class_Name={finalClassName} 
                            {...codeOptions} 
                            customHTML={output} 
                            customCSS={!output.includes(`<link rel="stylesheet"`) && CSSOutput ? CSSOutput : undefined} 
                            includePage={!output.includes("<html>")} 
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default CodeBlockOutput;
