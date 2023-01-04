import React from 'react'
import {Modal,Button} from "react-bootstrap"
import {useTranslation} from "react-i18next"

const DeleteModal = ({subject,deleteSubject,modalOpen,close}) => {
    const {t}=useTranslation()

    
  return (
    <Modal  show={modalOpen} onHide={close} >
        <Modal.Header closeButton>{t("subject_deletion",{subject})}</Modal.Header>
        <Modal.Body>{t("delete_message",{subject})}</Modal.Body>
        <Modal.Footer>
            <Button onClick={()=>deleteSubject.mutate()} variant="danger">{t("understand")}</Button>
            <Button onClick={close}>{t("cancel")}</Button>
        </Modal.Footer>
    </Modal>
  )
}

export default DeleteModal;