import React from "react";
import LyricsSegment from "./LyricsSegment";

interface Segment {
    chord?: string;
    lyric: string;
}

interface ParsedLine {
    type: 'directive' | 'lyrics' | 'br';
    key?: string;
    value?: string;
    segments?: Segment[];
}

function parseChordPro(chordProText: string): ParsedLine[] {
    const lines = chordProText.split(/\r?\n/);
    const parsedLines: ParsedLine[] = [];

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.length === 0) {
            parsedLines.push({ type: 'br' });
            continue;
        }

        const directiveMatch = trimmedLine.match(/^\{(\w+):\s*(.+?)\s*\}$/);
        if (directiveMatch) {
            parsedLines.push({
                type: 'directive',
                key: directiveMatch[1].toLowerCase(),
                value: directiveMatch[2],
            });
            continue;
        }

        const segments: Segment[] = [];
        const chordRegex = /\[([^\]]*)\]/g;
        let lastIndex = 0;
        let match;

        while ((match = chordRegex.exec(trimmedLine)) !== null) {
            // Add lyric before the chord if any
            if (match.index > lastIndex) {
                segments.push({ lyric: trimmedLine.substring(lastIndex, match.index) });
            }
            lastIndex = chordRegex.lastIndex;
            // Look ahead to next chord or end
            const nextMatch = chordRegex.exec(trimmedLine);
            chordRegex.lastIndex = lastIndex; // reset regex state
            const nextIndex = nextMatch ? nextMatch.index : trimmedLine.length;
            const lyricAfterChord = trimmedLine.substring(lastIndex, nextIndex);
            segments.push({ chord: match[1], lyric: lyricAfterChord });
            lastIndex = nextIndex;
        }
        // If no chords, or trailing lyric after last chord
        if (segments.length === 0) {
            segments.push({ lyric: trimmedLine });
        } else if (lastIndex < trimmedLine.length) {
            segments.push({ lyric: trimmedLine.substring(lastIndex) });
        }

        if (segments.length > 0) {
            parsedLines.push({ type: 'lyrics', segments });
        }
    }
    return parsedLines;
}

const ChordProPreview: React.FC<{ text: string }> = ({ text }) => {
    const parsedContent = parseChordPro(text);
    const songNumber = 128;

    return (
        <div id="page-preview" className="songbook-page">
            <div className="songbook-page-frame">
                <div className="song-number-badge">
                    <div className="center">
                        {songNumber}
                    </div>
                </div>
                {parsedContent.map((line, lineIndex) => {
                    if (line.type === 'br') {
                        return <br key={lineIndex} />;
                    }
                    if (line.type === 'directive') {
                        switch (line.key) {
                            case 'title':
                                return <h2 id="song-title" key={lineIndex}>{line.value}</h2>;
                            case 'artist':
                                return <h4 key={lineIndex}>{line.value}</h4>;
                            case 'comment':
                                return <div className="paragraph-badge" key={lineIndex}>
                                    <div className="center">
                                        {line.value}
                                    </div>
                                </div>;
                            case 'part':
                                return <div className="part-badge" key={lineIndex}>
                                        <div className="center">
                                            {line.value}
                                        </div>
                                    </div>;
                            case 'footnote':
                                return <div className="footnote" key={lineIndex}>
                                        {line.value}
                                    </div>;
                            default:
                                return <div key={lineIndex}>{line.value}</div>;
                        }
                    }
                    if (line.type === 'lyrics' && line.segments) {
                        return (
                            <div key={lineIndex} style={{ display: 'flex', flexWrap: 'nowrap', lineHeight: 1.2, whiteSpace: 'pre' }}>
                                {line.segments.map((segment, segmentIndex) => (
                                    <LyricsSegment key={segmentIndex} chord={segment.chord} lyric={segment.lyric} />
                                ))}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default ChordProPreview;