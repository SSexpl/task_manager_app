import React, { useState } from 'react';

const Dropdown = ({ value, handlefunction ,options }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleChange = (e) => {
    const { name } = e.target;
    console.log(name);
    handlefunction(name); setIsDropdownOpen(false);

  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded inline-flex items-center"
      >
        {value}
        <svg
          className="h-5 w-5 ml-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 0 1 1.414 0L10 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414z"
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1 z-10" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          {options.map((item,index) => (
          <button
          key={index}
        className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
         role="menuitem"
        name={item} 
         onClick={(e) => {
          handleChange(e);
          }}
       > 
    {item} {/* Assuming each item in options has a 'label' property */}
  </button>
))}
           
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
