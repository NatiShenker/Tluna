import React from 'react';
import { Chip } from '@mui/material';
import styles from '../styles/StatusChip.module.css';

const StatusChip = ({ status }) => {
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

  return (
    <Chip
      label={status}
      color={getStatusColor(status)}
      size="small"
      className={styles.chip}
    />
  );
};

export default StatusChip; 