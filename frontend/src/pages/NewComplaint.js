import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const NewComplaint = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    incident: {
      date: new Date(),
      locationId: '',
      description: '',
      involvedPeople: []
    }
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchLocations();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/locations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/complaints', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating complaint');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        New Complaint
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Student</InputLabel>
                <Select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                >
                  {students.map((student) => (
                    <MenuItem key={student._id} value={student._id}>
                      {`${student.firstName} ${student.lastName}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Incident Date"
                  value={formData.incident.date}
                  onChange={(newValue) => {
                    setFormData(prev => ({
                      ...prev,
                      incident: {
                        ...prev.incident,
                        date: newValue
                      }
                    }));
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  name="incident.locationId"
                  value={formData.incident.locationId}
                  onChange={handleChange}
                  required
                >
                  {locations.map((location) => (
                    <MenuItem key={location._id} value={location._id}>
                      {location.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="incident.description"
                value={formData.incident.description}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Save as Draft
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default NewComplaint; 