import React, { useState, useEffect, useRef } from "react";
import { EditorView } from "@codemirror/view";
import { EditorState, type Extension } from "@codemirror/state";
import { basicSetup } from "codemirror";
import ChordProPreview from "./ChordProPreview.tsx";

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
Wir s[Em]eh'n auf Jah[C]e, Jah[G]we.  [D/F#]
Für [Em]immer Jah[C]we, Jah[D]e.

{comment: V2}
Denn [C]er ist [D/F#]unsre H[Em]offnung,
[G/H]  Er li[C]ebt, wie keiner es t[G]ut.  [Am7]
Erh[C]ebt den [D/F#]Gott des [Em]Himmels,
[Am7]gebt Ihm die [G/H]Ehre.    [C]        [D]`
        
    );

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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', }}>
            <div style={{ display: "flex", flex: '1 1 0', padding: "10px", boxSizing: "border-box" }}>
                <div style={{ display: 'flex', flex: '1', flexDirection: 'column', marginRight: "10px" }}>
                    <h3>Editor</h3>                
                    <div style={{ flex: 1, marginRight: "10px" }}>
                        <div ref={editorRef} style={{ border: "1px solid #ccc", height: "100%", overflow: "auto" }}></div>
                    </div>
                </div>

                <div className="preview-container" style={{ display: 'flex', flex: '1', flexDirection: 'column', marginRight: "10px" }}>
                    <h3>Preview</h3>
                    <div style={{ flex: 1, border: "1px solid #ccc", padding: "10px", overflowY: "auto", fontFamily: "sans-serif" }}>
                        <ChordProPreview text={text} />
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default App;