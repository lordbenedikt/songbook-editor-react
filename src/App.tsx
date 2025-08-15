import React, { useState, useEffect, useRef } from "react";
import { EditorView } from "@codemirror/view";
import { EditorState, type Extension } from "@codemirror/state";
import { basicSetup } from "codemirror";
import './App.css'
import ChordProPreview from "./interfaces/ChordProPreview.tsx";
import { downloadPdfFromHtml } from './api/pdf.tsx';
import cssContent from './style.css?raw';
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css?raw';

const App: React.FC = () => {
    const [text, setText] = useState<string>(
        
`{title: JAHWE}
{artist: Ps.104; 2.Mo.3,13-14; Phil.2,10-11}

{comment: V1}
Jah[C]we, Er [D/F#]lebt für [Em]immer,
[G/H]   Er herrscht mit Liebe und Kr[G]aft.  [Am7]
Die W[C]elt muss s[D/F#]ich nun b[E]eugen,
denn [Am]er ist erh[G/H]oben.[C   D]

{comment: PC}
Wir s[Em]eh'n auf Jah[C]we, Jah[G]we.  [D/F#]
Für [Em]immer Jah[C]we, Jah[D]we.

{comment: V2}
Denn [C]Er ist [D/F#]unsre H[Em]offnung,
[G/H]  Er li[C]ebt, wie keiner es t[G]ut.  [Am7]
Erh[C]ebt den [D/F#]Gott des [Em]Himmels,
[Am7]gebt Ihm die [G/H]Ehre.    [C]        [D]
{part: PC}
{comment: C}
(Denn) [G]Er regiert für immer,
[D]Er regiert für immer,
[Am7]Er re[Em]giert, für[C] immer und[D] ewig.
Denn [G]Er regiert für immer,
[D]Er regiert für immer,
[Am7]Er reg[Em]iert, für[C] immer und[D] ewig, Jah[G]we.
{part: PC}
{part: C}
{footnote: Originaltitel Yahweh | T&M Reuben Morgan | Dt. Text Melina Lörracher | © 2009 Hillsong Music Publishing | Für D, A, CH: CopyCare Deutschland, 71087 Holzgerlingen}`
        
    );

    const downloadPreviewAsPdf = () => {
        const page = document.getElementById('page-preview')?.innerHTML || '';
        const title = document.getElementById('song-title')?.innerHTML || 'unnamed';
        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <title>Dynamic PDF</title>
              <style>
                ${bootstrapCss}
                ${cssContent}
              </style>
            </head>
            <body>
                <div style="display: flex; flex-direction: column; width: 100%">
                    ${page}
                </div>
            </body>
            </html>
        `;
        downloadPdfFromHtml(html, `${title}.pdf`);
    };

    const editorRef = useRef<HTMLDivElement | null>(null);
    const viewRef = useRef<EditorView | null>(null);

    useEffect(() => {
        if (!editorRef.current) return;

        const updateListener: Extension = EditorView.updateListener.of((update) => {
            if (update.docChanged) {
                const value = update.state.doc.toString();
                setText(value);
            }
        });

        const startState = EditorState.create({
            doc: text,
            extensions: [basicSetup, updateListener],
        });

        viewRef.current = new EditorView({
            state: startState,
            parent: editorRef.current,
        });

        return () => {
            if (viewRef.current) {
                viewRef.current.destroy();
                viewRef.current = null;
            }
        };
    }, []); // run once on mount

    useEffect(() => {
        if (viewRef.current) {
            const currentText = viewRef.current.state.doc.toString();
            if (currentText !== text) {
                viewRef.current.dispatch({
                    changes: { from: 0, to: currentText.length, insert: text },
                });
            }
        }
    }, [text]);

    
    
    // const printToPdf = () => {
    //     exportElementToPDF(document.getElementById("page-preview"),1,"example.pdf");
    // };

    return (
        <div style={{ display: "flex", flexDirection: "row", height: "100%", width: "100vw", padding: "1vh", boxSizing: "border-box", }}>
            
            <div style={{ display: 'flex', flex: '1 1 0', flexDirection: 'column', marginRight: "10px", minWidth: 0, minHeight: 0, }}>
                <h3>Editor</h3>              
                <div className="scrollable border-gray" style={{ flex: "1 1 0", marginRight: "10px", }}>
                    <div ref={editorRef}></div>
                </div>
                <button className="btn btn-primary" onClick={downloadPreviewAsPdf}>Print to PDF</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', marginRight: "10px", width: "65vh", }}>
                <h3>Preview</h3>
                <div id="page-preview" className="preview-container-wrapper h-100 w-100">
                    <div className="preview-container border-gray" style={{ fontSize: '1.8vh', }}>
                        <ChordProPreview text={text} />
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default App;