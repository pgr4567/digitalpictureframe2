import React, { useState, useEffect } from 'react';

// const url = 'http://raspberrypi.local:3001/';
const url = 'http://localhost:3001/';
export default function Edit() {
    const [uploading, setUploading] = useState(false);
    const [filenames, setFilenames] = useState([]);

    useEffect(() => {
        fetch(url + 'getmedia')
            .then(res => res.json())
            .then(data => setFilenames(data.filenames))
            .catch(err => console.error('Failed to load media:', err));
    }, [uploading]);

    const handleDelete = async (filename) => {
        try {
            await fetch(url + 'deletemedia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filename }),
            });
            setFilenames(filenames.filter(file => file !== filename));
        } catch (error) {
            console.error('Failed to delete the file:', error);
        }
    };

    function renderMedia(filename) {
        const isVideo = /\.(mp4|avi|mov|wmv|flv|mkv)$/.test(filename);

        if (isVideo) {
            return (
                <video width="320" height="240" controls>
                    <source src={`/uploads/${filename}`} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            );
        }

        return <img src={`/uploads/${filename}`} alt={filename} style={{ width: '500px', height: '500px' }} />;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black">
            <input type="file" accept="image/*, video/*" onChange={async (e) => {
                if (e.target.files == null) return;
                setUploading(true);
                const file = e.target.files[0];
                const formData = new FormData();
                formData.append('image', file);
                const res = await fetch(url + 'addmedia', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                console.log(data);
                setUploading(false);
            }} />
            {uploading && <p>Uploading...</p>}
            {!uploading && filenames.length === 0 && <p>No media uploaded yet.</p>}
            {!uploading && filenames.length > 0 && <p>Click on the X to delete a file.</p>}
            {!uploading && <p>Uploading complete</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filenames.filter(x => x != null).map((filename) => (
                    <div key={filename} className="relative group">
                        {renderMedia(filename)}
                        <div
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 cursor-pointer hidden group-hover:block"
                            onClick={() => handleDelete(filename)}
                        >
                            X
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}