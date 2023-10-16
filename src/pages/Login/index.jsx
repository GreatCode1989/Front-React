import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Navigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import styles from "./Login.module.scss";
import { SelectIsAuth, fetchUserData } from "../../redux/slices/auth";

export const Login = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(SelectIsAuth)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchUserData(values));

    if(!data.payload) {
      return alert('Не удалось авторизоваться!')
    }

    if ("token" in  data.payload) {
      window.localStorage.setItem('token', data.payload.token)
    } 
  };

  if (isAuth) {
   return <Navigate to="/"/>
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email)}
          helperText={errors.email ? errors.email.message : ""}
          {...register("email", {
            required: "Укажите почту",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "Неверный формат почты",
            },
          })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          error={Boolean(errors.password)}
          helperText={errors.password ? errors.password.message : ""}
          {...register("password", {
            required: "Укажите пароль",
            minLength: {
              value: 5,
              message: "Пароль должен содержать минимум 5 символов",
            },
          })}
          fullWidth
        />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};
