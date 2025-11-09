import React, { useState, useEffect } from 'react';
import Toast from './Toast';

function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [offerings, setOfferings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [selectedOffering, setSelectedOffering] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [errors, setErrors] = useState({});

  // Load data from localStorage
  useEffect(() => {
    const storedRegistrations = localStorage.getItem('registrations');
    const storedOfferings = localStorage.getItem('offerings');
    const storedCourses = localStorage.getItem('courses');
    const storedTypes = localStorage.getItem('courseTypes');

    if (storedRegistrations) setRegistrations(JSON.parse(storedRegistrations));
    if (storedOfferings) setOfferings(JSON.parse(storedOfferings));
    if (storedCourses) setCourses(JSON.parse(storedCourses));
    if (storedTypes) setCourseTypes(JSON.parse(storedTypes));
  }, []);

  // Save registrations to localStorage
  useEffect(() => {
    localStorage.setItem('registrations', JSON.stringify(registrations));
  }, [registrations]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate registration form
  const validateRegistration = () => {
    const newErrors = {};

    if (!selectedOffering) {
      newErrors.offering = 'Please select a course offering';
    }

    if (!studentName.trim()) {
      newErrors.name = 'Student name is required';
    } else if (studentName.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!studentEmail.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(studentEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Check for duplicate registration
    if (selectedOffering && studentEmail.trim()) {
      const duplicate = registrations.find(
        (reg) =>
          reg.offeringId === selectedOffering &&
          reg.email.toLowerCase() === studentEmail.trim().toLowerCase()
      );
      if (duplicate) {
        newErrors.duplicate = 'This student is already registered for this offering';
      }
    }

    return newErrors;
  };

  // Register student
  const handleRegister = (e) => {
    e.preventDefault();
    const validationErrors = validateRegistration();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newRegistration = {
      id: Date.now().toString(),
      offeringId: selectedOffering,
      name: studentName.trim(),
      email: studentEmail.trim().toLowerCase(),
      registeredAt: new Date().toISOString(),
    };

    setRegistrations([...registrations, newRegistration]);
    setSelectedOffering('');
    setStudentName('');
    setStudentEmail('');
    setErrors({});
    showToast('Student registered successfully!', 'success');
  };

  // Unregister student
  const handleUnregister = (id) => {
    if (window.confirm('Are you sure you want to unregister this student?')) {
      setRegistrations(registrations.filter((reg) => reg.id !== id));
      showToast('Student unregistered successfully!', 'success');
    }
  };

  // Get offering details
  const getOfferingDetails = (offeringId) => {
    const offering = offerings.find((off) => off.id === offeringId);
    if (!offering) return 'Unknown Offering';

    const course = courses.find((c) => c.id === offering.courseId);
    const type = courseTypes.find((t) => t.id === offering.courseTypeId);

    return `${type?.name || 'Unknown'} - ${course?.name || 'Unknown'}`;
  };

  // Group registrations by offering
  const registrationsByOffering = offerings.map((offering) => {
    const offeringRegs = registrations.filter(
      (reg) => reg.offeringId === offering.id
    );
    return {
      offering,
      registrations: offeringRegs,
    };
  });

  return (
    <div className="max-w-6xl mx-auto">
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Register Student</h2>

        {offerings.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              Please create at least one course offering before registering students.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Course Offering *
              </label>
              <select
                value={selectedOffering}
                onChange={(e) => {
                  setSelectedOffering(e.target.value);
                  setErrors({});
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select Offering --</option>
                {offerings.map((offering) => (
                  <option key={offering.id} value={offering.id}>
                    {getOfferingDetails(offering.id)}
                  </option>
                ))}
              </select>
              {errors.offering && (
                <p className="text-red-500 text-sm mt-1">{errors.offering}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name *
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    setErrors({});
                  }}
                  placeholder="Enter student name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Email *
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => {
                    setStudentEmail(e.target.value);
                    setErrors({});
                  }}
                  placeholder="student@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {errors.duplicate && (
              <p className="text-red-500 text-sm">{errors.duplicate}</p>
            )}

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Register Student
            </button>
          </form>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          All Registrations ({registrations.length})
        </h2>

        {registrations.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No student registrations yet. Register your first student above!
          </p>
        ) : (
          <div className="space-y-6">
            {registrationsByOffering
              .filter((group) => group.registrations.length > 0)
              .map((group) => (
                <div key={group.offering.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
                    {getOfferingDetails(group.offering.id)} (
                    {group.registrations.length} student
                    {group.registrations.length !== 1 ? 's' : ''})
                  </h3>

                  <div className="space-y-2">
                    {group.registrations.map((reg) => (
                      <div
                        key={reg.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{reg.name}</p>
                          <p className="text-sm text-gray-600">{reg.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Registered: {new Date(reg.registeredAt).toLocaleDateString()} at{' '}
                            {new Date(reg.registeredAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleUnregister(reg.id)}
                          className="mt-3 sm:mt-0 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                          Unregister
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RegistrationsPage;
