import {useEffect, useState} from 'react'
import logoGASM from './img/Logo_GASM.JPG'
import home_img from './img/home.svg'
import report_img from './img/report.svg'
import * as ObtenerNotas from './obtenerNotas'
import './App.css';

function App() {
  const [datosCapturados,setDatosCapturados] = useState ({'tienda':'nada','total':'0','iva':'0','ieps':'0','notas':'0','excedente':'', 'fecha':''})
  const [productos, setProductos] = useState([])
  const [empaques, setEmpaques] = useState([])
  const [listaRemision_Creada, setlistaRemision_Creada] = useState([])
  const [remisiones_Creadas, setRemisiones_Creadas] = useState([])  
  
  
  useEffect(() =>{
      leerDatos()
  },[])

  const cabecera_matriz = (fecha,folio) =>{
    return(
      <div className='encabezados'>
        <p>GRUPO ABARROTERO SAN MARTIN SA DE CV</p>
        <p>RFC: GAS-020807-TG0</p>
        <p>AV. CENTRAL SUR NUM. 25</p>
        <p>TEL: 963-63-6-02-23</p>
        <p>LAS MARGARITAS, CHIAPAS</p>
        <p>CONDICION:            CONTADO</p>
        <p>MOSTRADOR</p>
        <p>{fecha}</p> 
        <p>{folio}</p>
      </div>
    )
  }

  const leerDatos = async () =>{
    setEmpaques([])  
    let response = await fetch('https://vercel-api-eta.vercel.app/api/inventario' )        
    let data = await response.json()           
    setProductos(data)

    response = await fetch('https://vercel-api-eta.vercel.app/api/empaque' )        
    data = await response.json()       
    setEmpaques(data) 
  }

  const mostrarListaRemisiones = () =>{
    let total=0, iva = 0, ieps = 0
    let resul=
              <>
                {listaRemision_Creada.map((item, index) =>  <div key={index}>
                                                    {cabecera_matriz(item.fecha,item.folio)}
                                                    <div style={{display:'none'}}> {/* muestra en pantalla los acumuladores */}
                                                        { iva += item.tasas.tasa16}
                                                        { ieps += item.tasas.tasa8 }
                                                        { total += item.total}
                                                    </div>
                                                    <div className='fila'>
                                                        <p className='lista_remision_folio'> {item.folio} </p>
                                                        <p className='lista_remision_cliente'> {item.cliente} </p>
                                                        <p className='lista_remision_fecha'> {item.fecha} </p>                                                         
                                                    </div>
                                                    <div>
                                                        <hr></hr>
                                                        {remisiones_Creadas.map((item2, index2) =>
                                                            (item2.folio === item.folio) ?
                                                                <div key={index2}>
                                                                    <div className='fila' >
                                                                        <p className='remisiones_cantidad'> {item2.cantidad} </p>
                                                                        <p className='remisiones_producto'> {item2.empaque} {item2.producto} </p>                                                                        
                                                                    </div>
                                                                    <p className='remisiones_total'>$ {item2.total.toFixed(2)} </p> 
                                                                </div>
                                                            :
                                                                null
                                                              )}
                                                        <hr></hr>
                                                        <p className='lista_remision_total'>$ {item.total.toFixed(2)} </p> 
                                                    </div>
                                                </div>)
                }
                <p>total: {total}   - tasa0: {(total-iva-ieps)} - iva: {iva} - ieps: {ieps}</p>                              
                <div>
                <button className='boton' 
                  onClick={() => window.print()} 
                  onMouseEnter={(e) => changeBack(e)}
                  onMouseLeave={(e) => changeBack(e)}
                >Crear</button>
            </div>
              </>
    return(resul)                                          
  }

  const obtenerDatos = () =>{
    let error = ''
    let total = parseFloat(datosCapturados.total)
    let iva = parseFloat(datosCapturados.iva)
    let ieps = parseFloat(datosCapturados.ieps)
    let notas = parseInt(datosCapturados.notas)

    if (datosCapturados.fecha.length === 0)
      error ='necesitas seleccionar fecha \n'

    if (datosCapturados.tienda === 'nada')
      error = error +'necesitas seleccionar tienda \n'
    
    if (total<1 ||  datosCapturados.total.length === 0)
      error=error + 'necesitas total \n'

    if (iva>total)
      error=error + 'Iva supera a la cantidad total \n'

    if (ieps>total)
      error=error + 'Iesp supera a la cantidad total \n'

    if ((iva + ieps)>total)
      error=error + 'La suma de IVA e IEPS supera a la cantidad total \n'
    
    if (notas<1 || datosCapturados.notas.length === 0)
      error=error + 'Pon el numero de notas que necesitas \n'
    
    if (datosCapturados.excedente.length === 0)
      error=error + 'Pon el total excedente permitido por nota'      

    if (error) 
      alert(error)
    else //despues de validar la informacion hacemos los calculos
      {
          const {listaRemisiones, remisiones} =ObtenerNotas.obtenerNotas(datosCapturados,productos,empaques)
          setlistaRemision_Creada(listaRemisiones)
          setRemisiones_Creadas(remisiones)
      }

  }

  const changeBack = (e) =>{
    e.target.style.background === 'blue' ?
      e.target.style.background = '#6C63FF'
    :
      e.target.style.background = 'blue'

  }

  return (
    <div>

        {empaques.length === 0 ? 
          <div className='App-header'>
            <img src={logoGASM} className='carga_inicio'  alt="ini" />
            <p  className='texto_inicio'> cargando datos </p>            
          </div>
        :
          <>  
            <div >      
              <img src={logoGASM} className='logo-GASM'  alt="logo" />        
              <p className='texto_cabecera'> Foliadas </p>
            </div>
            
          
            
            <div className='seccion_calculos' > 
              <div className='fila'>
                  <img src={home_img} className='logo-home'  alt="home" />       
                  <div className='mandar_abajo '>
                    <div className='columna'>
                      <div style={{display:'flex',justifyContent:'flex-end'}}>
                        <input type="date"  className='caja_texto_tienda' style={{width: '220px'}}
                          onChange={(e) => setDatosCapturados({...datosCapturados,'fecha':e.target.value})}/>
                      </div>
                      <select className='caja_texto_tienda' placeholder='Tienda' type="search" 
                        onChange={(e) => setDatosCapturados({...datosCapturados,'tienda':e.target.value})} 
                      >
                        <option value="nada">Seleccione la tienda</option>
                        <option value="matriz">Matriz</option>
                        <option value="mercado">Mercado</option>
                        <option value="lorena">Lorena</option>
                      </select>
                    </div>
                  </div>
              </div>
              <div className='fila' style={{marginLeft:'50px'}}>
                <div className='centrar_imagen'>
                  <img src={report_img} className='logo-report'  alt="report" />       
                </div>
                <div className='columna'>
                  <input type='number' placeholder='Total' className='caja_texto' style={{width:'299px',height:'30px'}} 
                      onChange={(e) => setDatosCapturados({...datosCapturados,'total':e.target.value})
                    } 
                  />
                  <input type='number' placeholder='IVA' className='caja_texto' style={{width:'299px',height:'30px'}} 
                      onChange={(e) => setDatosCapturados({...datosCapturados,'iva':e.target.value})
                    } 
                  />
                  <input type='number' placeholder='IEPS'className='caja_texto' style={{width:'299px',height:'30px'}} 
                      onChange={(e) => setDatosCapturados({...datosCapturados,'ieps':e.target.value})
                    } 
                  />
                  
                  <input type='number' placeholder='Numero de notas'className='caja_texto' style={{width:'299px',height:'30px'}} 
                      onChange={(e) => setDatosCapturados({...datosCapturados,'notas':e.target.value})
                    } 
                  />
                  <input type='number' placeholder='Excedente permitido' className='caja_texto' style={{width:'299px',height:'30px'}} 
                      onChange={(e) => setDatosCapturados({...datosCapturados,'excedente':e.target.value})
                    } 
                  />
                </div>
              </div>
            </div>

            <div>
              <button className='boton' 
                onClick={() => obtenerDatos()} 
                onMouseEnter={(e) => changeBack(e)}
                onMouseLeave={(e) => changeBack(e)}
              >Crear</button>
            </div>

            {mostrarListaRemisiones()}

            
        </>

                    
        
        
      }       
    </div>
  );
}

export default App;
