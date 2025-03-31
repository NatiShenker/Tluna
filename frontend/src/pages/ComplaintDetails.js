import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeciding, setIsDeciding] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [decision, setDecision] = useState({ punishment: '', notes: '' });
  const [returnNotes, setReturnNotes] = useState('');

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaint(response.data);
    } catch (error) {
      setError('Error fetching complaint details');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/complaints/${id}`, complaint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      fetchComplaint();
    } catch (error) {
      setError('Error updating complaint');
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/complaints/${id}/submit`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchComplaint();
    } catch (error) {
      setError('Error submitting complaint');
    }
  };

  const handleDecide = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/complaints/${id}/decide`, decision, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsDeciding(false);
      fetchComplaint();
    } catch (error) {
      setError('Error making decision');
    }
  };

  const handleReturn = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/complaints/${id}/return`, { notes: returnNotes }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsReturning(false);
      fetchComplaint();
    } catch (error) {
      setError('Error returning complaint');
    }
  };

  if (!complaint) {
    return <Typography>Loading...</Typography>;
  }

  const canEdit = user.role === 'TEACHER' && 
    complaint.teacherId._id === user._id && 
    ['DRAFT', 'RETURNED_FOR_UPDATE'].includes(complaint.status);

  const canDecide = user.role === 'PRINCIPAL' && 
    complaint.status === 'SUBMITTED';

  const canReturn = user.role === 'PRINCIPAL' && 
    complaint.status === 'SUBMITTED';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Complaint Details</Typography>
        <Box>
          {canEdit && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsEditing(true)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
          )}
          {canEdit && complaint.status === 'DRAFT' && (
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              sx={{ mr: 1 }}
            >
              Submit
            </Button>
          )}
          {canDecide && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsDeciding(true)}
              sx={{ mr: 1 }}
            >
              Make Decision
            </Button>
          )}
          {canReturn && (
            <Button
              variant="contained"
              color="warning"
              onClick={() => setIsReturning(true)}
            >
              Return for Update
            </Button>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ mr: 2 }}>Status:</Typography>
              <Chip
                label={complaint.status}
                color={
                  complaint.status === 'CLOSED' ? 'success' :
                  complaint.status === 'DRAFT' ? 'default' :
                  complaint.status === 'SUBMITTED' ? 'primary' :
                  'warning'
                }
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Student</Typography>
            <Typography>
              {`${complaint.studentId.firstName} ${complaint.studentId.lastName}`}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Teacher</Typography>
            <Typography>{complaint.teacherId.name}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Date</Typography>
            <Typography>
              {new Date(complaint.incident.date).toLocaleDateString()}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Location</Typography>
            <Typography>{complaint.incident.locationId.name}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Description</Typography>
            <Typography>{complaint.incident.description}</Typography>
          </Grid>

          {complaint.decision && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Decision</Typography>
                <Typography variant="subtitle1" gutterBottom>Punishment:</Typography>
                <Typography>{complaint.decision.punishment}</Typography>
                {complaint.decision.notes && (
                  <>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Notes:</Typography>
                    <Typography>{complaint.decision.notes}</Typography>
                  </>
                )}
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onClose={() => setIsEditing(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Complaint</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={complaint.incident.description}
                onChange={(e) => setComplaint({
                  ...complaint,
                  incident: {
                    ...complaint.incident,
                    description: e.target.value
                  }
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Decision Dialog */}
      <Dialog open={isDeciding} onClose={() => setIsDeciding(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Make Decision</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Punishment"
                value={decision.punishment}
                onChange={(e) => setDecision({ ...decision, punishment: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={decision.notes}
                onChange={(e) => setDecision({ ...decision, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeciding(false)}>Cancel</Button>
          <Button onClick={handleDecide} variant="contained">Submit Decision</Button>
        </DialogActions>
      </Dialog>

      {/* Return Dialog */}
      <Dialog open={isReturning} onClose={() => setIsReturning(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Return for Update</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsReturning(false)}>Cancel</Button>
          <Button onClick={handleReturn} variant="contained">Return</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComplaintDetails; 