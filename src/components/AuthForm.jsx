import React, { useState } from "react";
import { Button, Form ,Spinner} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import { toastOptions } from "../utils/toastOptions";
import {useSelector,useDispatch} from "react-redux"

import GoogleIcon from "../assets/google.png";
import TwitterIcon from "../assets/twitter.png";
import { axiosFetch } from "../axios";
import { AdminModal, ForgetModal } from "./";  
import {authStart, cleanupErrors} from "../redux/slices/auth"
import { useEffect } from "react";

export const initialState = {
  firstName: "",
  lastName: "",
  gender: "male",
  email: "",
  password: "",
  repeatPassword: "",
  role: "user",
  adminPin: "",
};

const AuthForm = ({ isRegister, admin }) => {
  const {currentUser,isLoading:storeLoading,errors:storeErrors}=useSelector(state=>state.auth)
  const dispatch=useDispatch();
  const navigate = useNavigate();
  const [isLoading,setIsLoading]=useState(false);
  const [values, setValues] = useState(initialState);
  const [modalOpen, setModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();
  const [forgetModal,setForgetModal]=useState(false)

  useEffect(()=>{
    if(currentUser) {
      if(currentUser.role==="user") navigate("/");
      if(currentUser.role==="admin") navigate("/admin")
    }
  },[currentUser,navigate])

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loginHandler=()=>{
      dispatch(authStart({email:values.email,password:values.password,adminPin:values.adminPin,admin}));
      
  }

  const registerMutation = useMutation(
    
    (user) => {
      setIsLoading(true);
      return axiosFetch.post("/auth/register", user);
    },
    {
      onSuccess: ({ data }) => {
        console.log(data);

        if (data.admin) {
          setModalOpen(data.admin);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setValues(initialState);
          setErrors({});
          toast.success(t(data.msg), toastOptions);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
        
      },
      onError: (err) => {
        setIsLoading(false);
        console.log(values);
        console.log(errors);
        if (err.response.data) {
          setErrors(err.response.data);
        }
      },
    }
  );



  const cleanup = () => {
    dispatch(cleanupErrors())
    setValues(initialState);
    setErrors({});
  };
  const google=()=>{
    window.open("http://localhost:8000/auth/google","_self");
  }
  const twitter=()=>{
    window.open("http://localhost:8000/auth/twitter","_self")
  }
  return (
    <Form  onSubmit={(e) => e.preventDefault()}>
      <h2 className="text-center">
        {isRegister ? t("register_title") : t("login_title")}
      </h2>
      <hr />
      {isRegister && (
        <>
          <Form.Group className="mb-2">
            <Form.Label>{t("first_name")}</Form.Label>
            <Form.Control
              value={values.firstName}
              isInvalid={errors.firstName}
              type="text"
              onChange={handleChange}
              name="firstName"
            />
            {errors.firstName && <p className="error">{t(errors.firstName)}</p>}
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>{t("last_name")}</Form.Label>
            <Form.Control
              value={values.lastName}
              isInvalid={errors.lastName}
              name="lastName"
              onChange={handleChange}
              type="text"
            />
            {errors.lastName && <p className="error">{t(errors.lastName)}</p>}
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>{t("gender")}</Form.Label>
            <div className="d-flex gap-5">
              <Form.Check
                isInvalid={errors.gender}
                name="gender"
                onChange={handleChange}
                value="female"
                label={t("female")}
                checked={values.gender === "female"}
              />
              <Form.Check
                isInvalid={errors.gender}
                name="gender"
                onChange={handleChange}
                value="male"
                label={t("male")}
                checked={values.gender === "male"}
              />
            </div>
            {errors.gender && <p className="error">{t(errors.gender)}</p>}
          </Form.Group>
        </>
      )}
      {admin && (
        <Form.Group className="mb-2">
          <Form.Label>Admin Id</Form.Label>
          <Form.Control
            isInvalid={storeErrors.adminPin}
            type="text"
            name="adminPin"
            value={values.adminPin}
            onChange={handleChange}
          />
          {storeErrors.adminPin && <p className="error">{t(storeErrors.adminPin)}</p>}
        </Form.Group>
      )}
      <Form.Group className="mb-2">
        <Form.Label>{t("email")}</Form.Label>
        <Form.Control
          value={values.email}
          isInvalid={errors.email||storeErrors.email}
          name="email"
          onChange={handleChange}
          type="email"
        />
        {(errors.email||storeErrors.email) && <p className="error">{t(errors.email||storeErrors.email)}</p>}
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>{t("password")}</Form.Label>
        <Form.Control
          value={values.password}
          name="password"
          onChange={handleChange}
          type="password"
          isInvalid={errors.password||storeErrors.password}
        />
        {(errors.password||storeErrors.password) && <p className="error">{t(errors.password||storeErrors.password)}</p>}
      </Form.Group>
      {isRegister && (
        <>
          <Form.Group className="mb-2">
            <Form.Label>{t("repeat_password")}</Form.Label>
            <Form.Control
              value={values.repeatPassword}
              name="repeatPassword"
              onChange={handleChange}
              type="password"
            />
            {errors.repeatPassword && (
              <p className="error">{t(errors.repeatPassword)}</p>
            )}
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>{t("role")}</Form.Label>
            <div className="d-flex gap-5">
              <Form.Check
                isInvalid={errors.role}
                name="role"
                onChange={handleChange}
                value="user"
                label={t("user")}
                checked={values.role === "user"}
              />
              <Form.Check
                isInvalid={errors.role}
                name="role"
                onChange={handleChange}
                value="admin"
                label={t("admin")}
                checked={values.role === "admin"}
              />
            </div>
            {errors.role && <p className="error">{t(errors.role)}</p>}
          </Form.Group>
        </>
      )}
      <Button
      disabled={isLoading||storeLoading}
        onClick={
          isRegister
            ? () => registerMutation.mutate(values)
            : loginHandler
               
        }
        type="submit"
        className="w-100"
      >
        {(isLoading||storeLoading) ? <Spinner/> : (isRegister ? t("register_title") : t("login_title")) }
      </Button>
      {(!isRegister && !admin && <Button onClick={()=>setForgetModal(true)}  className="forget" variant="link">Forgot Password?</Button>) }
      <div className="quest">
        {isRegister ? t("already_member") : t("not_member")}{" "}
        <Link onClick={cleanup} to={isRegister ? "/login" : "/register"}>
          {isRegister ? t("login_title") : t("register_title")}
        </Link>
      </div>
      {!admin && (
        <div
          className={`socials ${
            !isRegister ? "d-flex justify-content-center gap-3 w-100" : ""
          }`}
        >
          <Button onClick={google} className={`socialBtn ${isRegister ? "w-100" : ""}   google`}>
            {isRegister && t("google_text")} <img src={GoogleIcon} alt="" />
          </Button>
          <Button onClick={twitter} className={`socialBtn ${isRegister ? "w-100" : ""} `}>
            {isRegister && t("twitter_text")} <img src={TwitterIcon} alt="" />
          </Button>
        </div>
      )}
      <ToastContainer />
      {modalOpen && (
        <AdminModal
          modalOpen={modalOpen}
          close={() => setModalOpen(null)}
          setValues={setValues}
          setErrors={setErrors}
        />
      )}
      {forgetModal && <ForgetModal show={forgetModal} onHide={()=>setForgetModal(false)}/>}
    </Form>
  );
};

export default AuthForm;
