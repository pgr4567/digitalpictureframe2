import React, { useState, useEffect, useCallback } from 'react';

const IMAGE_DURATION = 10000;
const DURATION_AFTER_VIDEO = 3000;

export default function Home() {
    const [filenames, setFilenames] = useState<string[]>([]);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const url = 'http://' + window.location.hostname + ':3001/';

    useEffect(() => {
        setIsClient(true);
        fetch(url + 'getmedia')
            .then(res => res.json())
            .then(data => setFilenames(data.filenames))
            .catch(err => console.error('Failed to load media:', err));
    }, [url]);

    const isVideo = useCallback((file: string) => {
        return /\.(mp4|avi|mov|wmv|flv|mkv)$/.test(file);
    }, []);

    const goToNextMedia = useCallback(() => {
        setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % filenames.length);
    }, [filenames.length]);

    useEffect(() => {
        if (!isClient || filenames.length === 0) return;

        let timeout: NodeJS.Timeout;
        const currentFile = filenames[currentMediaIndex];

        if (isVideo(currentFile)) {
            const videoElement = document.getElementById('video-element') as HTMLVideoElement;
            videoElement.play();
            videoElement.onended = () => {
                timeout = setTimeout(goToNextMedia, DURATION_AFTER_VIDEO);
            };
        } else {
            timeout = setTimeout(goToNextMedia, IMAGE_DURATION);
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [isClient, currentMediaIndex, filenames, goToNextMedia, isVideo]);

    if (!isClient) {
        return <div>Loading...</div>;
    }

    return (
        <main className="w-screen h-screen overflow-hidden bg-black">
            {isVideo(filenames[currentMediaIndex]) ? (
                <video id="video-element" src={'/uploads/' + filenames[currentMediaIndex]} muted className="w-full h-full object-contain" />
            ) : (
                <div className="relative w-full h-full bg-black">
                    <img
                        src={'/uploads/' + filenames[currentMediaIndex]}
                        alt="Slideshow"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
                    />
                </div>
            )}
        </main>
    );
}
