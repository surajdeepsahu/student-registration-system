import React, { useState, useEffect } from 'react';
import Toast from './Toast';

function CourseTypesPage() {
  const [courseTypes, setCourseTypes] = useState([]);
  const [newTypeName, setNewTypeName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [errors, setErrors] = useState({});

  // Load course types from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem('courseTypes');
    if (stored) {
      setCourseTypes(JSON.parse(stored));
    }
  }, []);

  // Save course types to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('courseTypes', JSON.stringify(courseTypes));
  }, [courseTypes]);

  // Show toast message helper function
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Validate course type name
  const validateName = (name) => {
    if (!name.trim()) {
      return 'Course type name is required';
    }
    if (name.trim().length < 2) {
      return 'Course type name must be at least 2 characters';
    }
    const duplicate = courseTypes.find(
      (type) => type.name.toLowerCase() === name.trim().toLowerCase() && type.id !== editingId
    );
    if (duplicate) {
      return 'This course type already exists';
    }
    return '';
  };

  // Handle creating a new course type
  const handleCreate = (e) => {
    e.preventDefault();
    const error = validateName(newTypeName);
    if (error) {
      setErrors({ create: error });
      return;
    }

    const newType = {
      id: Date.now().toString(),
      name: newTypeName.trim(),
      createdAt: new Date().toISOString(),
    };

    setCourseTypes([...courseTypes, newType]);
    setNewTypeName('');
    setErrors({});
    showToast('Course type created successfully!', 'success');
  };

  // Handle updating an existing course type
  const handleUpdate = (id) => {
    const error = validateName(editingName);
    if (error) {
      setErrors({ [id]: error });
      return;
    }

    setCourseTypes(
      courseTypes.map((type) =>
        type.id === id ? { ...type, name: editingName.trim() } : type
      )
    );
    setEditingId(null);
    setEditingName('');
    setErrors({});
    showToast('Course type updated successfully!', 'success');
  };

  // Handle deleting a course type
  const handleDelete = (id) => {
    // Check if course type is used in any offering
    const offerings = JSON.parse(localStorage.getItem('offerings') || '[]');
    const isUsed = offerings.some((offering) => offering.courseTypeId === id);

    if (isUsed) {
      showToast('Cannot delete: This course type is used in course offerings', 'error');
      return;
    }

    if (window.confirm('Are you sure you want to delete this course type?')) {
      setCourseTypes(courseTypes.filter((type) => type.id !== id));
      showToast('Course type deleted successfully!', 'success');
    }
  };

  // Start editing a course type
  const startEditing = (type) => {
    setEditingId(type.id);
    setEditingName(type.name);
    setErrors({});
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Course Type</h2>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newTypeName}
              onChange={(e) => {
                setNewTypeName(e.target.value);
                setErrors({});
              }}
              placeholder="Enter course type name (e.g., Individual, Group)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.create && (
              <p className="text-red-500 text-sm mt-1">{errors.create}</p>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Add Type
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          All Course Types ({courseTypes.length})
        </h2>

        {courseTypes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No course types yet. Create your first course type above!
          </p>
        ) : (
          <div className="space-y-3">
            {courseTypes.map((type) => (
              <div
                key={type.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {editingId === type.id ? (
                  <div className="flex-1 w-full sm:w-auto">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => {
                        setEditingName(e.target.value);
                        setErrors({});
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                    {errors[type.id] && (
                      <p className="text-red-500 text-sm mt-1">{errors[type.id]}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{type.name}</h3>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(type.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 mt-3 sm:mt-0">
                  {editingId === type.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(type.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(type)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(type.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseTypesPage;
