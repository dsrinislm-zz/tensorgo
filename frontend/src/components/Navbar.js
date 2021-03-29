import React, { useState, useRef } from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import { useNavigate } from 'react-router-dom-next';
import { withStyles } from '@material-ui/core/styles';
const options = [
  { name: 'Refresh Sync', path: '/sync-db' },
  { name: 'Sync New Users', path: '/sync-new-users' },
  { name: 'Download CSV', path: process.env.REACT_APP_WP_URL + '/gorest/download', target:'window' },
];
const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:hover': {
      backgroundColor: '#8bc34a!important',
    },
    '&.Mui-selected':{
      backgroundColor: '#f50057!important',
    },
    backgroundColor: '#8bc34a',
    whiteSpace: 'normal',
    textAlign: 'center',
    fontWeight: 'bold!important',
    fontSize: '14px',
    lineHeight: 1,
    minHeight:'2.5rem'
  },
}))(MenuItem);
const Navbar = (props) => {
  const navigate = useNavigate();
  const [selectedEl, setSelectedEl] = useState('');
  const mainRef = useRef(null);
  const goToPage = (event) => {
    const linkInfo = options.filter((obj) => {
      return (
        obj.name === event.target.attributes.data.value
      );
    });
    if(linkInfo[0].target && linkInfo[0].target ==='window'){
      mainRef.current.focus();
      window.open(linkInfo[0].path);
    }else{
      setSelectedEl(event.target.attributes.data.value);
      navigate(`/${linkInfo[0].path}`);
    }
  };

  return (
    <div ref={mainRef} tabIndex="-1">
        <MenuList style={{display:'flex' ,justifyContent: 'space-between', margin:'0.2em 0.8em 0.4em'}}>
          {options.map((option, index) => (
            <StyledMenuItem
              key={option.name}
              selected={option.name === selectedEl}
              data={option.name}
              onClick={goToPage}
              tabIndex={index+1}
            >
              {option.name}
            </StyledMenuItem>
          ))}
        </MenuList>
    </div>
  );
};
export default Navbar;
