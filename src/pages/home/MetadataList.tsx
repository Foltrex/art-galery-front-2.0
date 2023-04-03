import React from 'react';
import {Metadata} from "../../entities/metadata";
import {Grid} from "@mui/material";
import {MetadataEnum} from "../../entities/enums/MetadataEnum";

const MetadataList = (props: { metadata: Metadata[] }) => {

    const metadataList = props.metadata.filter(metadataItem => metadataItem.key !== MetadataEnum.ACCOUNT_IMAGE);

    return (
        <>
            {
                metadataList.map(metadataItem => (
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
