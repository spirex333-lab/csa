import { Copy, Eye } from 'lucide-react';
import 'prismjs/themes/prism-tomorrow.css';
import { useState } from 'react';
import { Button } from '../button';
import { Card, CardContent } from '../card';
import { ScrollArea } from '../scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs';

import Prism from 'prismjs';
import 'prismjs/components/prism-markup';

export function HtmlEditor() {
  const [code, setCode] = useState('<div>\n  <h1>Hello, World!</h1>\n</div>');
  const [preview, setPreview] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const handlePreview = () => {
    setPreview(code);
  };

  return (
    <>
      <Tabs defaultValue="edit">
        <TabsList className="flex gap-2">
          <TabsTrigger value="edit">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <ScrollArea className="min-h-64 border rounded-md bg-gray-900 text-white relative">
            <pre className="absolute inset-0 w-full h-full language-markup text-sm">
              <code
                dangerouslySetInnerHTML={{
                  __html: Prism.highlight(
                    code,
                    Prism.languages.markup,
                    'markup'
                  ),
                }}
              />
            </pre>
            <textarea
              className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-white resize-none "
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="preview">
          <CardContent className="border p-4 bg-white rounded-md shadow">
            <div dangerouslySetInnerHTML={{ __html: preview }} />
          </CardContent>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button onClick={handleCopy} variant="outline">
          <Copy size={16} className="mr-1" /> Copy
        </Button>
        <Button onClick={handlePreview}>
          <Eye size={16} className="mr-1" /> Preview
        </Button>
      </div>
    </>
  );
}
