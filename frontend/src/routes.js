import React from 'react';
import { useRoutes } from 'react-router-dom-next';
import Users from './components/Users';
import EditUser from './components/EditUser';
import ApiSync from './components/ApiSync';
import Layout from './components/Layout';
const RouterOutput = (props) =>
  useRoutes([
    {
      path: '/',
      element: <Layout {...props} />,
      children: [
        {
          path: '/', 
          element: <Users />,
          children: [
            { path: '/sync-db', element: <ApiSync /> },
            { path: '/sync-new-users', element: <ApiSync /> },
          ] 
        },
      ],
    },
    {
      path: '/user/', 
      element: <Layout {...props} navbar={false} />,
      children: [
        {
          path: '/edit/:id', 
          element: <EditUser />
        },
      ],
    },
  ]);
export default RouterOutput;
