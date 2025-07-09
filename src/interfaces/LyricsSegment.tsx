import React from 'react';

interface LyricsSegmentProps {
    chord?: string;
    lyric: string;
}

const LyricsSegment: React.FC<LyricsSegmentProps> = ({ chord, lyric }) => {
    return (
        <div style={{ display: 'inline-block' }}>
            <div style={{ fontSize: 'var(--chord-font-size)', position: 'relative' }}>
                <div style={{ height: '1em', color: 'var(--secondary-color)', fontWeight: '1000', fontFamily: 'monospace' }}>
                    {chord}
                </div>
            </div>
            <span style={{ height: '1em', }}>{lyric.replace(/ /g, '\u00A0')}</span>
        </div>
    );
};

export default LyricsSegment;