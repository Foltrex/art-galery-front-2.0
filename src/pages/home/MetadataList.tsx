import React from 'react';
import {Metadata} from "../../entities/metadata";
import {Grid} from "@mui/material";
import {MetadataEnum} from "../../entities/enums/MetadataEnum";
import {PrepareDataUtil} from "../../util/PrepareDataUtil";

const MetadataList = (props: { metadata: Metadata[] }) => {

    const metadataList = props.metadata
        .filter(metadataItem => metadataItem.key !== MetadataEnum.ACCOUNT_IMAGE)
        .filter(metadataItem => metadataItem.key !== MetadataEnum.ORGANIZATION_ID)
        .filter(metadataItem => metadataItem.key !== MetadataEnum.FACILITY_ID)
        .filter(metadataItem => metadataItem.key !== MetadataEnum.CITY_ID);

    return (
        <>
            {
                metadataList.map(metadataItem => (
                    <React.Fragment key={metadataItem.key}>
                        <Grid item sm={4}>
                            <strong>{PrepareDataUtil.convertFirstLatterToUpperCase(metadataItem.key)}</strong>
                        </Grid>
                        <Grid item sm={8}>{metadataItem.value}</Grid>
                    </React.Fragment>
                ))
            }
        </>
    );
};

export default MetadataList;
