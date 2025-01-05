"use server";
import { Suspense } from "react";
import "../global.css"
import MinnWildImage from "../images/Course1/html/4/MinnWild.png"
import EmbeddedLogo from "../images/EmbeddedLogoScaledText.png"
// HTMLContent you want to display
const HTMLContent = [ 
  `<header style="padding: 0.5%; outline: solid; height: 15%; left: 0px; width: 100vw; "><h1>Welcome to My Page!<h1/></header>
  <footer style="outline: solid; position: absolute; bottom: 0px; height: 10%; left: 0px; width: 100vw;">Made by: <strong>Me!</strong></footer>`,
  
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
<footer style="outline: solid; position: absolute; bottom: 0px; height: 10%; left: 0px; width: 100vw;">Made by: <strong>Me!</strong></footer>

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
                    <p>I'm really into Ice-Hockey, since I was born in Minnesota (the state of hockey). My favourite teams are the Minnesota Wild, and the Carolina Hurricanes.</p>
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
                    <p>I like pretty much anything tech. I enjoy repairing, and assembling hardware, notably, laptops. I'm really passionate about programming and, I work on the Audio/Video team for my Church and I love seeing new things in technology.</p>
                </div>

                <div style="grid-area: img; outline: solid; width: 80%;">
                    <img alt="Image about Technology!" style="max-height: 160px ; width: 100%;" src="${EmbeddedLogo.src}"></img>
                </div>

            </div>
        </div>
  <footer style="outline: solid; position: absolute; bottom: 0px; height: 10%; left: 0px; width: 100vw;">Made by: <strong>Me!</strong></footer>

  `,
];


export default async function HTML({ optionNum } : {optionNum?: number}) {
  // Render HTML content directly into an iframe
  const htmlString = `
  <!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body style="margin: 0;">
  
      ${HTMLContent[(optionNum ?? 1) - 1]}

  </html>
  `;

  return (
    <>
    <div className=" rounded-md rounded-br-none rounded-bl-none text-black text-end pr-10 bg-white ml-2 border-2 border-b-0 border-black w-36 h-8">
      My Page
    </div>
    <iframe
      className="w-full h-[500px] border-2 rounded-md border-black bg-white"
      srcDoc={htmlString} // Directly set the raw HTML string here
      title="Embedded Content"
    />
    </>
  );
}
