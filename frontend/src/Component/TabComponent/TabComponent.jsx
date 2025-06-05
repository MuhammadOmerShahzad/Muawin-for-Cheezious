import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Paper, Tabs, Tab, Typography } from '@mui/material';
import TodoList from '../TodoList/TodoList';

const TabsComponent = ({ latestAnnouncement, userId, userZone, userBranch, userEmail, refreshTrigger }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [majorAnnouncements, setMajorAnnouncements] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchMajorAnnouncements = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Authentication token not found.');
          return;
        }

        const response = await axios.get(`${apiBaseUrl}/announcements/latest`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data) {
          setMajorAnnouncements([response.data]);
        } else {
          setMajorAnnouncements([]);
        }
      } catch (error) {
        console.error('Error fetching major announcements:', error);
        setMajorAnnouncements([]);
      }
    };

    const fetchAssignedTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Authentication token not found.');
          return;
        }

        const response = await axios.get(`${apiBaseUrl}/assigned-tasks`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            userId,
            zone: userZone,
            branch: userBranch
          }
        });
        setAssignedTasks(response.data);
      } catch (error) {
        console.error('Error fetching assigned tasks:', error);
        setAssignedTasks([]);
      }
    };

    fetchMajorAnnouncements();
    fetchAssignedTasks();
  }, [apiBaseUrl, userId, userZone, userBranch, refreshTrigger]);

  useEffect(() => {
    console.log("TabsComponent parameters:", { userId, userZone, userBranch, userEmail });
  }, [userId, userZone, userBranch, userEmail]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Paper
      square
      sx={{
        backgroundColor: 'background.default',
        borderRadius: 2,
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        width: 400,
        maxWidth: '100%',
        margin: 'auto',
      }}
    >
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        textColor="inherit"
        variant="fullWidth"
        TabIndicatorProps={{
          style: {
            backgroundColor: '#f15a22',
          },
        }}
      >
        <Tab label="Major Announcements" sx={{ color: activeTab === 0 ? '#f15a22' : 'inherit' }} />
        <Tab label="Assigned Tasks" sx={{ color: activeTab === 1 ? '#f15a22' : 'inherit' }} />
      </Tabs>

      <Box
        sx={{
          p: 2,
          pt: 1,
          height: '220px', // Reduced height from 300px to 200px
          overflowY: 'auto',
          // Custom scrollbar styling
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#666',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#444',
          },
        }}
      >
        {activeTab === 0 && (
          <Box
            sx={{
              p: 2,
              textAlign: 'left',
              backgroundColor: 'background.paper',
              borderRadius: 1,
              height: '100%',
              width: '100%',
              position: 'relative',
              // Custom scrollbar styling
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#666',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#444',
              },
            }}
          >
            {majorAnnouncements && majorAnnouncements.length > 0 && majorAnnouncements[0] ? (
              <>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Subject: {majorAnnouncements[0].announcement}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {majorAnnouncements[0].announcementDetails}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)' }}
                >
                  Date Posted: {new Date(majorAnnouncements[0].createdAt).toLocaleDateString()}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)' }}
                >
                  Posted by: Admin
                </Typography>
              </>
            ) : (
              <Typography variant="h6">No Announcements</Typography>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <TodoList
            userId={userId}
            userZone={userZone}
            userBranch={userBranch}
            userEmail={userEmail}
          />
        )}
      </Box>
    </Paper>
  );
};

export default TabsComponent;