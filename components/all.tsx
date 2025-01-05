import * as DocComponents_ from "./doc"
import * as ShadcnComponents_ from "./shadcn"
import { ScrollToLink } from "./ui/scrollLinkCustom"
export const FullPageSeparator = () => (
    <><br /><ShadcnComponents.Separator.Separator className="border-[3px] rounded-sm"></ShadcnComponents.Separator.Separator><br /></>
)

export {ScrollToLink}
export const DocComponents = DocComponents_
export const ShadcnComponents = ShadcnComponents_

