/**
 * @function indexMatchingTags
 * @description Takes in text string formated in HTML tags, and utilizes the search string to compile array of matching tags.
 * Includes option to replace.
 * @returns @CodeTagIndex
 * 
 */

export type CodeTagIndex = Array<{
    tagContent: string,
    startPos: number, // Start of nearest <
    endPos: number, // Start of nearest /> after start
}>


export function indexMatchingTags(inputString: string, searchString: string, replaceString?: string, logMatch: boolean = false): { output: string; Tags?: CodeTagIndex } {
    // I'm honestly, not good with RegEx, credit: ChatGPT, for the regex expression.
    const regex = new RegExp(
    `<([\\w-]+)[^>]*${searchString}[^>]*>` +   // opening tag with searchString
    `[\\s\\S]*?` +                             // content (non-greedy)
    `<\\/\\1>` +                               // matching closing tag
    `|<([\\w-]+)[^>]*${searchString}[^>]*\\/?>`, // OR self-closing tag
    'gi'
  );
 console.log(searchString, regex.exec(inputString), inputString)
  const Tags: CodeTagIndex = [];
  let match;

  while ((match = regex.exec(inputString)) !== null) {
    Tags.push({
      tagContent: match[0],
      startPos: match.index,
      endPos: match.index + match[0].length,
    });
  }

  let output = inputString;
  if (replaceString && Tags.length) {
    // Replace matches from last to first to keep indices valid
    for (let i = Tags.length - 1; i >= 0; i--) {
      const { startPos, endPos } = Tags[i];
      output = output.slice(0, startPos) + replaceString + output.slice(endPos);
    }
  }

  return { output, Tags: logMatch ? Tags : undefined };
}