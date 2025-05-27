import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart, PieChart } from '@mui/x-charts';
import { Grid2, Typography } from '@mui/material';

export default function Charts() {
    return (
        <>
            <Grid2 container spacing={2} sx={{ flexGrow: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary', fontFamily: 'bold', mt: 2 }}>
                    Line Chart
                </Typography>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary', fontFamily: 'bold', mt: 2 }}>
                    Pie Chart
                </Typography>
            </Grid2>
            <Grid2 container spacing={2} sx={{ flexGrow: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                <LineChart
                    xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                    series={[
                        {
                            data: [2, 5.5, 2, 8.5, 1.5, 5],
                        },
                    ]}
                    width={500}
                    height={300}
                />
                <PieChart
                    series={[
                        {
                            data: [
                                { id: 0, value: 10, label: 'series A' },
                                { id: 1, value: 15, label: 'series B' },
                                { id: 2, value: 20, label: 'series C' },
                            ],
                        },
                    ]}
                    width={500}
                    height={300}
                />
            </Grid2>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary', fontFamily: 'bold', mt: 2 }}>
                Bar Chart
            </Typography>
            <BarChart
                series={[
                    { data: [35, 44, 24, 34] },
                    { data: [51, 6, 49, 30] },
                    { data: [15, 25, 30, 50] },
                    { data: [60, 50, 15, 25] },
                ]}
                height={390}
                xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            />
        </>

    );
}
