import { Button } from 'react-bootstrap';

const ImagePreview = ({ imagenes = [], onRemove }) => {
  if (!imagenes.length) return null;

  return (
    <div className="d-flex flex-wrap gap-2 mt-2">
      {imagenes.map((img, i) => (
        <div key={i} style={{ position: 'relative' }}>
          <img
            src={img}
            alt={`preview-${i}`}
            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
          />
          {onRemove && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onRemove(i)}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                borderRadius: '50%',
                padding: '0 6px',
              }}
            >
              ×
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImagePreview;

