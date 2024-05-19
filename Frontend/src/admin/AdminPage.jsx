import React, { useState } from 'react';
// import './adminPage.css'; // Include CSS styles
import AdminsTableCrud from './AdminsTableCrud';
import UniDomainsTableCrud from './UniDomainsTableCrud';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTableCellsRowLock } from '@fortawesome/free-solid-svg-icons';


function AdminPage() {
  const [activeTab, setActiveTab] = useState('tab1'); // State to manage the active tab

  const handleTabClick = (e, tabName) => {
    e.preventDefault(); // Prevent page reload
    setActiveTab(tabName); // Set the active tab
  };

  return (

    <>



    <div>
      <style>

{`
      body {
        background-color: #f1f1f1;
    padding: 0;
    margin: 0;
    font-size: 14px;
    font-family: 'Open Sans', sans-serif;
  }
  
  .admin-panel {
    width: 100%; /* Set width to 100% */
        height: 100vh; /* Set height to 100% of viewport height */
        overflow: hidden;
        background-color: #f1f1f1; /* Set background color to match body */
  }
  
  .slidebar {
    width: 15%;
    float: left;
    background-color: #111;
    height: 100%; /* Adjust height to match .admin-panel */
  }
  
  .slidebar ul {
    padding: 0;
    margin: 0;
    height: 100%;
  }
  
  .slidebar li {
    list-style-type: none;
    padding: 20px;
    text-align: center;
  }
  
  .slidebar a {
    color: #bbb;
    text-decoration: none;
  }
  
  .slidebar li:hover,
  .slidebar li.active {
    background-color: #313131;
  }
  
  .slidebar i {
    color: #b3b3b3;
    font-size: 40px;
    text-align: center;
    margin-bottom: 8px;
  }
  
  .slidebar li:hover i,
  .slidebar li.active i {
    color: #17bce8;
  }
  
  .main {
    width: 85%;
    float: left;
    background-color: rgb(255, 255, 255);
    height: 100%; /* Adjust height to match .admin-panel */
  }
  
  .main h2 {
    margin: 1em 30px;
    color: #17bce8;
    font-size: 20px;
    font-weight: 600;
    border-bottom: 1px solid #bbb;
  }
  `}

      </style>
    </div>





    <div className="admin-panel">
      <div className="slidebar">
        <ul>
          <li
            className={activeTab === 'tab1' ? 'active' : ''}
            onClick={(e) => handleTabClick(e, 'tab1')}
          >
            <a href="">
              <i className=""></i>Admins
            </a>
          </li>




          <li
            className={activeTab === 'tab2' ? 'active' : ''}
            onClick={(e) => handleTabClick(e, 'tab2')}
          >
            <a href="">
              <i ></i>
              
              Users
            </a>
          </li>
          

          




          <li
            className={activeTab === 'tab3' ? 'active' : ''}
            onClick={(e) => handleTabClick(e, 'tab3')}
          >
            <a href="">
              <i className=""></i>University Domains
            </a>
          </li>





          <li
            className={activeTab === 'tab4' ? 'active' : ''}
            onClick={(e) => handleTabClick(e, 'tab4')}
          >
            <a href="">
              <i className=""></i>All Posts
            </a>
          </li>
{/* 

          <li
            className={activeTab === 'tab5' ? 'active' : ''}
            onClick={(e) => handleTabClick(e, 'tab5')}
          >
            <a href="">
              <i className="fa fa-file-video-o"></i>Blog / News
            </a>
          </li> */}
{/* 

          <li
            className={activeTab === 'tab6' ? 'active' : ''}
            onClick={(e) => handleTabClick(e, 'tab6')}
          >
            <a href="">
              <i className="fa fa-wrench"></i>Advanced
            </a>
          </li> */}



        </ul>
      </div>



      <div className="main">
        <div
          id="tab1"
          style={{ display: activeTab === 'tab1' ? 'block' : 'none' }}
        >
          <h2 className="header">Admin Table</h2>

          <AdminsTableCrud />
        </div>



        <div
          id="tab2"
          style={{ display: activeTab === 'tab2' ? 'block' : 'none' }}
        >
          <h2 className="header">Users</h2>

          

          
        </div>



        <div
          id="tab3"
          style={{ display: activeTab === 'tab3' ? 'block' : 'none' }}
        >
          <h2 className="header">UNI</h2>

          <UniDomainsTableCrud/>

        </div>


        <div
          id="tab4"
          style={{ display: activeTab === 'tab4' ? 'block' : 'none' }}
        >
          <h2 className="header">Portfoliiiio</h2>
        </div>



        <div
          id="tab5"
          style={{ display: activeTab === 'tab5' ? 'block' : 'none' }}
        >
          <h2 className="header">Blog / News</h2>
        </div>
        <div
          id="tab6"
          style={{ display: activeTab === 'tab6' ? 'block' : 'none' }}
        >
          <h2 className="header">Advanced</h2>
        </div>
      </div>
    </div>


    </>


  );
}

export default AdminPage;
