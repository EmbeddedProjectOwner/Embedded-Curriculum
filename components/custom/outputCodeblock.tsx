'use client'
// OutputButton.tsx
import React, { useState } from "react";
import ReactDOMServer from 'react-dom/server'
import { Button } from "@/components/ui/button"; // Assuming ShadCN UI is set up
import { CodeBlock } from "@/Modules/fumadocs-ui/dist/components/codeblock";
import HTML from "@/app/(HTMLOutputs)/LayoutHTML";
import type { HTMLCodeOptions } from "../../app/(HTMLOutputs)/LayoutHTML";

interface CodeBlockProps {
    children: typeof CodeBlock | any,
    codeOptions: HTMLCodeOptions,
    className: string,
}

const CodeBlockOutput: React.FC<CodeBlockProps> = ({ children, className, codeOptions }) => {
    const [output, setOutput] = useState<string | null>(null);
    const [trigger, setTrigger] = useState<boolean>(true)

    const handleOutput = () => {
        setTrigger((prev) => !prev)

        if (!output) {
            let tempDiv = document.createElement("div")
            let outputContext: string
            console.log(tempDiv, children)

            if (children.props && children.props.langtype == 'html') {
                tempDiv.innerHTML = ReactDOMServer.renderToString(((children) as unknown as any).props.children)
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

                setOutput(outputContext);

            } else {
                for (let i of children.props.children) {
                    var actualElement = i.props.children
                    if (actualElement.props.langtype == "html") {
                        let tempDiv = document.createElement("div")
                        let outputContext: string
                        tempDiv.innerHTML = ReactDOMServer.renderToString(((actualElement) as unknown as any).props.children)
                        var pre = tempDiv.getElementsByTagName('pre').item(0)
                        if (pre) {
                            pre.querySelectorAll('.nd-copy-ignore').forEach((node) => {
                                node.remove();
                            });
                            outputContext = pre.textContent || ""
                        } else {
                            outputContext = tempDiv.textContent || ""

                        }
                        setOutput(tempDiv.textContent);
                    }
                }


            }
        }
    };
    return (
        <>
            {children}
            <div className={className ? className : "space-y-4"}>
                <Button variant={"outline"} onClick={handleOutput}>
                    Show Output
                </Button>
                {(output && !trigger) && ((
                    <div className="mt-[1.5%]">
                        <HTML tabs={false} class_Name={"resize-y min-h-[15vh] max-h-[250vh] overflow-scroll w-full border-muted-foreground bg-white rounded-md"} {...codeOptions} customHTML={output} includePage={!output.includes("<html>")}></HTML>
                    </div>
                ))}
            </div>
        </>
    );

};





export default CodeBlockOutput;

