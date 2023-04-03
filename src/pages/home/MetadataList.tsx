import React from 'react';
import {Metadata} from "../../entities/metadata";
import {Grid} from "@mui/material";

const MetadataList = (props: { metadata: Metadata[] }) => {
    return (
        <>
            {
                props.metadata.map(metadataItem => (
                    <>
                        <Grid item sm={4}><strong>{metadataItem.key}</strong></Grid>
                        <Grid item sm={8}>{metadataItem.value}</Grid>
                    </>
                ))
            }
        </>
    );
};

export default MetadataList;
