import React, { useState, useEffect } from 'react';
import './App.css';
import CourseTypesPage from './components/CourseTypesPage';
import CoursesPage from './components/CoursesPage';
import OfferingsPage from './components/OfferingsPage';
import RegistrationsPage from './components/RegistrationsPage';

function App() {
  // State for active navigation tab
  const [activeTab, setActiveTab] = useState('courseTypes');

  // Initialize localStorage with empty arrays if not exists
  useEffect(() => {
    if (!localStorage.getItem('courseTypes')) {
      localStorage.setItem('courseTypes', JSON.stringify([]));
    }
    if (!localStorage.getItem('courses')) {
      localStorage.setItem('courses', JSON.stringify([]));
    }
    if (!localStorage.getItem('offerings')) {
      localStorage.setItem('offerings', JSON.stringify([]));
    }
    if (!localStorage.getItem('registrations')) {
      localStorage.setItem('registrations', JSON.stringify([]));
    }
  }, []);

  // Function to render the active page component
  const renderPage = () => {
    switch (activeTab) {
      case 'courseTypes':
        return <CourseTypesPage />;
      case 'courses':
        return <CoursesPage />;
      case 'offerings':
        return <OfferingsPage />;
      case 'registrations':
        return <RegistrationsPage />;
      default:
        return <CourseTypesPage />;
    }
  };

  // Function to clear all data from localStorage
  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      localStorage.clear();
      localStorage.setItem('courseTypes', JSON.stringify([]));
      localStorage.setItem('courses', JSON.stringify([]));
      localStorage.setItem('offerings', JSON.stringify([]));
      localStorage.setItem('registrations', JSON.stringify([]));
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Student Registration System</h1>
          <p className="text-blue-100 mt-2">Manage courses, offerings, and student registrations</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 py-4">
            <button
              onClick={() => setActiveTab('courseTypes')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'courseTypes'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Course Types
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'courses'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => setActiveTab('offerings')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'offerings'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Offerings
            </button>
            <button
              onClick={() => setActiveTab('registrations')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'registrations'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Registrations
            </button>
            <button
              onClick={handleClearAllData}
              className="ml-auto px-6 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p>&copy; 2025 Student Registration System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
