import React from 'react'

function Sidebar() {

    const [selectedSection, setSelectedSection] = useState(null);

  const handleSectionClick = (section) => {
    setSelectedSection(section);
    // Scroll to the corresponding section on the page
    const element = document.getElementById(section.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top" id="sideNav">
      {/* Your other navbar elements */}
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className={`nav-link js-scroll-trigger ${selectedSection === 'About' ? 'active' : ''}`} href="#about">About</a>
          </li>
          {/* Add similar list items for other sections */}
        </ul>
      </div>
    </nav>
  )
}

export default Sidebar