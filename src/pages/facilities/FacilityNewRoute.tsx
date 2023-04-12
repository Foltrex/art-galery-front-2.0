import FacilityNew from "./components/FacilityNew";
import {useNavigate} from "react-router-dom";

export const FacilityNewRoute = () => {
    const navigate = useNavigate();
    return <FacilityNew onSubmit={() => navigate("/facilities")} back={() => navigate("/facilities")}/>
}