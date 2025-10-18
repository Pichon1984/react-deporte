import React from 'react';

const ImagePreview = ({ imageUrl }) => (
  <div className="mt-3">
    <img src={imageUrl} alt="Preview" className="img-fluid rounded shadow" />
  </div>
);

export default ImagePreview;

