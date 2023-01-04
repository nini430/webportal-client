import React from 'react'
import {Button, Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next"
import { initialState } from './AuthForm';
import {useNavigate} from "react-router-dom"


const AdminModal = ({modalOpen,close,setValues,setErrors}) => {
    const navigate=useNavigate();
    const {t}=useTranslation();
    const accept=()=>{
        setErrors({});
        setValues(initialState);
        close()
        navigate("/login");

        
        

    }
  return (
   <Modal show={modalOpen} onHide={close}>
    <Modal.Header>{t("admin_modal_header")}</Modal.Header>
    <Modal.Body>{t("admin_modal_body")}</Modal.Body>
    <Modal.Footer>
        <Button onClick={accept}>{t("modal_accept")}</Button>
    </Modal.Footer>
   </Modal>
  )
}

export default AdminModal;