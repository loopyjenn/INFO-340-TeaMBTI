import React, { useState, useEffect } from "react";

export function UploadImages(props) {
    const { setProfilePicture } = props;
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (!imageFile) return;

        const newImageURL = URL.createObjectURL(imageFile);
        setProfilePicture(newImageURL);
        
    }, [imageFile, setProfilePicture]);

    function onImageChange(event) {
        setImageFile(event.target.files[0]);
    }

    return (
        <div className="upload-images-container">
            <input type="file" accept="image/*" onChange={onImageChange} />
        </div>
    );
}