declare module "@monaco-editor/react" {
  import * as React from "react";

  export interface EditorProps {
    value?: string;
    defaultValue?: string;
    language?: string;
    theme?: string;
    height?: string | number;
    width?: string | number;
    options?: Record<string, unknown>;
    onChange?: (value: string | undefined) => void;
    onMount?: (editor: unknown) => void;
    className?: string;
  }

  export const Editor: React.FC<EditorProps>;
  export default Editor;
}
