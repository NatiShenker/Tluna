import React from 'react';
import { Typography, Grid, Divider } from '@mui/material';
import StatusChip from './StatusChip';
import styles from '../styles/ComplaintDetailsCard.module.css';

const ComplaintDetailsCard = ({ complaint }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Typography variant="h6">Status:</Typography>
        <StatusChip status={complaint.status} />
      </div>

      <Grid container spacing={3}>
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
    </div>
  );
};

export default ComplaintDetailsCard; 