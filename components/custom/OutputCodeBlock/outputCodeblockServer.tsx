'use server';
import React, { ReactElement } from 'react';
import { HandleOutput } from './Modules/handleOutputServer';

import CodeBlockOutputClient from './outputCodeBlockClient';
import { CodeBlockServerProps, FilterOutput } from './Modules/CodeBlock';
import  CodeBlockWrapper from './codeBlockWrapper';

function FilterChildren(children: React.ReactNode[], implement: boolean = false): FilterOutput {

  const allChildren = Array.isArray(children) ? children : [children]
  const output: FilterOutput = { included: children, ignored: null }

  if (implement) {
    const [codeOutputChildren, ignoredChildren] = allChildren.reduce<[React.ReactNode[], React.ReactNode[]]>(
      (acc, child) => {
        
        if (
          typeof child === 'object' &&
          child !== null &&
          'props' in child &&
          (child as any).props?.id !== 'ignore'
        ) {
          acc[0].push(child)
        } else {
          acc[1].push(child)
        }
        return acc
      },
      [[], []]
    )

    output.included = codeOutputChildren
    output.ignored = ignoredChildren
  } else {
    output.included = children
  }

  return output
}

function CodeBlockOutput(props: CodeBlockServerProps) {
  const {
    children,
    className,
    ...codeOptions
  } = props;

  const output = FilterChildren(children, props.implementWrapper)
  const handleOutput = HandleOutput(output.included[0] as ReactElement);
  console.log(handleOutput)

  const WrapOptions = props.wrapperOptions
  return (
    <>
      {props.implementWrapper ? (
        <CodeBlockWrapper
          childrenOut={output}
          {...props}
          wrapperOptions={{
            buttonLocation: WrapOptions ? (WrapOptions.buttonLocation ? WrapOptions.buttonLocation : "Below Content") : "Below Content",
            outputLocation: WrapOptions ? (WrapOptions.outputLocation ? WrapOptions.outputLocation : "Below") : "Below"
          }}
          output={handleOutput}></CodeBlockWrapper>
      ) : (
        <CodeBlockOutputClient {...props} output={handleOutput}></CodeBlockOutputClient>
      )}
    </>
  );
};

export default CodeBlockOutput;
