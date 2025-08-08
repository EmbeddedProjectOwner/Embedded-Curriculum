'use client'
import { ReactNode, Suspense, SyntheticEvent, useState } from "react";
import "../global.css"
import MinnWildImage from "../images/Course1/html/4/MinnWild.png"
import EmbeddedLogo from "../images/EmbeddedLogoScaledText.png"
import React from "react";
import { LoaderFunc } from "@/lib/loaderFunc";
import { HTMLCodeOptions } from "@/components/custom/OutputCodeBlock/Modules/handleOutput";
// HTMLContent you want to display

const HTMLContent = [
  `<header style="padding: 0.5%; outline: solid; height: 15%; left: 0px; width: 100vw; "><h1>Welcome to My Page!<h1/></header>
                      <footer style="outline: solid; height: 65px; margin-top: auto; width: 100vw;">Made by: <strong>Me!</strong></footer>`,

  `
<header style="padding: 0.5%; outline: solid; height: 15%; left: 0px; width: 100vw; "><h1>Welcome to My Page!<h1/></header>
<div id="interests-container" style="padding: 2%; display: flex; flex-direction: column; gap: 10px">
            <div id="interest-1" style='display: grid; padding: 2%; outline: solid; gap: 5%; grid-template-areas: 
            "heading heading img"
            "text text img"
            "text text img"
            '>
               
                <div style="grid-area: heading; outline: solid; align-self: start; line-height: 0px; text-align: center;">
                    <h3>Ice Hockey!</h3>
                </div>

                <div style="grid-area: text; outline: solid;">
                    <p>Paragraph text</p>
                </div>

                <div style="grid-area: img; outline: solid;">
                    <img alt="Image about hockey!"></img>
                </div>

            </div>
        </div>
                  <footer style="outline: solid; height: 65px; margin-top: auto; width: 100vw;">Made by: <strong>Me!</strong></footer>


  `,

  `
  <header style="padding: 0.5%; outline: solid; height: 15%; left: 0px; width: 100vw; "><h1>Welcome to My Page!<h1/></header>
<div id="interests-container" style="padding: 2%; display: flex; flex-direction: column; gap: 10px">
            <div id="interest-1" style='display: grid; padding: 2%; outline: solid; gap: 5%; grid-template-areas: 
            "heading heading img"
            "text text img"
            "text text img"
            '>
               
                <div style="grid-area: heading; outline: solid; align-self: start; line-height: 0px; text-align: center;">
                    <h3>Ice Hockey!</h3>
                </div>

                <div style="grid-area: text; outline: solid;">
                    <p>I'm really into Ice-Hockey,
	since I was born in Minnesota (the state of hockey). My favourite teams are the Minnesota Wild,
	and the Carolina Hurricanes.</p>
                </div>

                <div style="grid-area: img; outline: solid;">
                    <img alt="Image about hockey!" style="height: auto; width: 100%;" src="${MinnWildImage.src}"></img>
                </div>

            </div>
            <div id="interest-2" style='display: grid; padding: 2%; outline: solid; gap: 5%; grid-template-areas: 
            "img heading heading "
            "img text text"
            "img text text"
            '>
               
                <div style="grid-area: heading; outline: solid; align-self: start; line-height: 0px; text-align: center;">
                    <h3>Technology</h3>
                </div>

                <div style="grid-area: text; outline: solid;">
                    <p>I like pretty much anything tech. I enjoy repairing,
	and assembling hardware,
	notably,
	laptops. I'm really passionate about programming and,
	I work on the Audio/Video team for my Church and I love seeing new things in technology.</p>
                </div>

                <div style="grid-area: img; outline: solid; width: 80%;">
                    <img alt="Image about Technology!" style="max-height: 160px ; width: 100%;" src="${EmbeddedLogo.src}"></img>
                </div>

            </div>
        </div>
                      <footer style="outline: solid; height: 65px; margin-top: auto; width: 100vw;">Made by: <strong>Me!</strong></footer>


  `,
];



export default function HTML({
  optionNum,
  tabs,
  tabProps,
  class_Name,
  customHTML,
  includePage,
  customCSS,
  onResize,

}: HTMLCodeOptions) {
  // Render HTML content directly into an iframe
  let htmlString = optionNum ? `
  <!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body style="margin: 0; height: 100vh; overflow: hidden; display: flex; flex-direction: column;">
  
      ${HTMLContent[(optionNum ?? 1) - 1]}

  </html>
  `: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body style="margin: 0;"></body>`;

  let tabTitle: string | undefined;

  if (customHTML) {
    if (includePage) {


      htmlString = `
      <!DOCTYPE html>
        <html>
        <head>
          <title>My Page</title>
          ${(customCSS) ? `<style type="text/css">${customCSS}</style>` : ""}
        </head>
          <body style="margin: 0; height: 100vh; overflow: hidden;  display: flex; flex-direction: column;">
            ${customHTML}
          </body>
        </html>
      `
    } else {
      htmlString = customHTML
      if (customCSS) {
        htmlString = `<style type="text/css">${customCSS}</style> ${customHTML}`
      }
    }
  }

  if (tabs && tabProps?.title == undefined) {
    var getHTMLTitle = new RegExp(
      "(?<=<title>)(.*)(?=<\/title>)", // Finds the ... in <title>...</title>
      "gi"
    )

    tabTitle = getHTMLTitle.exec(htmlString)?.[0] ?? undefined
    
  }
  
  return (
    <>
    <Suspense fallback={LoaderFunc()}>
      {(tabs) ? (
        <>
        <div className=" rounded-md rounded-br-none rounded-bl-none text-black text-end pr-10 bg-white ml-2 border-2 border-b-0 border-black w-36 h-8">
          {tabs ? tabTitle : "My Page"}
        </div>
        </>
      ): (<></>)}

      <iframe
        className={class_Name ? class_Name : "w-full h-[500px] border-2 rounded-md border-black bg-white"}
        srcDoc={htmlString}
        title="Embedded Content"
        onLoad={onResize}
        
      />
    </Suspense>
    </>
  );
}
