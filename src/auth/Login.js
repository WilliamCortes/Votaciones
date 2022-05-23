import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BiShow } from 'react-icons/bi';
import { AiFillEyeInvisible } from 'react-icons/ai';
import swal from 'sweetalert';
import logo from '../assets/logo.jpeg'
import '../styles/login.css'


export const Login = () => {

    const { login } = useAuth();
    const history = useHistory();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password).then((() => {
                axios.get(`/api/users/${email}`).then(({ data }) => {
                    data.isAdmin ? 
                        history.push(`/home/${data.haveTables}`)
                    :
                        history.push(`/table/${data.tableId}`);
                    localStorage.setItem('user', JSON.stringify({
                        id: data.id,
                        name: data.name,
                        email: data.email,
                        tableId: data.tableId,
                    }))
                })
            }))
        } catch (error) {
            swal({
                title: "Lo sentimos",
                text: `${error.message}`,
                icon: "warning",
                timer: 3000,
            });
            console.log('Error login', error.message)
        }
    }

    return (
        <div className='login'>
            <div className='login_logo'>
                <img src={logo} alt='Logo' />
            </div>
            <form onSubmit={handleSubmit} className='login_form'>
                <h2> Ingresar </h2>
                <label htmlFor='email'>Correo</label>
                <input type='email' id='email' placeholder='Escribe Aquí' onChange={e => setEmail(e.target.value)} />
                <div className='signup_label_password'>
                    <label htmlFor='password'>Contraseña</label>
                    <input className='login_password' type={showPassword ? 'text' : 'password'} id='password' placeholder='Escribe Aquí' onChange={e => setPassword(e.target.value)} />
                    {showPassword ? <BiShow className='login_icon_eye' onClick={() => setShowPassword(!showPassword)} />
                        : <AiFillEyeInvisible className='login_icon_eye' onClick={() => setShowPassword(!showPassword)} />}
                </div>
                {password.length < 6 ? <small>La contraseña debe tener mínimo 6 caracteres</small> : <small >	&#10004;</small>}
                <input className='login_button' type='submit' value='Ingresar' />
                <div className='login_div'>
                    <p>¿No tienes una cuenta?</p>
                    <Link to='/signup'>Regístrate</Link>
                </div>

            </form>
        </div>
    )
}
