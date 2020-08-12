import React from 'react';
import {
    Grid,
    GridContainer,
    Table
} from '@trussworks/react-uswds';
import '../css/candidate.scss';

const Candidate = () => {
    return (
        <div className='container'>
            <GridContainer>
                <Grid row>
                    <Grid col>
                        <a href='#'>Back to search results</a>
                    </Grid>
                </Grid>
                <Grid row>
                    <Grid col>
                        <p class='candidate-label'>CANDIDATE</p>
                    </Grid>
                </Grid>
                <Grid row>
                    <Grid col>
                        <h1 class='candidate-name'>Roy Cooper</h1>
                        <p class='candidate-party'>Democrat</p>
                        <p class='candidate-prop'><span class='candidate-prop-label'>Current Office:</span> Governor</p>
                        <p class='candidate-prop'><span class='candidate-prop-label'>Last Contest:</span> <a href='#'>Gubernatorial Election 2020</a></p>
                        <p class='candidate-prop'><span class='candidate-prop-label'>Associated Candidate PAC:</span> Cooper for North Carolina</p>
                    </Grid>
                    <Grid col>
                        <p class='total-funding'>$234,138.53</p>
                        <p class='total-funding-tooltip'>Total Funding</p>
                    </Grid>
                </Grid>
                <Grid row>
                    <Grid col>
                        <Table bordered={true}></Table>
                    </Grid>
                </Grid>
            </GridContainer>
        </div>
    )
}

export default Candidate;