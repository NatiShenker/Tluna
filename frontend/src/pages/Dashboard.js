import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/complaints', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      SUBMITTED: 'primary',
      RETURNED_FOR_UPDATE: 'warning',
      PENDING_DECISION: 'info',
      CLOSED: 'success'
    };
    return colors[status] || 'default';
  };

  const handleViewComplaint = (id) => {
    navigate(`/complaints/${id}`);
  };

  const handleNewComplaint = () => {
    navigate('/complaints/new');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Complaints Dashboard</Typography>
        {user.role === 'TEACHER' && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNewComplaint}
          >
            New Complaint
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint._id}>
                <TableCell>
                  {new Date(complaint.incident.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {`${complaint.studentId.firstName} ${complaint.studentId.lastName}`}
                </TableCell>
                <TableCell>{complaint.teacherId.name}</TableCell>
                <TableCell>{complaint.incident.locationId.name}</TableCell>
                <TableCell>
                  <Chip
                    label={complaint.status}
                    color={getStatusColor(complaint.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewComplaint(complaint._id)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Dashboard; 