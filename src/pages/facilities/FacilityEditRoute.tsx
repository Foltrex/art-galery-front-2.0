import FacilityEdit from "./components/FacilityEdit";
import {useNavigate, useParams} from "react-router-dom";

export const FacilityEditRoute = () => {
    const matches = useParams();
    const navigate = useNavigate();
    return <FacilityEdit facilityId={matches.id!} back={() => navigate("/facilities")} onSubmit={() => navigate("/facilities")}/>
}