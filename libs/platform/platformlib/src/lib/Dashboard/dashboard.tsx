import { useContext, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import {
  Grid,
  Box,
  Typography,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import theme from "../themes";
import { InfoCard, Card } from "../components";
import sites from "../images/sites.svg";
import users from "../images/users.svg";
import organizations from "../images/organizations.svg";
import { useHistory } from "react-router-dom";
import { OrganizationList } from "../features/organizations/organizationsList";
import { OrganizationDataProfile } from "../features/organizations/organizationsProfile/organizationDataProfile";
import {
  getAllOrgCount,
  getAllSitesCount,
  getAllUsersCount,
  getDashboardStats,
  //selectBaseUrl
} from '@cloudcore/redux-store';
import { useOktaAuth } from "@okta/okta-react";
import { ConfigCtx } from "@cloudcore/okta-and-config";

const InfoTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.secondary.main,
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: "270px",
    maxHeight: "191px",
    fontSize: theme.typography.pxToRem(12),
    padding: theme.spacing(3),
    border: "1px solid #E0E2E5",
    borderRadius: "5px",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: `${theme.palette.secondary.main}`,
    fontSize: 20,
    "&:before": {
      border: "1px solid #E0E2E5",
    },
  },
}));

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const {platformBaseUrl} = useContext(ConfigCtx)!;   // at this point config is not null (see app)
 
  const baseUrl = platformBaseUrl;
  console.log(baseUrl)
  const orgsCount = useAppSelector(getAllOrgCount);
  const sitesCount = useAppSelector(getAllSitesCount);
  const usersCount = useAppSelector(getAllUsersCount);
  const { oktaAuth, authState } = useOktaAuth();
  const [newOrgButton, setNewOrgButton] = useState(false);

  useEffect(() => {
    if (baseUrl) {
      dispatch(getDashboardStats(baseUrl));
    }
  }, [dispatch, baseUrl]);

  useEffect(() => {

      const claims = authState?.accessToken?.claims as any;
      if (claims?.admin) {
        setNewOrgButton(
          claims?.admin?.includes("global") 
           
            ? true
            : false
        );
      }
    
  }, [authState?.isAuthenticated]);

  const handleClickAddOrg = () => {
    history.replace("/organization/addOrganization", {
      title: "Add Organization",
      task: "addOrganization",
      from: "addOrganization",
    });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingX: theme.spacing(3),
            paddingY: theme.spacing(2),
          }}
        >
          <Typography
            variant="subtitle1"
            fontSize={theme.typography.subtitle1.fontSize}
            color={theme.breadcrumLink.primary}
          >
            DASHBOARD
          </Typography>
          <Box>
            <Box
              display="flex"
              alignItems="center"
              sx={{ "&:hover": { cursor: "pointer" } }}
            >
              {/* <img src={excelLogo} alt="excelLogo" style={{ paddingRight: "10px" }} />
                            <Typography component={"span"}
                                fontSize={theme.typography.subtitle1.fontSize}
                                color={theme.palette.primary.main}
                                style={{ paddingRight: "10px" }}>
                                Download onboarding template
                            </Typography>
                            <InfoTooltip title={
                                <>
                                    <Typography fontWeight={"bold"} sx={{ textAlign: "center", paddingBottom: "5px" }}>
                                        NEXIA Onboarding
                                    </Typography>
                                    <Typography fontSize={theme.typography.body2.fontSize} sx={{ textAlign: "center", }}>
                                        Download Org onboarding sample spreadsheet templet here, Please modify this
                                        file as per org requirement and upload it to start setup.
                                    </Typography>
                                </>
                            } placement="bottom-end" >
                                <img src={info} alt="information"/>
                            </InfoTooltip> */}
              {newOrgButton && (
                <Button
                  variant="contained"
                  onClick={handleClickAddOrg}
                  sx={{
                    marginTop: theme.spacing(3),
                  }}
                >
                  ADD NEW ORG
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ paddingRight: "20px" }}>
        <Grid container spacing={3} paddingLeft="20px">
          <Grid item xs={6} md={4}>
            <InfoCard
              image={organizations}
              title="Organizations"
              count={orgsCount}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <InfoCard image={sites} title="Sites" count={sitesCount} />
          </Grid>
          <Grid item xs={6} md={4}>
            <InfoCard image={users} title="Users" count={usersCount} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ paddingRIght: "20px" }}>
        <Card
          sx={{
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(3),
            marginLeft: theme.spacing(2.5),
            marginRight: theme.spacing(2),
            borderColor: theme.palette.cardBorder.main,
          }}
        >
          <Grid container direction="row">
            <Grid item xs={12} md={6}>
              <OrganizationList />
            </Grid>
            <Grid item xs={12} md={6}>
              <OrganizationDataProfile />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

