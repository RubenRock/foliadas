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
  const [imprimir, setImprimir] = useState(false)
  
  
  useEffect(() =>{
      leerDatos()
  },[])

  const ventana_impresion= () =>{
    setImprimir(true)
    //window.print()

  }


  const cabecera_matriz = (ancho_pantalla) =>{
    return(
      <div className='encabezados'>
        <p style={{fontWeight:'bold'}}>GRUPO ABARROTERO SAN MARTIN SA DE CV</p>
        <p>RFC: GAS-020807-TG0</p>
        <p>AV. CENTRAL SUR NUM. 25</p>
        <p>TEL: 963-63-6-02-23</p>
        <p>LAS MARGARITAS, CHIAPAS</p>
        <br/>
        <div style={{display:'flex',justifyContent:'flex-end',width:ancho_pantalla}}>
          <p>CONDICION: CONTADO</p>
        </div>        
      </div>
    )
  }

  const cabecera_mercado = (ancho_pantalla) =>{
    return(
      <div className='encabezados'>
        <p style={{fontWeight:'bold'}}>CARLOS ARTURO ARGUELLO GORDILLO</p>
        <p> GRUPO ABARROTERO SAN MARTIN </p>
        <p> SUCURSAL "MERCADO" </p>
        <p>RFC: AUGC-940427-UB1</p>
        <p>2A AV. ORIENTE NORTE NUM. 15</p>
        <p>TEL: 963-63-6-08-54</p>
        <p>LAS MARGARITAS, CHIAPAS</p>
        <br/>
        <div style={{display:'flex',justifyContent:'flex-end',width:ancho_pantalla}}>
          <p>CONDICION: CONTADO</p>
        </div>        
      </div>
    )
  }

  const cabecera_lorena = (ancho_pantalla) =>{
    return(
      <div className='encabezados'>
        <p style={{fontWeight:'bold'}}>LUZ LORENA ARGUELLO GORDILLO</p>
        <p> GRUPO ABARROTERO SAN MARTIN </p>
        <p> SUCURSAL "LORENA" </p>
        <p>RFC: AUGL-891102-6T2</p>
        <p>CALLE CENTRAL ORIENTE No. 34</p>
        <p>TEL: 963-63-6-02-65</p>
        <p>LAS MARGARITAS, CHIAPAS</p>
        <br/>
        <div style={{display:'flex',justifyContent:'flex-end',width:ancho_pantalla}}>
          <p>CONDICION: CONTADO</p>
        </div>        
      </div>
    )
  }

  const pantalla_principal = 
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

    </>
    

                  

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
    let ancho_pantalla = '245px', letra_chica = '10px'
    let resul=
            <div style={{width:ancho_pantalla}}> {/* ancho de la hoja de impresion */}
                {listaRemision_Creada.map((item, index) =>  <div key={index}>
                                                    <div style={{display:'none'}}> {/* muestra en pantalla los acumuladores */}
                                                        
                                                        
                                                        
                                                    </div>
                                                    
                                                    <div style={{display:'none'}}> {/* muestra en pantalla los acumuladores */}
                                                        { iva += item.tasas.tasa16}
                                                        { ieps += item.tasas.tasa8 }
                                                        { total += item.total}
                                                    </div>

                                                    {/* verifico que tienda es para poner su encabezado */}
                                                    { datosCapturados.tienda ==='matriz' ? cabecera_matriz(ancho_pantalla) : null}
                                                    { datosCapturados.tienda ==='mercado' ? cabecera_mercado(ancho_pantalla) : null}
                                                    { datosCapturados.tienda ==='lorena' ? cabecera_lorena(ancho_pantalla) : null}
                                                    
                                                    <p className='lista_remision_cliente' style={{fontWeight:'bold'}}> {item.cliente} </p>
                                                    <div style={{display:'flex',justifyContent:'space-around',fontSize:letra_chica}}>                                                        
                                                        <p className='lista_remision_fecha'> {item.fecha} </p>                                                         
                                                        <p className='lista_remision_folio'> FOLIO:  {item.folio} </p>                                                        
                                                    </div>
                                                    <div>
                                                        <hr></hr>
                                                        {remisiones_Creadas.map((item2, index2) =>
                                                            (item2.folio === item.folio) ?
                                                                <div key={index2}>
                                                                    <div className='fila' >
                                                                        <p className='remisiones_cantidad'> {item2.cantidad} </p>
                                                                        <p > {item2.empaque} {item2.producto} </p>                                                                        
                                                                    </div>
                                                                    <div className='fila' style={{width:ancho_pantalla,display:'flex',justifyContent:'space-between'}} >                                                                        
                                                                        <p style={{marginLeft:'40px', fontSize:letra_chica}} >Tasa: {item2.tasa}% </p>            
                                                                        <p className='remisiones_total' style={{marginRight:'15px'}}>$ {item2.total.toFixed(2)} </p> 
                                                                    </div>
                                                                </div>
                                                            :
                                                                null
                                                              )}
                                                        <hr></hr>

                                                        <div className='fila' style={{fontSize:letra_chica}}>
                                                            <p className='lista_remision_total'> TASA 0%: $ </p> 
                                                            <p className='lista_remision_total' style={{width:'150px'}}> {item.tasas.tasa0.toFixed(2)} </p> 
                                                        </div>
                                                        <div className='fila' style={{fontSize:letra_chica}}>
                                                            <p className='lista_remision_total'> IVA: $ </p> 
                                                            <p className='lista_remision_total' style={{width:'150px'}}> {item.tasas.tasa16.toFixed(2)} </p> 
                                                        </div>
                                                        <div className='fila' style={{fontSize:letra_chica}}>
                                                            <p className='lista_remision_total'> IESP: $ </p> 
                                                            <p className='lista_remision_total' style={{width:'150px'}}> {item.tasas.tasa8.toFixed(2)} </p> 
                                                        </div>
                                                        <div className='fila'style={{fontWeight:'bold'}}>
                                                            <p className='lista_remision_total'> TOTAL: $ </p> 
                                                            <p className='lista_remision_total' style={{width:'150px'}}> {item.total.toFixed(2)} </p> 
                                                        </div>

                                                        <div>
                                                          <p style={{textAlign:'center'}}>GRACIAS POR SU COMPRA</p>
                                                        </div>
                                                        
                                                    </div>
                                                </div>)
                }
                <p>total: {total}   - tasa0: {(total-iva-ieps)} - iva: {iva} - ieps: {ieps}</p>                              
                <div>
                <button className='boton' 
                  onClick={() => ventana_impresion()} 
                  onMouseEnter={(e) => changeBack(e)}
                  onMouseLeave={(e) => changeBack(e)}                  
                >imprimir</button>
                <button className='boton' 
                  onClick={() => setImprimir(false)} 
                  onMouseEnter={(e) => changeBack(e)}
                  onMouseLeave={(e) => changeBack(e)}                  
                >regresar</button>
            </div>
      </div>
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
          //pantalla de carga
          <div className='App-header'>
            <img src={logoGASM} className='carga_inicio'  alt="ini" />
            <p  className='texto_inicio'> cargando datos </p>            
          </div>
        :
          <>
                      
            { !imprimir ? pantalla_principal : null }

            {mostrarListaRemisiones()}

            
        </>

                    
        
        
      }       
    </div>
  );
}

export default App;
