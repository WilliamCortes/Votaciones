import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import { useAuth } from '../context/AuthContext';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { BiShow } from 'react-icons/bi';
import logo from '../assets/logo.jpeg'
import '../styles/signup.css';


export const SignUp = () => {
    const initialState = {
        name: '',
        email: '',
        password: '',
        isAdmin: true,
        tableId:'',
        haveTables:false,
    }
    const { signup } = useAuth();
    const history = useHistory();
    const [state, setState] = useState(initialState)
    const [showPassword, setShowPassword] = useState(false)


    const handleChange = event => {
        setState({ ...state, [event.target.name]: event.target.value, })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await signup(state.email, state.password).then((() => {
                axios.post(`/api/users`, {...state})
                .then(({ data }) => {
                    localStorage.setItem('user', JSON.stringify({
                        id: data.id,
                        name: data.name,
                        email: data.email,
                        isAdmin: true,
                    }))
                    history.push(`/home/${data.haveTables}`)
                    swal({
                        title: `Bienvenid@ ${data.name} 🎉`,
                        icon: "success",
                        timer: 5000,
                    });
                })
            }))
        } catch (error) {
            swal({
                title: "Lo sentimos",
                text: `${error.message}`,
                icon: "warning",
                timer: 3000,
            });
            console.log(error.message);
        }
    }

    return (
        <div className='signup'>
            <div className='signup_logo'>
                <img src={logo} alt='Logo' />
            </div>
            <form onSubmit={handleSubmit} className='signup_form'>
                <h2> Regístrate </h2>
                <label htmlFor='text'>Nombre </label>
                <input type='text' id='name' name='name' value={state.name} placeholder='Escribe Aquí' onChange={handleChange} />

                <label htmlFor='email'>Correo</label>
                <input type='email' id='email' name='email' value={state.email} placeholder='Escribe Aquí' onChange={handleChange} />

                <div className='signup_label_password'>
                    <label htmlFor='password'>Contraseña</label>
                    <input type={showPassword ? 'text' : 'password'} id='password' name='password' value={state.password} placeholder='Escribe Aquí' onChange={handleChange} />
                    {showPassword ? <BiShow className='signup_icon_eye' onClick={() => setShowPassword(!showPassword)} />
                        : <AiFillEyeInvisible className='signup_icon_eye' onClick={() => setShowPassword(!showPassword)} />}
                </div>
                {state.password.length < 6 ? <small>La contraseña debe tener mínimo 6 caracteres</small> : <small >	&#10004;</small>}
                <button className='signup_button' type='submit'> Registrar mi cuenta</button>
                <p>¿Ya tienes una cuenta? <Link to='/login'>Inicia Sesión</Link></p>
            </form>
        </div >
    )
}
