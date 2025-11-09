import React, { useState, useEffect } from 'react';
import Toast from './Toast';

function OfferingsPage() {
  const [offerings, setOfferings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filterType, setFilterType] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editCourse, setEditCourse] = useState('');
  const [editType, setEditType] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [errors, setErrors] = useState({});

  // Load data from localStorage
  useEffect(() => {
    const storedOfferings = localStorage.getItem('offerings');
    const storedCourses = localStorage.getItem('courses');
    const storedTypes = localStorage.getItem('courseTypes');

    if (storedOfferings) setOfferings(JSON.parse(storedOfferings));
    if (storedCourses) setCourses(JSON.parse(storedCourses));
    if (storedTypes) setCourseTypes(JSON.parse(storedTypes));
  }, []);

  // Save offerings to localStorage
  useEffect(() => {
    localStorage.setItem('offerings', JSON.stringify(offerings));
  }, [offerings]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Validate offering
  const validateOffering = (courseId, typeId, currentEditingId = null) => {
    if (!courseId) return 'Please select a course';
    if (!typeId) return 'Please select a course type';

    // Check for duplicate offering
    const duplicate = offerings.find(
      (off) =>
        off.courseId === courseId &&
        off.courseTypeId === typeId &&
        off.id !== currentEditingId
    );
    if (duplicate) return 'This offering already exists';

    return '';
  };

  // Create new offering
  const handleCreate = (e) => {
    e.preventDefault();
    const error = validateOffering(selectedCourse, selectedType);
    if (error) {
      setErrors({ create: error });
      return;
    }

    const newOffering = {
      id: Date.now().toString(),
      courseId: selectedCourse,
      courseTypeId: selectedType,
      createdAt: new Date().toISOString(),
    };

    setOfferings([...offerings, newOffering]);
    setSelectedCourse('');
    setSelectedType('');
    setErrors({});
    showToast('Course offering created successfully!', 'success');
  };

  // Update offering
  const handleUpdate = (id) => {
    const error = validateOffering(editCourse, editType, id);
    if (error) {
      setErrors({ [id]: error });
      return;
    }

    setOfferings(
      offerings.map((off) =>
        off.id === id
          ? { ...off, courseId: editCourse, courseTypeId: editType }
          : off
      )
    );
    setEditingId(null);
    setEditCourse('');
    setEditType('');
    setErrors({});
    showToast('Course offering updated successfully!', 'success');
  };

  // Delete offering
  const handleDelete = (id) => {
    // Check if offering has registrations
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const hasRegistrations = registrations.some((reg) => reg.offeringId === id);

    if (hasRegistrations) {
      showToast('Cannot delete: This offering has student registrations', 'error');
      return;
    }

    if (window.confirm('Are you sure you want to delete this offering?')) {
      setOfferings(offerings.filter((off) => off.id !== id));
      showToast('Course offering deleted successfully!', 'success');
    }
  };

  const startEditing = (offering) => {
    setEditingId(offering.id);
    setEditCourse(offering.courseId);
    setEditType(offering.courseTypeId);
    setErrors({});
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditCourse('');
    setEditType('');
    setErrors({});
  };

  // Get course name by ID
  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.name : 'Unknown';
  };

  // Get course type name by ID
  const getTypeName = (typeId) => {
    const type = courseTypes.find((t) => t.id === typeId);
    return type ? type.name : 'Unknown';
  };

  // Filter offerings
  const filteredOfferings = filterType
    ? offerings.filter((off) => off.courseTypeId === filterType)
    : offerings;

  return (
    <div className="max-w-4xl mx-auto">
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Course Offering</h2>
        
        {courses.length === 0 || courseTypes.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              Please create at least one course and one course type before creating an offering.
            </p>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value);
                    setErrors({});
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select Course --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Course Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setErrors({});
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select Type --</option>
                  {courseTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {errors.create && (
              <p className="text-red-500 text-sm">{errors.create}</p>
            )}

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Offering
            </button>
          </form>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            All Course Offerings ({filteredOfferings.length})
          </h2>

          {courseTypes.length > 0 && (
            <div className="w-full sm:w-auto">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                {courseTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {filteredOfferings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {filterType
              ? 'No offerings found for this filter.'
              : 'No course offerings yet. Create your first offering above!'}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredOfferings.map((offering) => (
              <div
                key={offering.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {editingId === offering.id ? (
                  <div className="flex-1 w-full space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <select
                        value={editCourse}
                        onChange={(e) => {
                          setEditCourse(e.target.value);
                          setErrors({});
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">-- Select Course --</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={editType}
                        onChange={(e) => {
                          setEditType(e.target.value);
                          setErrors({});
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">-- Select Type --</option>
                        {courseTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors[offering.id] && (
                      <p className="text-red-500 text-sm">{errors[offering.id]}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {getTypeName(offering.courseTypeId)} - {getCourseName(offering.courseId)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(offering.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 mt-3 sm:mt-0">
                  {editingId === offering.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(offering.id)}
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
                        onClick={() => startEditing(offering)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(offering.id)}
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

export default OfferingsPage;
