import React, { useState, useEffect } from 'react';
import Toast from './Toast';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [errors, setErrors] = useState({});

  // Load courses from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('courses');
    if (stored) {
      setCourses(JSON.parse(stored));
    }
  }, []);

  // Save courses to localStorage
  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Validate course name
  const validateName = (name) => {
    if (!name.trim()) {
      return 'Course name is required';
    }
    if (name.trim().length < 2) {
      return 'Course name must be at least 2 characters';
    }
    const duplicate = courses.find(
      (course) => course.name.toLowerCase() === name.trim().toLowerCase() && course.id !== editingId
    );
    if (duplicate) {
      return 'This course already exists';
    }
    return '';
  };

  // Create new course
  const handleCreate = (e) => {
    e.preventDefault();
    const error = validateName(newCourseName);
    if (error) {
      setErrors({ create: error });
      return;
    }

    const newCourse = {
      id: Date.now().toString(),
      name: newCourseName.trim(),
      createdAt: new Date().toISOString(),
    };

    setCourses([...courses, newCourse]);
    setNewCourseName('');
    setErrors({});
    showToast('Course created successfully!', 'success');
  };

  // Update existing course
  const handleUpdate = (id) => {
    const error = validateName(editingName);
    if (error) {
      setErrors({ [id]: error });
      return;
    }

    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, name: editingName.trim() } : course
      )
    );
    setEditingId(null);
    setEditingName('');
    setErrors({});
    showToast('Course updated successfully!', 'success');
  };

  // Delete course
  const handleDelete = (id) => {
    // Check if course is used in any offering
    const offerings = JSON.parse(localStorage.getItem('offerings') || '[]');
    const isUsed = offerings.some((offering) => offering.courseId === id);

    if (isUsed) {
      showToast('Cannot delete: This course is used in course offerings', 'error');
      return;
    }

    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter((course) => course.id !== id));
      showToast('Course deleted successfully!', 'success');
    }
  };

  const startEditing = (course) => {
    setEditingId(course.id);
    setEditingName(course.name);
    setErrors({});
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Course</h2>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newCourseName}
              onChange={(e) => {
                setNewCourseName(e.target.value);
                setErrors({});
              }}
              placeholder="Enter course name (e.g., Hindi, English, Urdu)"
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
            Add Course
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          All Courses ({courses.length})
        </h2>

        {courses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No courses yet. Create your first course above!
          </p>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {editingId === course.id ? (
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
                    {errors[course.id] && (
                      <p className="text-red-500 text-sm mt-1">{errors[course.id]}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(course.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 mt-3 sm:mt-0">
                  {editingId === course.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(course.id)}
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
                        onClick={() => startEditing(course)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
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

export default CoursesPage;
