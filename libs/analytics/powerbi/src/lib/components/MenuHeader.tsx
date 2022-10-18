/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Typography, Box, Menu, MenuItem } from '@mui/material';
import { useState, useEffect, SetStateAction, useContext } from 'react';
import { useAppInsightHook } from '@cloudcore/common-lib';
import { reportsActions, analyticsStore } from '@cloudcore/redux-store';
import betaIcon from '../assets/betaIcon.png';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';

interface userProps {
  userEmail: string;
  userName: string;
  initials: string;
}
export const HeaderMenuPowerBI = (props: userProps) => {
  const { useAppSelector, useAppDispatch } = analyticsStore;
  const config: IConfig = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const { names, email } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );
  const dispatch = useAppDispatch();
  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null);
  const [index, setIndex] = useState<null | number>(null);
  const openReports = Boolean(anchorEl1);

  const { HandleUserEvent } = useAppInsightHook();
  const { selectReport } = reportsActions;

  const handleReportClick = (reportId: string) => {
    dispatch(selectReport(reportId));
    HandleUserEvent(
      {
        name: props.userName,
        email: props.userEmail,
      },
      reportId,
      'SelectReportId'
    );
    setAnchorEl1(null);
    setIndex(null);
  };

  const { reports } = useAppSelector((state) => state.report);

  useEffect(() => {
    openSlaDashboard();
  }, [reports]);

  const openSlaDashboard = () => {
    reports?.map((item: { reports: any[] }, index: any) => {
      item.reports.map((sub: { reportName: string; reportId: any }, i: any) => {
        if (sub.reportName === 'SLA Dashboard') {
          dispatch(selectReport(sub.reportId));
          HandleUserEvent(
            {
              name: names ? names[0] : 'unknownUser',
              email: email ? email : 'unknownEmail',
            },
            sub.reportId,
            'SelectReportId'
          );
        }
      });
    });
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          component={'img'}
          src={betaIcon}
          alt="Beta version"
          sx={{
            background: '#6513f0',
            border: '1px solid #8141f2',
            padding: '5px',
            borderRadius: '5px',
            marginLeft: '13px',
            height: 'fit-content',
            marginTop: '4px',
            marginRight: '12px',
          }}
        />
      </Box>

      {reports?.map((item: any, ind: any) => {
        return (
          <Box
            sx={{
              ml: 3,
              display: 'flex',
              alignItems: 'center',
              height: '64px',
            }}
            onMouseEnter={(e: {
              currentTarget: SetStateAction<HTMLElement | null>;
            }) => {
              setAnchorEl1(e.currentTarget);
              setIndex(ind);
            }}
            onMouseLeave={() => {
              setAnchorEl1(null);
              setIndex(null);
            }}
            key={item.name}
          >
            <Typography
              id={`${item.name}-menu`}
              variant="h6"
              key={item.name}
              sx={{
                color: openReports && index === ind ? '#8141f2' : '#58595B',
                display: 'flex',
                alignItems: 'center',
                height: '64px',
                fontSize: '18px',
                cursor: 'default',
              }}
            >
              {item.name}
            </Typography>
            {index === ind && (
              <Menu
                id={`${item.name}-menu`}
                anchorEl={anchorEl1}
                open={openReports}
                onClose={() => setAnchorEl1(null)}
                autoFocus={false}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                  onMouseLeave: () => setAnchorEl1(null),
                }}
                sx={{
                  width: '252px',
                  '& .MuiMenu-list': {
                    paddingTop: '0px',
                    paddingBottom: '0px',
                  },
                }}
              >
                {item.reports.map((sub: any, indx: any) => (
                  <MenuItem
                    onClick={() => handleReportClick(sub.reportId)}
                    key={indx}
                    sx={{
                      width: '252px',
                      '&:hover': {
                        backgroundColor: '#E6E8F3',
                      },
                      '&:active': {
                        backgroundColor: '#E6E8F3',
                      },
                    }}
                  >
                    {sub.reportName}
                  </MenuItem>
                ))}
              </Menu>
            )}
          </Box>
        );
      })}
    </>
  );
};
