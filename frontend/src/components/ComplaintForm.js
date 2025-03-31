import React from 'react';
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import styles from '../styles/ComplaintForm.module.css';

const ComplaintForm = ({
  formData,
  students,
  locations,
  onChange,
  onSubmit,
  onCancel,
  submitLabel = 'Save as Draft'
}) => {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Student</InputLabel>
            <Select
              name="studentId"
              value={formData.studentId}
              onChange={onChange}
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
                onChange({
                  target: {
                    name: 'incident.date',
                    value: newValue
                  }
                });
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
              onChange={onChange}
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
            onChange={onChange}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <div className={styles.buttonGroup}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {submitLabel}
            </Button>
            <Button
              variant="outlined"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </Grid>
      </Grid>
    </form>
  );
};

export default ComplaintForm; 