import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom"
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import md5 from 'md5';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'universal-cookie';
import axios from 'axios';
import '../css/Login.css'

function Login(){
    const [modalInsertar, setModalInsertar]=useState(false);
    const [data, setData]=useState([]);
    const [modalEliminar, setModalEliminar]=useState(false);
    const [reciboSeleccionado, setReciboSeleccionado]=useState({
        id: '',
        apellido_paterno: '',
        apellido_materno: '',
        nombre: '',
        correo: '',
        username: '',
        password: ''
    })
    const navigate = useNavigate();

    const baseUrl="https://localhost:44387/api/usuarios";
    const cookies =new Cookies();

    const [form, setForm]=useState({
        username:'',
        password:''
    });
    const handleChange=e=>{
        const {name, value} = e.target;
        setForm({
            ...form,
            [name]:value
        });
    }

    const handleChange2=e=>{
        const {name, value}=e.target;
        setReciboSeleccionado({
            ...reciboSeleccionado,
            [name]: value
        })

    }

    const openCloseModal=()=>{
        setModalInsertar(!modalInsertar);
    }

    const peticionPost=async()=>{
        delete reciboSeleccionado.id;
        reciboSeleccionado.monto=parseInt(reciboSeleccionado.monto);
        await axios.post(baseUrl, reciboSeleccionado)
        .then(response=>{
            setData(data.concat(response.data));
            openCloseModal();
        }).catch(error=>{
            console.log(error);
        })
    }

    const iniciarSesion=async()=>{
        await axios.get(baseUrl+`/${form.username}/${md5(form.password)}`)
        .then(response=>{
          return response.data;
        }).then(response=>{
          if(response.length>0){
            var respuesta=response[0];
            cookies.set('id', respuesta.id, {path: '/'});
            cookies.set('apellido_paterno', respuesta.apellido_paterno, {path: '/'});
            cookies.set('apellido_materno', respuesta.apellido_materno, {path: '/'});
            cookies.set('nombre', respuesta.nombre, {path: '/'});
            cookies.set('correo', respuesta.correo, {path: '/'});
            cookies.set('username', respuesta.username, {path: '/'});
            cookies.set('password', respuesta.password, {path: '/'});
            alert("Bienvenido: "+respuesta.nombre+" "+respuesta.apellido_paterno);
            navigate(`/menu/${respuesta.id}`);
          }else{
            alert('El usuario o la contraseña no son correctos');
          }
        })
        .catch(error=>{
            console.log(error);
        })
    }

    useEffect(()=>{
        if(cookies.get('id)')){
            navigate(`/menu/${cookies.get('id')}`);
        }
    },[]);

    return (
        
        <div className="containerPrincipal">
            <div className='containerLogin'>
                <div className="form-group">
                    <label>Usuario:
                        <br />
                        <input
                            type="text"
                            className="form-control"
                            name="username"
                            onChange={handleChange}
                        />
                        <br />
                        <label>Contrasena:</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            onChange={handleChange}
                        />
                        <br />
                        
                        <button className="btn btn-primary" onClick={()=>iniciarSesion()}>Iniciar Sesión</button>
                        <button className="btn btn-primary" onClick={()=>openCloseModal()}>Registro</button>
                    </label>
                </div>
            </div>
            <Modal isOpen={modalInsertar}>
            <ModalHeader>Inserta los datos</ModalHeader>
          
          <ModalBody>

          <div>
              <label>apellido_paterno </label>
              <br />
              <input type="text" name="apellido_paterno" onChange={handleChange2}/>
              <br/>
              <label>apellido_materno </label>
              <br />
              <input type="text" name="apellido_materno" onChange={handleChange2}/>
              <br />
              <label>nombre </label>
              <br />
              <input type="text" name="nombre" onChange={handleChange2}/>
              <br />
              <label>correo </label>
              <br />
              <input type="text" name="correo" onChange={handleChange2}/>
              <br />
              <label>usuario </label>
              <br />
              <input type="text" name="username" onChange={handleChange2}/>
              <br />
              <label>contrasena </label>
              <br />
              <input type="text" name="password" onChange={handleChange2}/>
              <br />
          </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"  "}
            <button className='btn btn-danger' onClick={()=>openCloseModal()}>Cancelar</button>
          </ModalFooter>

        </Modal>
        </div>
    );
}

export default Login;