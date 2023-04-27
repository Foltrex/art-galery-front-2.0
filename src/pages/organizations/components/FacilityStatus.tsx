import * as React from 'react';
import { PrepareDataUtil } from '../../../util/PrepareDataUtil';
import { Facility } from '../../../entities/facility';

interface IFacilityStatusProps {
    facility: Facility
}

const FacilityStatus: React.FunctionComponent<IFacilityStatusProps> = ({facility}) => {
  if (!facility) {
	return null;
  }
 
  return (
    <span style={{
		color: PrepareDataUtil.getFacilityStatusColor(facility.isActive)
	}}>
		{facility.isActive ? 'Active' : 'Inactive'}
	</span>
  );
};

export default FacilityStatus;
