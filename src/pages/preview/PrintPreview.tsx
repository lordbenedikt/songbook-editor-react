import React, {useEffect, useState} from "react";
import ChordProPreview from "../../interfaces/ChordProPreview.tsx";

const PrintPreview: React.FC = () => {
    const [songSource, setSongSource] = useState("");
    
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.songSource) {
                setSongSource(event.data.songSource);
            }        
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    useEffect(() => {
        function setPreviewContainerFontSize() {
            console.log("Window loaded:", window.innerWidth, window.innerHeight);
            Array.from(document.getElementsByClassName("preview-container")).forEach((el) => {
                (el as HTMLElement).style.fontSize = el.getBoundingClientRect().height * 0.02 + "px";
            });
        }
        document.body.onload = () => {setPreviewContainerFontSize()};
        document.body.onresize = () => {setPreviewContainerFontSize()};
        document.body.style.overflow = "hidden";
    }, []);
    
    return (
        <div id="page-preview flex-fill" className="preview-container-wrapper h-100 w-100">
            <div className="preview-container">
                <ChordProPreview text={songSource}/>
            </div>
        </div>
    );
};

export default PrintPreview