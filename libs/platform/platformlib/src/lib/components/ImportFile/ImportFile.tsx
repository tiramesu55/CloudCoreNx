import { Button, FormControl, FormLabel, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { theme } from '@cloudcore/ui-shared';

interface Props {
  onImportFileUpdate: (b: File | null, s: string) => void;
  title: string;
  fileName: string;
  org: string;
}

const ImportFile = (props: Props) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    props.onImportFileUpdate(csvFile, fileName);
  }, [csvFile, fileName]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: theme.spacing(1.5),
        }}
      >
        <FormLabel
          sx={{
            paddingRight: theme.spacing(1.5),
            color: theme.palette.primary.main,
          }}
        >
          {props.title}
        </FormLabel>
        <FormLabel
          style={{
            paddingRight: theme.spacing(1.5),
            color: theme.palette.secondary.dark,
          }}
        >
          {props.fileName !== '' ? props.fileName + '   ' : ''}
        </FormLabel>
        <FormControl
          id="csv-form"
          style={{ minWidth: '90px', display: 'flex', flexDirection: 'row' }}
        >
          <input
            type="file"
            accept=".csv"
            id="csvFile"
            disabled={props.org.length > 0 ? false : true}
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files) {
                setCsvFile(e.target.files[0]);
                setFileName(e.target.files[0].name);
                e.target.value = '';
              }
            }}
          ></input>
          <label htmlFor="csvFile">
            <Button
              disabled={props.org.length > 0 ? false : true}
              variant="outlined"
              component="span"
              sx={{
                marginRight: theme.spacing(2),
              }}
              style={{ fontWeight: 'bold' }}
            >
              ...
            </Button>
          </label>
        </FormControl>
      </Box>
    </Box>
  );
};
export default ImportFile;
