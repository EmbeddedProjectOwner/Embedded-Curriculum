'use client'
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import HTML from "@/app/(HTMLOutputs)/LayoutHTML";
import { CodeBlockProps, HandleOutput } from "./Modules/handleOutput";
import { twMerge } from "tailwind-merge";
import { HoverCard } from "@/components/shadcn";



const CodeBlockOutput: React.FC<CodeBlockProps> = ({ children, className, ...codeOptions }) => {
    const [output, setOutput] = useState<string | null>(null);
    const [CSSOutput, setCSSOutput] = useState<string | null>(null);
    const [trigger, setTrigger] = useState<boolean>(true);
    const [finalClassName, setFinalClassname] = useState<string>("");
    const [resizeOpen, setResizeOpen] = useState<boolean>(false);
    const [resizeProps, setResizeProps] = useState<{ width: string, height: string } | null>({ width: "", height: "" })
    const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null)
    
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

    function captureElement(e: React.SyntheticEvent<HTMLIFrameElement, Event>) {

        if (e.currentTarget && !iframe) {
            setIframe(e.currentTarget)
          

        }
    }

    useEffect(() => {
        if (iframe) {
            const observer = new ResizeObserver(resize);
            observer.observe(iframe);
            return () => observer.disconnect();
        }
    }, [iframe]);
    
    function resize(entries: ResizeObserverEntry[]) {
        const entry = entries[0];
        if (entry && iframe) {
            setResizeOpen(true);
            
           const rect = iframe.getBoundingClientRect();
           setResizeProps({
               width: `${Math.round(rect.width)}px`,
               height: `${Math.round(rect.height)}px`
           });
        }
    }
    

    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;
    
        if (resizeOpen) {
            // Clear any existing timeout and start a new countdown
            if (timeout) clearTimeout(timeout);
    
            timeout = setTimeout(() => {
                setResizeOpen(false);
            }, 3850);
        } else {
            // If resizeOpen is false, make sure there's no lingering timeout
            if (timeout) clearTimeout(timeout);
        }
    
        // Cleanup the timeout on unmount or when resizeOpen changes
        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [resizeOpen]);
    
    return (
        <>
            {children}
            <div className={className || "space-y-4"}>
                <Button variant="outline" onClick={handleOutput}>
                    Show Output
                </Button>
                {output && !trigger && (
                    <>
                        <div className="mt-[1.5%]">
                            <HTML
                                tabs={false}
                                class_Name={finalClassName}
                                {...codeOptions}
                                customHTML={output}
                                customCSS={!output.includes(`<link rel="stylesheet"`) && CSSOutput ? CSSOutput : undefined}
                                includePage={!output.includes("<html>")}
                                onResize={captureElement}
                            />
                        </div>
                        <HoverCard.HoverCard open={resizeOpen}>
                            <HoverCard.HoverCardContent className="relative w-full" stayRelative>
                                Width: {resizeProps?.width || "n/a"}<br/>
                                Height: {resizeProps?.height || "n/a"}
                            </HoverCard.HoverCardContent>
                            <HoverCard.HoverCardTrigger >

                            </HoverCard.HoverCardTrigger>
                        </HoverCard.HoverCard>
                    </>
                )}
            </div>
        </>
    );
};

export default CodeBlockOutput;
