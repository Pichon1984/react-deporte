import React, { useEffect } from 'react';

const CloudinaryUpload = ({ onUpload }) => {
  useEffect(() => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dqzffyx3w',
        uploadPreset: 'workify',
        sources: ['local', 'url', 'camera'],
        multiple: false
      },
      (error, result) => {
        if (!error && result.event === 'success') {
          onUpload(result.info.secure_url);
        }
      }
    );

    document.getElementById('upload_widget').addEventListener('click', () => widget.open(), false);
  }, [onUpload]);

  return <button id="upload_widget" className="btn btn-primary">Subir imagen</button>;
};

export default CloudinaryUpload;
