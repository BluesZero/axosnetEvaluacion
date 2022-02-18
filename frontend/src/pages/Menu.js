import {useNavigate, useParams} from "react-router-dom"
import React, {useState, useEffect} from 'react';
import axios from "axios";
import Cookies from 'universal-cookie';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import '../css/Menu.css';

function Menu() {
    const baseUrl="https://localhost:44387/api/recibos_";
    const [data, setData]=useState([]);
    const navigate = useNavigate();
    const params = useParams();
    console.log(params.id)
    const cookies = new Cookies();
    const [modalEditar, setModalEditar]=useState(false);
    const [modalInsertar, setModalInsertar]=useState(false);
    const [modalEliminar, setModalEliminar]=useState(false);
    const [reciboSeleccionado, setReciboSeleccionado]=useState({
        id: '',
        proveedor: '',
        monto: '',
        moneda: '',
        fecha: '',
        comentario: '',
        id_usuario: ''
    })

    const handleChange=e=>{
        const {name, value}=e.target;
        setReciboSeleccionado({
            ...reciboSeleccionado,
            [name]: value
        })

    }

    const openCloseModal=()=>{
        setModalInsertar(!modalInsertar);
    }

    const openCloseModalEditar=()=>{
        setModalEditar(!modalEditar);
    }

    const openCloseModalEliminar=()=>{
        setModalEliminar(!modalEliminar);
    }

    const peticionGet=async()=>{
        await axios.get(`${baseUrl}/user/${params.id}`)
        .then(response=>{
            console.log(response);
            setData(response.data);
        }).catch(error=>{
            console.log(error);
        })
    }

    const peticionPost=async()=>{
        delete reciboSeleccionado.id;
        reciboSeleccionado.monto=parseInt(reciboSeleccionado.monto);
        await axios.post("https://localhost:44387/api/recibos_", reciboSeleccionado)
        .then(response=>{
            setData(data.concat(response.data));
            openCloseModal();
        }).catch(error=>{
            console.log(error);
        })
    }

    const peticionPut=async()=>{
        reciboSeleccionado.monto=parseInt(reciboSeleccionado.monto);
        await axios.put(baseUrl+ "/" +reciboSeleccionado.id, reciboSeleccionado)
        .then(response=>{
            var respuesta=response.data
            var dataAuxiliar=data;
            dataAuxiliar.map(recibo=>{
                if(recibo.id===reciboSeleccionado.id){
                    recibo.proveedor=respuesta.proveedor;
                    recibo.monto=respuesta.monto;
                    recibo.moneda=respuesta.moneda;
                    recibo.fecha=respuesta.fecha;
                    recibo.comentario=respuesta.comentario;
                }
            });
            openCloseModalEditar();
        }).catch(error=>{
            console.log(error);
        })
    }

    const peticionDelete=async()=>{
        reciboSeleccionado.monto=parseInt(reciboSeleccionado.monto);
        await axios.delete(baseUrl+ "/" +reciboSeleccionado.id)
        .then(response=>{
            setData(data.filter(recibo=>recibo.id!==response.data)); 
            openCloseModalEliminar();
        }).catch(error=>{
            console.log(error);
        })
    }

    const seleccionarRecibo=(recibo,caso)=>{
        setReciboSeleccionado(recibo);
        (caso=="Editar")?
        openCloseModalEditar(): openCloseModalEliminar();
        
    }

    useEffect(()=>{
    peticionGet();
    },[])    

    const cerrarSesion=()=>{
        cookies.remove('id', {path: '/'});
        cookies.remove('apellido_paterno', {path: '/'});
        cookies.remove('apellido_materno', {path: '/'});
        cookies.remove('nombre', {path: '/'});
        cookies.remove('correo', {path: '/'});
        cookies.remove('username', {path: '/'});
        cookies.remove('password', {path: '/'});
        navigate('../');
    }

    useEffect(()=>{
        if(!cookies.get('id')){
            this.navigate('../');
        }
          },[]);

    return (
        <div>
            
        <br />
        <button className="btn btn-danger" onClick={()=>cerrarSesion()}>Cerrar Sesión</button>
   

        <button onClick={()=>openCloseModal()}>Insertar Nuevo Recibo</button>
        
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Proveedor</th>
                    <th>Monto</th>
                    <th>Moneda</th>
                    <th>Fecha</th>
                    <th>Comentario</th>
                </tr>
            </thead>
            <tbody>
                {data.map(recibo=>(
                    <tr key={recibo.id}>
                        <td>{recibo.id}</td>
                        <td>{recibo.proveedor}</td>
                        <td>{recibo.monto}</td>
                        <td>{recibo.moneda}</td>
                        <td>{recibo.fecha}</td>
                        <td>{recibo.comentario}</td>
                        <td>
                            <button className="btn btn-primary" onClick={()=>seleccionarRecibo(recibo, "Editar")}>Editar</button>{" "}
                            <button className="btn btn-danger" onClick={()=>seleccionarRecibo(recibo, "Eliminar")}>Eliminar</button>
                        </td>
                    </tr>
                ))}

            </tbody>
        </table>
        <Modal isOpen={modalInsertar}>
          <ModalHeader>Inserta los datos</ModalHeader>
        
        <ModalBody>

        <div>
             <label>User ID:</label>
             <br/>
             <input type="text"  name="id_usuario" readOnly value={params.id}/>
             <br/>
            <label>Proveedor: </label>
            <br />
            <input type="text" name="proveedor" onChange={handleChange}/>
            <br/>
            <label>Monto: </label>
            <br />
            <input type="text" name="monto" onChange={handleChange}/>
            <br />
            <label>Moneda: </label>
            <br />
            <input type="text" name="moneda" onChange={handleChange}/>
            <br />
            <label>Fecha: </label>
            <br />
            <input type="text" name="fecha" onChange={handleChange}/>
            <br />
            <label>Comentario: </label>
            <br />
            <input type="text" name="comentario" onChange={handleChange}/>
            <br />
        </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"  "}
          <button className='btn btn-danger' onClick={()=>openCloseModal()}>Cancelar</button>
        </ModalFooter>

      </Modal>
      <Modal isOpen={modalEditar}>
          <ModalHeader>Editar los datos</ModalHeader>
        
        <ModalBody>

        <div>
            <label>ID:</label>
            <br/>
            <input type="text"  readOnly value={reciboSeleccionado && reciboSeleccionado.id}/>
            <label>Proveedor: </label>
            <br />
            <input type="text" name="proveedor" onChange={handleChange} value={reciboSeleccionado && reciboSeleccionado.proveedor}/>
            <br/>
            <label>Monto: </label>
            <br />
            <input type="text" name="monto" onChange={handleChange} value={reciboSeleccionado && reciboSeleccionado.monto}/>
            <br />
            <label>Moneda: </label>
            <br />
            <input type="text" name="moneda" onChange={handleChange} value={reciboSeleccionado && reciboSeleccionado.moneda}/>
            <br />
            <label>Fecha: </label>
            <br />
            <input type="text" name="fecha" onChange={handleChange} value={reciboSeleccionado && reciboSeleccionado.fecha}/>
            <br />
            <label>Comentario: </label>
            <br />
            <input type="text" name="comentario" onChange={handleChange} value={reciboSeleccionado && reciboSeleccionado.comentario}/>
            <br />
        </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"  "}
          <button className='btn btn-danger' onClick={()=>openCloseModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>   

      <Modal isOpen={modalEliminar}>
          <ModalBody>
              ¿Estas seguro que deseas eliminar este recibo {reciboSeleccionado && reciboSeleccionado.proveedor}?
          </ModalBody>
          <ModalFooter>
              <button className="btn btn-danger" onClick={()=>peticionDelete()}>Si</button>
              <button className="btn btn-secondary"
              onClick={()=>openCloseModalEliminar()}>
                  No
              </button>
          </ModalFooter>
      </Modal>
    </div>
    );
}

export default Menu;