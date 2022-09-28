import { FormControl, Grid, Typography, Paper, InputBase } from "@mui/material";
import theme from "../themes";
import searchIcon from "../images/icon-feather-search.svg";

interface FilterProps {
  onFilter: (e: any) => void;
  filterText: string;
}

export const SearchFilter = ({ onFilter, filterText }: FilterProps) => {
  return (
    <Grid container spacing={2} my={1}>
        <Grid
          item
          xs={8}
          display="flex"
          justifyContent={"flex-start"}
          alignItems={"center"}
          style={{ padding: "0" }}
        >
          <Typography
            variant="subtitle1"
            color={`${theme.palette.text.primary}`}
            fontSize={`${theme.typography.subtitle1}`}
          >
            All users
          </Typography>
        </Grid>
        <Grid
          item
          xs={4}
          display={"flex"}
          justifyContent={"flex-end"}
          style={{ padding: "0" }}
        >
          <FormControl>
            <Paper
              component={"div"}
              sx={{
                paddingLeft: "4px",
                display: "flex",
                alignItems: "center",
                width: 300,
                height: 40,
                background: `${theme.palette.secondary.main}`,
                borderRadius: "4px",
                boxShadow: 0,
                border: "1px solid #A7A9AC",
              }}
            >
              <img
                src={searchIcon}
                alt="searchIcon"
                style={{ margin: "2px 6px" }}
              />
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search "
                size="medium"
                value={filterText}
                onChange={onFilter}
              />
            </Paper>
          </FormControl>
        </Grid>
      </Grid>
  );
};

