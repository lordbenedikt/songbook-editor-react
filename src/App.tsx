import React, { useState, useEffect, useRef } from "react";
import { EditorView } from "@codemirror/view";
import { EditorState, type Extension } from "@codemirror/state";
import { basicSetup } from "codemirror";
import ChordProPreview from "./ChordProPreview.tsx";

const App: React.FC = () => {
    const [text, setText] = useState<string>(
        `{title: Fly High}
{artist: Example Band}
{comment: Verse 1}
[C]I hear the [G]sound of the wind
[Am]Whispering [F]stories again

[C]Walking this [G]old dusty road
[Am]Wondering [F]where I should go

{comment: Chorus}
[C]And I’ll [G]fly, high above the [Am]sky
Leaving all my [F]fears behind`
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

                <div style={{ display: 'flex', flex: '1', flexDirection: 'column', marginRight: "10px" }}>
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