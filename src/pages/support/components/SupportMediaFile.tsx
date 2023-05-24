import {buildImageUrl} from "../../../util/PrepareDataUtil";
import {Link} from "@mui/material";
import {Box} from "@mui/system";
import * as React from "react";

export function SupportMediaFile({mimeType, fileId, originalName}:{mimeType:string, fileId:string, originalName:string}) {
    return <Box>
    {isImage(mimeType)
        ? <img src={buildImageUrl(fileId)} alt={"img"} style={{maxWidth: 300}}/>
        : <Link href={buildImageUrl(fileId)} target={"_blank"}>{resolveIcon(originalName)}{originalName}</Link>}
    </Box>
}


function isImage(mimeType: string) {
    switch (mimeType) {
        case 'image/jpg':
        case 'image/gif':
        case 'image/png':
        case 'image/jpeg':
            return true;
        default:
            return false;
    }
}

function resolveIcon(originalName: string) {
    let ext = undefined;
    if(originalName && originalName.indexOf(".")) {
        const parts = originalName.split('.');
        ext = parts[parts.length - 1]
    }
    if(!ext) {
        ext = "blank";
    }
    return <span><span className={"fiv-cla fiv-icon-" + ext}></span>&nbsp;</span>
}
