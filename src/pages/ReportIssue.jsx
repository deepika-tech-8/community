import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Upload, CheckCircle, Sparkles, Brain } from 'lucide-react';
import { categories } from '../data/issues';
import { analyzeIssue } from '../utils/aiAnalysis';
import { predictSeverity, predictCategory } from '../utils/mlModel';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

function LocationPicker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function ReportIssue({ addIssue }) {
  const [form, setForm] = useState({
    title: '', category: '', location: '', description: '', image: null,
  });
  const [coords, setCoords] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [mlLoading, setMlLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [mlResult, setMlResult] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState('');

  const handleAnalyze = async () => {
    if (!form.title) { alert('Enter a title first!'); return; }
    setAnalyzing(true);
    const result = await analyzeIssue(form.title, form.description);
    setAiResult(result);
    setForm(prev => ({ ...prev, category: result.category }));
    setAnalyzing(false);
  };

  const handleMLPredict = () => {
    if (!form.title) { alert('Enter a title first!'); return; }
    setMlLoading(true);
    const result = predictSeverity(form.title + ' ' + form.description);
    const category = predictCategory(form.title + ' ' + form.description);
    setMlResult({ ...result, category });
    if (!form.category) setForm(prev => ({ ...prev, category }));
    setMlLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.category || !form.location) {
      alert('Please fill Title, Category and Location!');
      return;
    }
    setLoading(true);

    let imageUrl = '';
    if (form.image) {
      try {
        setUploadProgress('Uploading image...');
        const imageRef = ref(storage, `issues/${Date.now()}_${form.image.name}`);
        await uploadBytes(imageRef, form.image);
        imageUrl = await getDownloadURL(imageRef);
        setUploadProgress('Image uploaded! ✅');
      } catch (err) {
        console.error('Image upload failed:', err);
      }
    }

    await addIssue({
      title: form.title,
      category: form.category,
      location: form.location,
      description: form.description,
      severity: aiResult?.severity || mlResult?.severity || 'medium',
      severityScore: aiResult?.severityScore || mlResult?.severityScore || 5,
      suggestedAction: aiResult?.suggestedAction || '',
      reporter: 'Anonymous',
      coords: coords || [13.0827, 80.2707],
      imageUrl,
    });

    setLoading(false);
    setSubmitted(true);
  };

  const severityColor = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 text-center shadow-lg max-w-md w-full">
          <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Issue Reported! 🎉</h2>
          <p className="text-gray-600 mb-6">Saved to Firebase with image and visible on live map!</p>
          {(aiResult || mlResult) && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm font-semibold text-gray-700 mb-2">Analysis Summary:</p>
              {aiResult && <p className="text-sm text-gray-600">🤖 Gemini: {aiResult.severity} ({aiResult.severityScore}/10)</p>}
              {mlResult && <p className="text-sm text-gray-600">🧠 ML: {mlResult.severity} ({mlResult.severityScore}/10)</p>}
            </div>
          )}
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({ title: '', category: '', location: '', description: '', image: null });
              setAiResult(null);
              setMlResult(null);
              setCoords(null);
              setImagePreview(null);
              setUploadProgress('');
            }}
            className="bg-green-600 text-white font-bold px-8 py-3 rounded-full hover:bg-green-700 transition"
          >
            Report Another Issue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Report an Issue 📝</h1>
        <p className="text-gray-600 mb-8">Dual AI Analysis + Image Upload + Map Location!</p>

        <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col gap-6">

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Issue Title *</label>
            <input
              type="text"
              placeholder="e.g. Large pothole on Main Street"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              placeholder="Describe the issue in detail..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            />
          </div>

          {/* Dual AI Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="flex items-center justify-center gap-2 bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-50 text-sm"
            >
              <Sparkles size={16} />
              {analyzing ? 'Analyzing...' : 'Gemini AI 🤖'}
            </button>
            <button
              onClick={handleMLPredict}
              disabled={mlLoading}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 text-sm"
            >
              <Brain size={16} />
              {mlLoading ? 'Predicting...' : 'ML Model 🧠'}
            </button>
          </div>

          {/* Results */}
          {(aiResult || mlResult) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aiResult && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-purple-700 mb-2">🤖 Gemini AI</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${severityColor[aiResult.severity]}`}>
                    {aiResult.severity} ({aiResult.severityScore}/10)
                  </span>
                  <p className="text-xs text-gray-600 mt-2">{aiResult.reason}</p>
                  <p className="text-xs text-gray-500 mt-1">💡 {aiResult.suggestedAction}</p>
                </div>
              )}
              {mlResult && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-blue-700 mb-2">🧠 ML Model</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${severityColor[mlResult.severity]}`}>
                    {mlResult.severity} ({mlResult.severityScore}/10)
                  </span>
                  <p className="text-xs text-gray-600 mt-2">Category: {mlResult.category}</p>
                </div>
              )}
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setForm({ ...form, category: cat.id })}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition font-medium text-sm ${
                    form.category === cat.id
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location Name *</label>
            <input
              type="text"
              placeholder="e.g. Anna Nagar, Chennai"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Map Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pin Location on Map 📍
              {coords && <span className="text-green-600 ml-2 text-xs">✅ Pinned!</span>}
            </label>
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <MapContainer center={[13.0827, 80.2707]} zoom={12} style={{ height: '250px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker onSelect={setCoords} />
                {coords && <Marker position={coords} />}
              </MapContainer>
            </div>
            <p className="text-xs text-gray-400 mt-1">Click on map to pin exact location</p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image 📸</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl py-6 cursor-pointer hover:border-green-400 transition">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-cover rounded-lg" />
              ) : (
                <>
                  <Upload className="text-gray-400 mb-2" size={32} />
                  <span className="text-gray-500 text-sm">Click to upload photo of the issue</span>
                  <span className="text-gray-400 text-xs mt-1">Saved to Firebase Storage</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
            {uploadProgress && <p className="text-sm text-green-600 mt-1">{uploadProgress}</p>}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? uploadProgress || 'Saving...' : 'Submit Issue 🚀'}
          </button>
        </div>
      </div>
    </div>
  );
}