import React from 'react';

interface LyricsSegmentProps {
    chord?: string;
    lyric: string;
}

const LyricsSegment: React.FC<LyricsSegmentProps> = ({ chord, lyric }) => {
    return (
        <div style={{ display: 'inline-block' }}>
            <div style={{ fontSize: 'var(--chord-font-size)', position: 'relative' }}>
                {chord && (
                    <span style={{ position: 'absolute', top: '0', color: 'var(--chord-color)', fontWeight: 'bold', fontFamily: 'monospace' }}>
                        {chord}
                    </span>
                )}
                <div style={{ height: '1em', }}></div>
            </div>
            <span style={{ height: '1em', }}>{lyric.replace(/ /g, '\u00A0')}</span>
        </div>
    );
};

export default LyricsSegment;