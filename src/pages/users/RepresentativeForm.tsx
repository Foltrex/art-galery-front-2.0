import React from "react";
import {Account} from "../../entities/account";

interface IRepresentativeFormProps {
    open: boolean;
    onClose: () => void;
    representative?: Account;
}

interface FormValues {
    email: string;
    firstname: string;
    lastname: string;
}

function RepresentativeForm({ open, onClose, representative }: IRepresentativeFormProps) {
    return <h1>representative form</h1>
}

export default RepresentativeForm;
