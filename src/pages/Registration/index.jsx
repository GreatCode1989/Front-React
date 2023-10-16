import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { SelectIsAuth, fetchRegister } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";

import styles from './Login.module.scss';

export const Registration = () => {

  const dispatch = useDispatch();
  const isAuth = useSelector(SelectIsAuth)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: '', // Полное имя
      email: "", // Электронная почта
      password: "", // Пароль
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));

    if (!data.payload) {
      return alert('Не удалось зарегистрироватся!')
    }

    if ("token" in data.payload) {
      window.localStorage.setItem('token', data.payload.token)
    } 
  };

  if (isAuth) {
    return <Navigate to="/" /> // Перенаправление на главную страницу, если пользователь уже авторизован
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
     <form  onSubmit={handleSubmit(onSubmit)}>
     <TextField
        className={styles.field}
        label="Полное имя" // Название поля для ввода полного имени
        error={Boolean(errors.fullName)} // Поле для отображения ошибки
        helperText={errors.fullName ? errors.fullName.message : ""} // Текст ошибки
        {...register("fullName", { required: "Укажите имя" })} // Регистрация поля ввода с правилами
        fullWidth
      />
      <TextField
        className={styles.field}
        label="E-Mail" // Название поля для ввода почты
        error={Boolean(errors.email)} // Поле для отображения ошибки
        helperText={errors.email ? errors.email.message : ""} // Текст ошибки
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
        Зарегистрироваться
      </Button>
     </form>
    </Paper>
  );
};
