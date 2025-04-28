

// EditEventForm.jsx - A new component based on AddEventForm for editing
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEventCategories } from '../services/eventForm.js';
import { submitEvent, fetchEventDetails, updateEvent  } from '../services/eventAPI.js';
import { jwtDecode } from 'jwt-decode'; 

const EditEventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the event ID from URL
  const [previewImage, setPreviewImage] = useState(null);
  const [eventCategories, setEventCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [adminRole, setAdminRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    eventCategory: '',
    eventName: '',
    participantCategory: 'men',
    image: null,
    rules: '',
    prizes: {
      men: [{ name: 'First Prize', amount: '' }],
      women: [{ name: 'First Prize', amount: '' }],
      'men & women': [],
      'no category': [{ name: 'First Prize', amount: '' }]
    },
    leadAuth: {
      id: '',
      password: '',
    },
    contactPersons: [
      { name: '', phone: '' },
      { name: '', phone: '' },
    ],
  });
  
  const [errors, setErrors] = useState({});
  const API_URL = import.meta.env?.VITE_API_URL || '';

  useEffect(() => {
    const loadEventData = async () => {
  setIsLoading(true);
  try {
    // Load event categories
    const categories = getEventCategories();
    setEventCategories(categories);
    
    // Fetch event details using the ID
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    const response = await fetch(`${API_URL}/api/events/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include' // Include credentials to send cookies
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch event details: ${response.status}`);
    }

    const eventData = await response.json();
    console.log("Event data loaded:", eventData); // Add this to debug
    
    // Set preview image if available
    if (eventData.imageUrl) {
      setPreviewImage(getImageUrl(eventData.imageUrl));
    }
    
    // Prepare the prizes structure based on participant category
    const prizes = {
      men: [{ name: 'First Prize', amount: '' }],
      women: [{ name: 'First Prize', amount: '' }],
      'men & women': [],
      'no category': [{ name: 'First Prize', amount: '' }]
    };
    
    // Parse prizes from event data
    if (eventData.prizes) {
      if (eventData.prizes.men) prizes.men = eventData.prizes.men;
      if (eventData.prizes.women) prizes.women = eventData.prizes.women;
      if (eventData.prizes['no category']) prizes['no category'] = eventData.prizes['no category'];
    }
    
    // Create form data from the event details
    setFormData({
      eventCategory: eventData.eventCategory || '',
      eventName: eventData.eventName || '',
      participantCategory: eventData.participantCategory || 'men',
      image: null, // We'll keep the existing image unless changed
      rules: eventData.rules || '',
      prizes: prizes,
      leadAuth: {
        id: eventData.leadAuth?.id || '',
        password: '',  // Don't pre-fill password for security
      },
      contactPersons: eventData.contactPersons && eventData.contactPersons.length > 0 
        ? eventData.contactPersons 
        : [{ name: '', phone: '' }, { name: '', phone: '' }],
    });
    
  } catch (error) {
    console.error('Error loading event data:', error);
    setSubmitError('Failed to load event details. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
    
    loadEventData();
  }, [id]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If it's already a full URL, use it as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Remove any leading slash and "uploads/" to avoid duplication
    const cleanedPath = imageUrl.replace(/^\/+/, '').replace(/^uploads\//, '');
    return `${API_URL}/uploads/${cleanedPath}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('leadAuth.')) {
      const authKey = name.split('.')[1];
      setFormData({
        ...formData,
        leadAuth: {
          ...formData.leadAuth,
          [authKey]: value,
        },
      });
    } else if (name.startsWith('contactPersons')) {
      const [_, index, field] = name.split('.');
      const updatedContacts = [...formData.contactPersons];
      updatedContacts[parseInt(index)][field] = value;
      
      setFormData({
        ...formData,
        contactPersons: updatedContacts,
      });
    } else if (name === 'participantCategory') {
      setFormData({
        ...formData,
        participantCategory: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handlePrizeChange = (category, index, field, value) => {
    const updatedPrizes = { ...formData.prizes };
    updatedPrizes[category][index][field] = value;
    
    setFormData({
      ...formData,
      prizes: updatedPrizes
    });
    
    // Clear errors
    if (errors[`prizes.${category}.${index}`]) {
      setErrors({
        ...errors,
        [`prizes.${category}.${index}`]: ''
      });
    }
  };

  const addPrize = (category) => {
    const updatedPrizes = { ...formData.prizes };
    updatedPrizes[category] = [
      ...updatedPrizes[category],
      { name: `Prize ${updatedPrizes[category].length + 1}`, amount: '' }
    ];
    
    setFormData({
      ...formData,
      prizes: updatedPrizes
    });
  };

  const removePrize = (category, index) => {
    const updatedPrizes = { ...formData.prizes };
    updatedPrizes[category] = updatedPrizes[category].filter((_, i) => i !== index);
    
    setFormData({
      ...formData,
      prizes: updatedPrizes
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        image: file,
      });
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      image: null,
    });
    setPreviewImage(null);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.eventCategory) {
      newErrors.eventCategory = 'Event category is required';
    }
    
    if (!formData.eventName.trim()) {
      newErrors.eventName = 'Event name is required';
    }
    
    if (!formData.rules.trim()) {
      newErrors.rules = 'Rules/description is required';
    }
    
    // Validate prizes based on participant category
    if (formData.participantCategory === 'men' || 
        formData.participantCategory === 'women' ||
        formData.participantCategory === 'no category') {
      const category = formData.participantCategory;
      if (formData.prizes[category].length === 0 || 
          !formData.prizes[category][0].amount.trim()) {
        newErrors[`prizes.${category}.0`] = 'At least one prize is required';
      }
    } else if (formData.participantCategory === 'men & women') {
      if (formData.prizes.men.length === 0 || 
          !formData.prizes.men[0].amount.trim()) {
        newErrors['prizes.men.0'] = 'At least one prize for men category is required';
      }
      if (formData.prizes.women.length === 0 || 
          !formData.prizes.women[0].amount.trim()) {
        newErrors['prizes.women.0'] = 'At least one prize for women category is required';
      }
    }
    
    if (!formData.leadAuth.id.trim()) {
      newErrors['leadAuth.id'] = 'Lead ID is required';
    }
    
    // Only validate password if it's been changed (for editing existing events)
    if (formData.leadAuth.password.trim() && formData.leadAuth.password.trim().length < 6) {
      newErrors['leadAuth.password'] = 'Password must be at least 6 characters';
    }
    
    if (!formData.contactPersons[0].name.trim() || !formData.contactPersons[0].phone.trim()) {
      newErrors['contactPersons.0'] = 'At least one contact person is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // In EditEventForm.jsx, update your handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (validateForm()) {
    try {
      setIsSubmitting(true);
      setSubmitError('');
      
      // Create a clean copy of form data for submission
      const submissionData = {
        ...formData,
        // Only include the relevant prizes based on participant category
        prizes: formData.participantCategory === 'men & women' 
          ? { men: formData.prizes.men, women: formData.prizes.women }
          : { [formData.participantCategory]: formData.prizes[formData.participantCategory] }
      };
      
      // Only include password in leadAuth if it was changed
      if (!formData.leadAuth.password.trim()) {
        submissionData.leadAuth = { id: formData.leadAuth.id };
      }
      
      // Call the API service to update the event
      const data = await updateEvent(id, submissionData);
      console.log('Event updated successfully:', data);
      
      // Navigate back to the event details page
      navigate(`/modify-events/${id}`);
      
    } catch (error) {
      console.error('Error updating event:', error);
      setSubmitError(error.message || 'Failed to update event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }
};

  // Render prize fields based on participant category
  const renderPrizeFields = () => {
    if (formData.participantCategory === 'men & women') {
      return (
        <>
          {/* Men's Category Prizes */}
          <div className="space-y-4">
            <h3 className="text-[#A3CFF0] font-medium">Cash Prizes for Men Category*</h3>
            {formData.prizes.men.map((prize, index) => (
              <div key={`men-${index}`} className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <label className="block text-[#b0b0b0] font-medium">
                    Prize Name
                  </label>
                  <input
                    type="text"
                    value={prize.name}
                    onChange={(e) => handlePrizeChange('men', index, 'name', e.target.value)}
                    className="w-full p-3 bg-[#1a1a1a] border border-[#363636] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#A3CFF0] transition-all duration-300"
                    placeholder="Enter prize name"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="block text-[#b0b0b0] font-medium">
                    Prize Amount
                  </label>
                  <input
                    type="text"
                    value={prize.amount}
                    onChange={(e) => handlePrizeChange('men', index, 'amount', e.target.value)}
                    className={`w-full p-3 bg-[#1a1a1a] border ${
                      errors[`prizes.men.${index}`] ? 'border-red-500' : 'border-[#363636]'
                    } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#A3CFF0] transition-all duration-300`}
                    placeholder="Enter prize amount"
                  />
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removePrize('men', index)}
                    className="mb-2 p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            {errors['prizes.men.0'] && (
              <p className="text-red-500 text-sm mt-1">{errors['prizes.men.0']}</p>
            )}
            <button
              type="button"
              onClick={() => addPrize('men')}
              className="flex items-center gap-2 text-[#A3CFF0] hover:text-[#8ab8e0] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Prize</span>
            </button>
          </div>

          {/* Women's Category Prizes */}
          <div className="space-y-4">
            <h3 className="text-[#A3CFF0] font-medium">Cash Prizes for Women Category*</h3>
            {formData.prizes.women.map((prize, index) => (
              <div key={`women-${index}`} className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <label className="block text-[#b0b0b0] font-medium">
                    Prize Name
                  </label>
                  <input
                    type="text"
                    value={prize.name}
                    onChange={(e) => handlePrizeChange('women', index, 'name', e.target.value)}
                    className="w-full p-3 bg-[#1a1a1a] border border-[#363636] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#A3CFF0] transition-all duration-300"
                    placeholder="Enter prize name"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="block text-[#b0b0b0] font-medium">
                    Prize Amount
                  </label>
                  <input
                    type="text"
                    value={prize.amount}
                    onChange={(e) => handlePrizeChange('women', index, 'amount', e.target.value)}
                    className={`w-full p-3 bg-[#1a1a1a] border ${
                      errors[`prizes.women.${index}`] ? 'border-red-500' : 'border-[#363636]'
                    } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#A3CFF0] transition-all duration-300`}
                    placeholder="Enter prize amount"
                  />
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removePrize('women', index)}
                    className="mb-2 p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            {errors['prizes.women.0'] && (
              <p className="text-red-500 text-sm mt-1">{errors['prizes.women.0']}</p>
            )}
            <button
              type="button"
              onClick={() => addPrize('women')}
              className="flex items-center gap-2 text-[#A3CFF0] hover:text-[#8ab8e0] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Prize</span>
            </button>
          </div>
        </>
      );
    } else {
      // Single category (men, women, or no category)
      const category = formData.participantCategory;
      return (
        <div className="space-y-4">
          <h3 className="text-[#A3CFF0] font-medium">
            {category === 'no category' ? 'Cash Prizes*' : 'Cash Prizes*'}
          </h3>
          {formData.prizes[category].map((prize, index) => (
            <div key={index} className="flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <label className="block text-[#b0b0b0] font-medium">
                  Prize Name
                </label>
                <input
                  type="text"
                  value={prize.name}
                  onChange={(e) => handlePrizeChange(category, index, 'name', e.target.value)}
                  className="w-full p-3 bg-[#1a1a1a] border border-[#363636] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#A3CFF0] transition-all duration-300"
                  placeholder="Enter prize name"
                />
              </div>
              <div className="flex-1 space-y-2">
                <label className="block text-[#b0b0b0] font-medium">
                  Prize Amount
                </label>
                <input
                  type="text"
                  value={prize.amount}
                  onChange={(e) => handlePrizeChange(category, index, 'amount', e.target.value)}
                  className={`w-full p-3 bg-[#1a1a1a] border ${
                    errors[`prizes.${category}.${index}`] ? 'border-red-500' : 'border-[#363636]'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#A3CFF0] transition-all duration-300`}
                  placeholder="Enter prize amount"
                />
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removePrize(category, index)}
                  className="mb-2 p-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          {errors[`prizes.${category}.0`] && (
            <p className="text-red-500 text-sm mt-1">{errors[`prizes.${category}.0`]}</p>
          )}
          <button
            type="button"
            onClick={() => addPrize(category)}
            className="flex items-center gap-2 text-[#A3CFF0] hover:text-[#8ab8e0] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Prize</span>
          </button>
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-[#A3CFF0] text-2xl">Loading event details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-[#262626] rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 bg-[#1e1e1e] flex items-center gap-4 border-b border-[#363636]">
          <button 
            onClick={() => navigate(`/modify-events/${id}`)}
            className="p-2 rounded-full hover:bg-[#363636] transition-colors duration-300"
          >
            <ArrowLeft className="w-6 h-6 text-[#A3CFF0]" />
          </button>
          <h1 className="text-2xl font-bold text-[#A3CFF0]">Edit Event</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Category */}
            <div className="space-y-2">
              <label htmlFor="eventCategory" className="block text-[#A3CFF0] font-medium">
                Event Category*
              </label>
              <select
                id="eventCategory"
                name="eventCategory"
                value={formData.eventCategory}
                onChange={handleChange}
                className={`w-full p-3 bg-[#1a1a1a] border ${
                  errors.eventCategory ? 'border-red-500' : 'border-[#363636]'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#A3CFF0] transition-all duration-300`}
              >
                <option value="">Select Category</option>
                {eventCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.eventCategory && (
                <p className="text-red-500 text-sm mt-1">{errors.eventCategory}</p>
              )}
            </div>
            
            {/* Event Name */}
            <div className="space-y-2">
              <label htmlFor="eventName" className="block text-[#A3CFF0] font-medium">
                Event Name*
              </label>
              <input
                type="text"
                id="eventName"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                className={`w-full p-3 bg-[#1a1a1a] border ${
                  errors.eventName ? 'border-red-500' : 'border-[#363636]'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#A3CFF0] transition-all duration-300`}
                placeholder="Enter event name"
              />
              {errors.eventName && (
                <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>
              )}
            </div>
          </div>
          
          {/* Participant Category */}
          <div className="space-y-3">
            <label className="block text-[#A3CFF0] font-medium">
              Participant Category*
            </label>
            <div className="flex flex-wrap gap-6">
              {['men', 'women', 'men & women', 'no category'].map((category) => (
                <label key={category} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="participantCategory"
                    value={category}
                    checked={formData.participantCategory === category}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.participantCategory === category
                      ? 'border-[#A3CFF0] bg-[#A3CFF0]/20'
                      : 'border-[#5a5a5a] group-hover:border-[#A3CFF0]/50'
                  } transition-all duration-300`}>
                    {formData.participantCategory === category && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#A3CFF0]" />
                    )}
                  </div>
                  <span className={`text-lg ${
                    formData.participantCategory === category
                      ? 'text-[#A3CFF0]'
                      : 'text-[#b0b0b0] group-hover:text-white'
                  } transition-colors duration-300 capitalize`}>
                    {category === 'men&women' ? 'Men & Women' : 
                    category === 'no category' ? 'No Category' : category}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Image Upload */}
          <div className="space-y-3">
            <label className="block text-[#A3CFF0] font-medium">
              Event Image
            </label>
            
            {!previewImage ? (
              <div className="border-2 border-dashed border-[#363636] rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center gap-3 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#A3CFF0]/10 flex items-center justify-center group-hover:bg-[#A3CFF0]/20 transition-all duration-300">
                    <Upload className="w-6 h-6 text-[#A3CFF0]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-medium">Click to upload an image</p>
                    <p className="text-[#9a9a9a] text-sm">SVG, PNG, JPG or GIF (max. 2MB)</p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden group">
                <img
                  src={previewImage}
                  alt="Event preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>
          
          {/* Rules/Description */}
          <div className="space-y-2">
            <label htmlFor="rules" className="block text-[#A3CFF0] font-medium">
              Rules/Description*
            </label>
            <textarea
              id="rules"
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              rows={4}
              className={`w-full p-3 bg-[#1a1a1a] border ${
                errors.rules ? 'border-red-500' : 'border-[#363636]'
              } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#A3CFF0] transition-all duration-300`}
              placeholder="Enter event rules and description"
            />
            {errors.rules && (
              <p className="text-red-500 text-sm mt-1">{errors.rules}</p>
            )}
          </div>
          
          {/* Prizes - Dynamically rendered based on participant category */}
          {renderPrizeFields()}
          
          {/* Lead Authentication */}
          <div className="space-y-4">
            <h3 className="text-[#A3CFF0] font-medium">Lead Authentication*</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="leadAuth.id" className="block text-[#b0b0b0] font-medium">
                  Lead ID*
                </label>
                <input
                  type="text"
                  id="leadAuth.id"
                  name="leadAuth.id"
                  value={formData.leadAuth.id}
                  onChange={handleChange}
                  className={`w-full p-3 bg-[#1a1a1a] border ${
                    errors['leadAuth.id'] ? 'border-red-500' : 'border-[#363636]'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#A3CFF0] transition-all duration-300`}
                  placeholder="Enter lead ID"
                />
                {errors['leadAuth.id'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['leadAuth.id']}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="leadAuth.password" className="block text-[#b0b0b0] font-medium">
                  Password*
                </label>
                <input
                  type="password"
                  id="leadAuth.password"
                  name="leadAuth.password"
                  value={formData.leadAuth.password}
                  onChange={handleChange}
                  className={`w-full p-3 bg-[#1a1a1a] border ${
                    errors['leadAuth.password'] ? 'border-red-500' : 'border-[#363636]'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#A3CFF0] transition-all duration-300`}
                  placeholder="Enter password"
                />
                {errors['leadAuth.password'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['leadAuth.password']}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Contact Persons */}
          <div className="space-y-4">
            <h3 className="text-[#A3CFF0] font-medium">Contact Persons*</h3>
            {formData.contactPersons.map((_, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor={`contactPersons.${index}.name`}
                    className="block text-[#b0b0b0] font-medium"
                  >
                    Name {index === 0 && '*'}
                  </label>
                  <input
                    type="text"
                    id={`contactPersons.${index}.name`}
                    name={`contactPersons.${index}.name`}
                    value={formData.contactPersons[index].name}
                    onChange={handleChange}
                    className={`w-full p-3 bg-[#1a1a1a] border ${
                      errors[`contactPersons.${index}`] ? 'border-red-500' : 'border-[#363636]'
                    } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#A3CFF0] transition-all duration-300`}
                    placeholder="Enter contact name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label
                    htmlFor={`contactPersons.${index}.phone`}
                    className="block text-[#b0b0b0] font-medium"
                  >
                    Phone {index === 0 && '*'}
                  </label>
                  <input
                    type="tel"
                    id={`contactPersons.${index}.phone`}
                    name={`contactPersons.${index}.phone`}
                    value={formData.contactPersons[index].phone}
                    onChange={handleChange}
                    className={`w-full p-3 bg-[#1a1a1a] border ${
                      errors[`contactPersons.${index}`] ? 'border-red-500' : 'border-[#363636]'
                    } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#A3CFF0] transition-all duration-300`}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            ))}
            {errors['contactPersons.0'] && (
              <p className="text-red-500 text-sm mt-1">{errors['contactPersons.0']}</p>
            )}
          </div>

          {submitError && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500">
              {submitError}
            </div>
          )}
          
          {/* Submit Button */}
          <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${
              isSubmitting ? 'bg-[#8ab8e0] cursor-not-allowed' : 'bg-[#A3CFF0] hover:bg-[#8ab8e0]'
            } text-[#1a1a1a] py-4 rounded-xl font-bold text-lg transition-colors duration-300`}
          >
            {isSubmitting ? 'Updating Event...' : 'Update Event'}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventForm;