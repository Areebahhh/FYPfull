import React from 'react'

function Popup() {

    const handleButtonClick = (section) => {
        // Pass the selected section to the parent component
        handleSectionClick(section);
      };
    

  return (
    <div>
    <button onClick={() => handleButtonClick('Experience')}>Experience</button>
    <button onClick={() => handleButtonClick('Education')}>Education</button>
    <button onClick={() => handleButtonClick('Skills')}>Skills</button>
    <button onClick={() => handleButtonClick('Interests')}>Interests</button>
  </div>
  )
}

export default Popup