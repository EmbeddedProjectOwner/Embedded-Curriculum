'use client';
import React, { Suspense, useEffect, useImperativeHandle, useRef, useState } from 'react';
import HTML from '@/app/(HTMLOutputs)/LayoutHTML';
import { twMerge } from 'tailwind-merge';
import { HoverCard } from '@/components/shadcn';
import { Skeleton } from "@/components/shadcn";
import { LoaderFunc } from '@/lib/loaderFunc';
import { Tab } from '@/Modules/fumadocs-ui/dist/components/tabs';
import { CodeBlockClientProps } from './Modules/CodeBlock';
let globalIframe: HTMLIFrameElement | null = null;


export default function CodeBlockOutputClient(props: CodeBlockClientProps) {
    const {
        className,
        ...codeOptions
    } = props;

    const ref = (props as any).ref; // ⬅️ new way to grab the ref manually
    // State management

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
    const [initialHeight, setInitialHeight] = useState<string | undefined>()
    const previousInitialHeight = useRef<number | string | undefined>()
    const [currentBody, setCurrentBody] = useState<HTMLIFrameElement | null>(null)

    const staticOutput = codeOptions.output
    const HTMLOutput = staticOutput ? staticOutput?.html : undefined
    const CSSOutput = staticOutput ? staticOutput.css : undefined
    useImperativeHandle(ref, () => ({
        utilizeOutput: () => { 
            console.log("hi")
            setTrigger((prev) => !prev) }
    }))

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
            (codeOptions.resizeable ?? true) && `resize-y "min-h-[15vh]" max-h-[250vh] overflow-scroll w-full border-muted-foreground bg-white rounded-md`,
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
            console.log(trigger, staticOutput)
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


    useEffect(() => {
        if (initialHeight) {
            if ((initialHeight !== previousInitialHeight.current) && previousInitialHeight.current && (initialHeight > previousInitialHeight.current)) {
                previousInitialHeight.current = initialHeight
                if (currentBody && currentBody.contentWindow?.document) {
                    currentBody.style.height = initialHeight
                    currentBody.style.minHeight = initialHeight
                }
            } else if (currentBody) {

                currentBody.style.height = initialHeight
                currentBody.style.minHeight = initialHeight

            }
        }

    }, [initialHeight])

    const captureElement = (e: React.SyntheticEvent<HTMLIFrameElement & { scaled?: boolean }, Event>) => {

        const newIframe = e.currentTarget;
        /* Ensure min height */
        // Run only once after initial render and updates
        if (codeOptions.followMinResize && newIframe && newIframe.contentWindow && newIframe.scaled != true) {
            const contentDoc = newIframe.contentWindow.document;

            const computedStyle = getComputedStyle(contentDoc.body)

            const marginTop = Math.abs(parseFloat(computedStyle.marginTop));
            const marginBottom = Math.abs(parseFloat(computedStyle.marginBottom)) + 2;

            newIframe.style.height = contentDoc.body.scrollHeight + marginBottom + marginTop + 'px'
            newIframe.style.minHeight = contentDoc.body.scrollHeight + marginBottom + marginTop + 'px'

            setInitialHeight(contentDoc.body.scrollHeight + marginBottom + marginTop + 'px')
            setCurrentBody(newIframe)
        }


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

        <Suspense fallback={(
            <>
                <div className="space-y-6 p-6 w-full mx-auto">
                    <div className="space-y-4">
                        <Skeleton.Skeleton className="h-8 w-1/4 bg-gray-700" />
                        <Skeleton.Skeleton className="h-6 w-2/3 bg-gray-700" />
                    </div>


                    <div className="space-y-2">
                        <Skeleton.Skeleton className="h-6 w-1/3 bg-gray-700" />
                        <Skeleton.Skeleton className="h-10 w-full bg-gray-800 rounded-md" />
                    </div>

                    <div className="space-y-3">
                        <Skeleton.Skeleton className="h-6 w-1/4 bg-gray-700" />
                        <Skeleton.Skeleton className="h-4 w-full bg-gray-800 rounded-md" />
                        <Skeleton.Skeleton className="h-4 w-5/6 bg-gray-800 rounded-md" />
                        <Skeleton.Skeleton className="h-4 w-2/3 bg-gray-800 rounded-md" />
                    </div>
                </div>
            </>
        )}>
            <div className={className || 'space-y-4'}>



                {staticOutput && (HTMLOutput || CSSOutput) && !trigger && (
                    <>
                        <div className="mt-[1.5%]">
                            <Suspense fallback={LoaderFunc()}>
                                <HTML
                                    class_Name={finalClassName}
                                    {...codeOptions}
                                    customHTML={HTMLOutput ? HTMLOutput : undefined}
                                    customCSS={HTMLOutput ? (!HTMLOutput.includes('<link rel="stylesheet"') && CSSOutput ? CSSOutput : undefined) : undefined}
                                    includePage={HTMLOutput ? (!HTMLOutput.includes('<html>')) : undefined}
                                    onResize={captureElement}
                                    externals={codeOptions.externals}
                                />
                            </Suspense>
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
        </Suspense>
    );
};
