
import { Avatar, Button, Card, CardHeader, Divider, FormControl, OutlinedInput, Stack, Typography } from "@mui/material";
import React from 'react'
import { IPartnerInventorySetting } from '../../../mocks/InventorySettings'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { CustomSwitch } from "./Switch"

const PartnerInventorySettingSchema = yup.object({
    borrowing: yup.bool().required(),
    percentage: yup.number().when("borrowing", {
        is: true,
        then: yup.number().required("Must enter a percent to borrow").min(1).max(100)
    })
})

const InventorySettingsCard = (props: IPartnerInventorySetting) => {

    const { name, initials, color, isOwner, borrowing, percentage } = props

    const formik = useFormik({
        initialValues: {
            borrowing: borrowing ?? false, percentage: percentage || 1
        },
        validationSchema: PartnerInventorySettingSchema,
        onSubmit: (values) => {
            console.log(values)
        }
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack direction="row" spacing={5} sx={{ ml: '10px', height: '100px' }}>
                <Stack sx={{ justifyContent: 'center', height: '84px' }}>
                    <Typography component={'span'} sx={{ fontSize: 12, fontWeight: 800, ml: '10px' }}>Borrowing</Typography>
                    <CustomSwitch role="checkbox" inputProps={{
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        'data-testid': `${name}-borrowing`
                    }} data-testid={`${name}-borrowing-parent`} id="borrowing" sx={{ m: 1 }} disabled={!isOwner} defaultChecked={borrowing} value={formik.values.borrowing} onChange={formik.handleChange} />
                </Stack>
                <Stack sx={{ justifyContent: 'center', height: '84px' }}>
                    <Typography component={'span'} sx={{ fontSize: 12, fontWeight: 800, ml: '10px' }}>Percentage(%)</Typography>
                    {formik.values.borrowing === true && (
                        <FormControl sx={{ m: 1, width: '75px', }} variant="filled">
                            <OutlinedInput
                                id="percentage"
                                name="percentage"
                                value={formik.values.percentage}
                                onChange={formik.handleChange}
                                size="small"
                                inputProps={{
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    'data-testid': `${name}-percentage`,
                                    'aria-label': 'weight',
                                    style: { textAlign: 'center', fontSize: '14px' }
                                }}
                                sx={{ height: '26px', fontSize: '15px', backgroundColor: 'rgba(0, 0, 0, 0.06)' }}
                                data-testid={`${name}-percentage-parent`}
                                disabled={!isOwner}
                            />
                        </FormControl>
                    )}
                    {formik.values.borrowing === false && (
                        <Typography component={'span'} sx={{ fontSize: 12, fontWeight: '600', ml: '15px', mt: '13px', mb: '2px' }}>NA</Typography>
                    )}
                </Stack>
                {formik.dirty && (
                    <Button data-testid={`${name}-submit`} type="submit" variant="contained" sx={{ mr: '15px !important', ml: 'auto !important', height: '50%', mt: 'auto !important', mb: '15px !important' }}>Save</Button>
                )}
            </Stack>
        </form>

    )
}

export default InventorySettingsCard