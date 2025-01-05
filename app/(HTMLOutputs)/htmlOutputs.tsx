import { JSDOM } from "jsdom"
import DOMPurify from 'dompurify';
import ReactDOM from "react-dom";
import React from "react";

const SafeHtmlPage = ({ htmlContent }: { htmlContent: string }) => {
  if (htmlContent) {
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);
    console.log('htmlContent', htmlContent)
    const sanitizedContent = purify.sanitize(htmlContent);
    console.log(sanitizedContent)
    return <div dangerouslySetInnerHTML={{ __html: sanitizedContent}} />;
  }
};

export default SafeHtmlPage;
