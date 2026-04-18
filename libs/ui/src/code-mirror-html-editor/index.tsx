'use client';
import 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/theme/material.css';
import { useRef, useState } from 'react';
import { UnControlled } from 'react-codemirror2';

export type HtmlCodeEditorProps = {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};
export const HtmlCodeEditor = ({
  name,
  defaultValue,
  onChange,
  value,
}: HtmlCodeEditorProps) => {
  const [code, setCode] = useState(value ?? defaultValue);
  const editor = useRef();
  const wrapper = useRef();
  const editorWillUnmount = () => {
    if (!editor.current || !wrapper.current) return;
    editor.current.display.wrapper.remove();
    wrapper.current.hydrated = false;
  };
  return (
    <div className="App">
      <input name={name} value={code} type="hidden" />
      <UnControlled
        value={code}
        ref={wrapper}
        options={{
          mode: 'xml',
          theme: 'material',
          lineNumbers: true,
        }}
        onChange={(editor, data, value) => {
          setCode(value);
          onChange?.(value);
        }}
        editorDidMount={(e) => (editor.current = e)}
        editorWillUnmount={editorWillUnmount}
      />
    </div>
  );
};

export default HtmlCodeEditor;
