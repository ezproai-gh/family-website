import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { photosApi } from '../api';
import { Photo } from '../types';
import '../styles/Gallery.css';

export function Gallery() {
  const { user, token } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    imageUrl: '',
  });

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const result = await photosApi.getAll();
      if (result.success && result.data) {
        setPhotos(result.data as Photo[]);
      }
    } catch (err) {
      setError('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setError('');
      const result = await photosApi.create(formData, token);
      if (result.success) {
        setFormData({ title: '', caption: '', imageUrl: '' });
        setShowUploadForm(false);
        await loadPhotos();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photo');
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const result = await photosApi.delete(photoId, token);
      if (result.success) {
        await loadPhotos();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete photo');
    }
  };

  if (loading) return <div className="gallery-container"><p>Loading gallery...</p></div>;

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1>Family Photo Gallery</h1>
        {user && (
          <button onClick={() => setShowUploadForm(!showUploadForm)} className="btn btn-primary">
            + Upload Photo
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showUploadForm && user && (
        <div className="upload-form-container">
          <form className="upload-form" onSubmit={handleUploadPhoto}>
            <div className="form-group">
              <label>Photo Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Summer Picnic 2024"
                required
              />
            </div>

            <div className="form-group">
              <label>Caption</label>
              <textarea
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="Add a caption or story about this photo"
              />
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                required
              />
            </div>

            {formData.imageUrl && (
              <div className="preview">
                <img src={formData.imageUrl} alt="Preview" />
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Upload Photo
              </button>
              <button type="button" onClick={() => setShowUploadForm(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="gallery-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-item" onClick={() => setSelectedPhoto(photo)}>
            <img src={photo.imageUrl} alt={photo.title} />
            <div className="photo-overlay">
              <h3>{photo.title}</h3>
              <p>{photo.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div className="modal" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPhoto(null)}>
              ✕
            </button>
            <img src={selectedPhoto.imageUrl} alt={selectedPhoto.title} />
            <div className="modal-info">
              <h2>{selectedPhoto.title}</h2>
              <p>{selectedPhoto.caption}</p>
              <small>
                Uploaded {new Date(selectedPhoto.createdAt).toLocaleDateString()}
              </small>
              {user && user.role === 'admin' && (
                <button
                  onClick={() => {
                    handleDeletePhoto(selectedPhoto.id);
                    setSelectedPhoto(null);
                  }}
                  className="btn btn-danger"
                >
                  Delete Photo
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
