import { useState } from 'react';
import { AppBar, Toolbar, Typography, Divider, Box } from '@mui/material';
import { UserMenu } from './UserMenu';
import { ReportIssue } from './ReportIssue';
import reportIssue from './assets/report-issue.svg';

interface userProps {
  title: string;
  signOut: () => void;
  menuComponent?: any;
}

export const Header = (props: userProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleReportIssueDialogOpen = () => {
    setIsOpen(true);
  };

  const handleReportIssueDialogClose = () => {
    setIsOpen(false);
  };
  return (
    <Box>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: '#FFFFFF', zIndex: '2000' }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { md: 'flex', alignItems: 'center' } }}
            ></Typography>
            <Divider orientation="vertical" flexItem />
            <Typography
              variant="h6"
              sx={{
                ml: 3,
                color: '#8141f2',
                display: 'flex',
                alignItems: 'center',
                fontSize: '18px',
              }}
            >
              {props.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <props.menuComponent />
            </Box>
          </Box>
          <Box
            component={'img'}
            src={reportIssue}
            alt="Report Issue"
            onClick={handleReportIssueDialogOpen}
            sx={{
              cursor: 'pointer',
              marginLeft: '20px',
            }}
          />
          <ReportIssue onClose={handleReportIssueDialogClose} isOpen={isOpen} />
          <Box sx={{ display: { xs: 'inline-flex', md: 'inline-flex' } }}>
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
