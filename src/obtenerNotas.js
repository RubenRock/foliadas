function ObtenerProductos (total, productos, empaques,tasa,total_por_nota, excedente){
    let sumaAcumulada = 0
    let total_linea = 0
    let resul = []

    if (productos[0].iva !== '0') tasa = 16
    if (productos[0].ieps !== '0') tasa = 8 
    
    while (total > sumaAcumulada) { //mientras no se pase del total establecido agregamos mas productos
           
            let id_producto = Math.floor(Math.random() * productos.length); //elijo al azar un producto

            let empaquefiltrado = (empaques.filter(x => x.clave ===productos[id_producto].clave ) )//filtro los empaque del producto
            let id_empaque = Math.floor(Math.random() * empaquefiltrado.length); //elijo al azar un empaque
            
            let cantidad = Math.floor(Math.random() * 3+1); //elijo una cantidad al azar del 1 al 3 sin el 0    

            total_linea = cantidad*empaquefiltrado[id_empaque].precio
        
            if (total_linea < (total_por_nota + excedente))  //evito que las notas se pase por una cantidad mayor a la variable excedente               
            {                
                sumaAcumulada += total_linea
                resul =[
                        ...resul,{
                        'cantidad' : cantidad,
                        'producto' : productos[id_producto].producto,
                        'empaque' : empaquefiltrado[id_empaque].empaque,
                        'precio' : empaquefiltrado[id_empaque].precio,
                        'total' : total_linea,
                        'tasa' : tasa
                        }
                    ]}
            
            
    }    
    return {resul,sumaAcumulada}
}

const insertarProductos = (productos,total_por_nota,folio) =>{
 
    let sumaAcumulada = 0, cont= 0
    let resul = []    
    
    productos.map(item => {
        if (total_por_nota < sumaAcumulada) {
            cont++
            sumaAcumulada = 0

        }
        sumaAcumulada += item.total
        resul.push(Object.assign({'folio': (folio+cont)},item,{'suma':sumaAcumulada}))
        
    })    
        
        sumaAcumulada = 0        
    return(resul)

}

const creacionDeNotas= (remisiones, fecha) =>{
    let iva = 0, ieps = 0, tasa0 = 0, cont = 0
    let folio = 1  
    let getDay = fecha[8]+fecha[9]
    let getMounth = fecha[5]+fecha[6]
    let getYear = fecha[0]+fecha[1]+fecha[2]+fecha[3]
    let fechaCompuesta = getDay+'-'+getMounth+'-'+getYear

    let resul = [{
        'folio' : folio,
        'cliente' : 'cliente No.'+(folio+cont),
        'direccion' : 'centro',                           
        'fecha' : fechaCompuesta,
        'tasas': { 'tasa0' : tasa0,
                    'tasa16': iva,
                    'tasa8': ieps
                    },
        'total': (tasa0+iva+ieps)
        }]
       
    while (remisiones.length > cont ) {  
        
               
        
        if (folio === remisiones[cont].folio) { // cambio de folio 
            //el total es variables, lo toma al azar la app, se tiene que obtener las 3 tasas
            if (remisiones[cont].tasa === 16) iva += remisiones[cont].total
            if (remisiones[cont].tasa === 8) ieps += remisiones[cont].total
            if (remisiones[cont].tasa === 0) tasa0 += remisiones[cont].total

            resul[folio-1].tasas = { 'tasa0' : tasa0, 'tasa16': iva,'tasa8': ieps}            
            resul[folio-1].total = (tasa0+iva+ieps)
            
        }
        else{
            folio = remisiones[cont].folio 

            iva = 0
            ieps = 0
            tasa0 = 0            

            if (remisiones[cont].tasa === 16) iva = remisiones[cont].total
            if (remisiones[cont].tasa === 8) ieps = remisiones[cont].total
            if (remisiones[cont].tasa === 0) tasa0 = remisiones[cont].total

            resul =[
                ...resul,{
                'folio' : folio,
                'cliente' : 'cliente No.'+(folio+cont),
                'direccion' : 'centro',                           
                'fecha' : fechaCompuesta,
                'tasas': { 'tasa0' : tasa0,
                            'tasa16': iva,
                            'tasa8': ieps
                            },
                'total': (tasa0+iva+ieps)
                }
            ] 

            
        }
        cont++               
    }
    return(resul)
}

export const obtenerNotas = (datos, productos, empaques) =>{
    let total = parseFloat(datos.total)
    let iva = parseFloat(datos.iva)
    let ieps = parseFloat(datos.ieps)
    let notas = parseInt(datos.notas)
    let fecha = (datos.fecha)
    let excedente = parseInt(datos.excedente)// por cuanto puede pasarse el total de cada nota
    let produc = [...productos]
    let total_por_nota = total/notas
    let productos0 = produc.filter((x) => (x.ieps === '0' && x.iva === '0')) 
    let productosIVA = produc.filter((x) => (x.iva !== '0')) 
    let productosIEPS = produc.filter((x) => (x.ieps !== '0')) 

    //quito precios de medio mayoreo
    let empaquefiltrado = (empaques.filter(x => x.empaque !== 'DOCE' && x.empaque !== 'SEIS' ) ) 
    
    // obtengo las remisiones por cada tasa
    const tasa0 = ObtenerProductos((total-iva-ieps), productos0, empaquefiltrado, 0, total_por_nota, excedente)    
    
    const tasa16 = ObtenerProductos(iva, productosIVA, empaquefiltrado, 16, total_por_nota, excedente)

    const tasa8 = ObtenerProductos(ieps, productosIEPS, empaquefiltrado, 8, total_por_nota, excedente)

    //uno las remisiones por cada tasas y las pongo en desorden
    let unionDeTasa = [...tasa0.resul, ...tasa16.resul,...tasa8.resul].sort(()=>Math.random() - 0.5) 

    //creo todas las remisiones
    let remisiones = insertarProductos(unionDeTasa,total_por_nota,1) 
    //creo la lista de remisiones en base a las remisiones
    let listaRemisiones = creacionDeNotas(remisiones,fecha)

    return {'listaRemisiones':listaRemisiones, 'remisiones':remisiones}

}