"use client";

import SearchDialog, {
  DefaultSearchDialogProps,
} from "fumadocs-ui/components/dialog/search-default";
import { JSX, Suspense } from "react";

export default function CustomDialog(
  props: JSX.IntrinsicAttributes & DefaultSearchDialogProps
) {
  return (
    <Suspense>
      <SearchDialog {...props} />
    </Suspense>
  );
}
