import { InputTextWithLabel } from '@cloudcore/platform/platformlib';
import { theme } from '@cloudcore/ui-shared';
import { Autocomplete, Box, Button } from '@mui/material';
import { useField } from 'formik';
import React from 'react';

interface Props{
    name : string;
    disableEditDomain ?: boolean;
    orgDomainHandler : (value : boolean) => void;
    isAddOrganization ?: boolean;
}

export const OrgDomainAutoComplete = (props : Props) => {
    const [field, meta, helpers] = useField("orgDomains");
    const {name, disableEditDomain, orgDomainHandler, isAddOrganization} = props;
    return (
        <>
            <Autocomplete
                multiple
                id="OrgDomains"
                // options={orgFormik.values.orgDomains}
                limitTags={1}
                // value={[...orgFormik.values.orgDomains]}
                size="small"
                sx={{ width: '93%' }}
                readOnly
                freeSolo
                {...field}
                options={[]}
                onChange={(event, newValue : any) => {
                    helpers.setValue([...newValue]);
                }}
                value={field.value}
                renderInput={(params) => (
                    <Box sx={{ display: 'flex' }}>
                              <InputTextWithLabel
                                params={{ ...params }}
                                fieldName={'orgDomain'}
                                label="Org Domains"
                                formWidth="90%"
                                error={
                                    meta.touched && Boolean(meta.error)
                                }
                                helperText={
                                    meta.touched && meta.error ? meta.error : ""
                                }
                              />
                              {disableEditDomain && (
                                <Button
                                  size="small"
                                  onClick={() => orgDomainHandler(true)}
                                  sx={{
                                    height: '45px',
                                    marginTop: theme.spacing(2.5),
                                  }}
                                >
                                  {isAddOrganization ? 'Add' : 'Edit'}
                                </Button>
                              )}
                            </Box>
                )}
            />
        </>
    )
}