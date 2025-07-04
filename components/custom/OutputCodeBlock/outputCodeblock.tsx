'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import HTML from '@/app/(HTMLOutputs)/LayoutHTML';
import { CodeBlockProps, HandleOutput } from './Modules/handleOutput';
import { twMerge } from 'tailwind-merge';
import { HoverCard } from '@/components/shadcn';

let globalIframe: HTMLIFrameElement | null = null;

const CodeBlockOutput: React.FC<CodeBlockProps> = ({ children, className, ...codeOptions }) => {
    // State management
    const [output, setOutput] = useState<string | null>(null);
    const [CSSOutput, setCSSOutput] = useState<string | null>(null);
    const [trigger, setTrigger] = useState<boolean>(true);
    const [finalClassName, setFinalClassName] = useState<string>('');
    const [resizeOpen, setResizeOpen] = useState<boolean>(false);
    const [resizeProps, setResizeProps] = useState<{ width: string; height: string } | null>(null);
    const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
    const [isIframeVisible, setIsIframeVisible] = useState<boolean>(false);

    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const lastSize = useRef({ width: 0, height: 0 });
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

    // Effect to observe and clean up iframe
    useEffect(() => {
        const currentIframe = iframeRef.current;
        if (currentIframe) {
            cleanupIframe();
            observeIframe(currentIframe);
            globalIframe = currentIframe;
        }
    }, [iframeRef.current]);

    useEffect(() => {
        let updatedClassName = twMerge(
            codeOptions.style ?? '',
            (codeOptions.resizeable ?? true) && 'resize-y min-h-[15vh] max-h-[250vh] overflow-scroll w-full border-muted-foreground bg-white rounded-md',
            codeOptions.resizeX && 'resize overflow-x-hidden max-w-[100%]'
        );

        setFinalClassName(updatedClassName);
    }, [codeOptions.style, codeOptions.resizeable, codeOptions.resizeX]);

    useEffect(() => {
        if (iframe) {
            const observer = new ResizeObserver(resize);
            observer.observe(iframe);

            if (!isIframeVisible) cleanupIframe();

            return () => observer.disconnect();
        }
    }, [iframe, isIframeVisible]);

    useEffect(() => {
        handleMouseListeners('add');

        return () => handleMouseListeners('remove');
    }, []);

    useEffect(() => {
        if (resizeOpen) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(() => {
                if (!isMouseDown) setResizeOpen(false);
            }, 3850);
        }

        if (trigger) {
            setResizeOpen(false);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                handleMouseListeners('remove');
                timeoutRef.current = null;
            }
        };
    }, [resizeOpen, isMouseDown, trigger]);

    // Output handling
    const handleOutput = () => HandleOutput({ children, output, setOutput, setTrigger, setCSSOutput });


    const captureElement = (e: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
        const newIframe = e.currentTarget;

        if (globalIframe && globalIframe !== newIframe) {
            // Deactivate the previous iframe
            globalIframe.setAttribute('data-active', 'false');
        }

        // Activate the new iframe
        newIframe.setAttribute('data-active', 'true');
        cleanupIframe();
        setIframe(newIframe);
        globalIframe = newIframe;
        iframeRef.current = newIframe;

        observeIframe(newIframe);
        observeActiveState(newIframe);
    };

    // Observe changes to the "data-active" attribute
    const observeActiveState = (iframe: HTMLIFrameElement) => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (
                    mutation.type == "attributes" &&
                    mutation.attributeName === 'data-active' &&
                    iframe.getAttribute('data-active') === 'false'
                ) {
                    setResizeOpen(false);
                    setResizeProps(null);
                    setTrigger(true);
                }
            });
        });

        async () => observer.observe(iframe, { attributes: true, attributeFilter: ['data-active'] });

        return () => {
           observer.disconnect();
        }
    };


    const observeIframe = (iframe: HTMLIFrameElement) => {
        const intersectionObserver = new IntersectionObserver(([entry]) => {
            setIsIframeVisible(entry.isIntersecting);
            if (!entry.isIntersecting) setTrigger(true);
        }, { threshold: 0.01, rootMargin: '100px' });


        intersectionObserver.observe(iframe);

        return () => {
            intersectionObserver.disconnect();
        };
    };
    const cleanupIframe = () => {
        if (iframeRef.current) {
            const rect = iframeRef.current.getBoundingClientRect();
            lastSize.current = { width: Math.round(rect.width), height: Math.round(rect.height) };
        }
        iframeRef.current = null;
        setResizeOpen(false);
        setResizeProps(null);
    };

    const resize = (entries: ResizeObserverEntry[]) => {
        const entry = entries[0];
        if (entry && iframe) {
            const rect = iframe.getBoundingClientRect();
            const newWidth = Math.round(rect.width);
            const newHeight = Math.round(rect.height);

            if (lastSize.current.width !== newWidth || lastSize.current.height !== newHeight) {
                lastSize.current = { width: newWidth, height: newHeight };
                setResizeOpen(true);
                setResizeProps({ width: `${newWidth}px`, height: `${newHeight}px` });
            }
        }
    };

    // Mouse event handlers
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseDown = () => setIsMouseDown(true);

    const handleMouseListeners = (action: 'add' | 'remove' = 'add') => {
        const method = action === 'add' ? window.addEventListener : window.removeEventListener;
        method('mouseup', handleMouseUp);
        method('mousedown', handleMouseDown);
        if (action === 'remove') setIsMouseDown(false);
    };

    return (
        <>
            {children}
            <div className={className || 'space-y-4'}>
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
                                customCSS={!output.includes('<link rel="stylesheet"') && CSSOutput ? CSSOutput : undefined}
                                includePage={!output.includes('<html>')}
                                onResize={captureElement}
                            />
                        </div>
                        <HoverCard.HoverCard open={resizeOpen}>
                            <HoverCard.HoverCardContent className="relative w-full" stayRelative>
                                Width: {resizeProps?.width || 'n/a'}
                                <br />
                                Height: {resizeProps?.height || 'n/a'}
                            </HoverCard.HoverCardContent>
                            <HoverCard.HoverCardTrigger />
                        </HoverCard.HoverCard>
                    </>
                )}
            </div>
        </>
    );
};

export default CodeBlockOutput;
