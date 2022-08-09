//Declaracion de variables globales, elementos del DOM

    //Los input que almacenan minutos, segundos y horas
    let segundosFaltantes = document.querySelector("#segundos");
    let minutosFaltantes = document.querySelector("#minutos");
    let horasFaltantes = document.querySelector("#horas");

    //El boton que envia el formulario
    let boton = document.querySelector("#btnIniciar");

    //El select de html para elegir nuestro audio
    let seleccionarAudio = document.querySelector("#seleccionarAudio");

    //el input del Asunto o nota que añadimos
    let notaform = document.querySelector("#notaform");

    //El div que contendrá a los temporizadores que se añadan
    let contenerTemporizadores = document.querySelector("#contenerTemporizadores");

    //Agarramos al elemento body
    let bodyElement = document.querySelector("body");

    //El formulario del temporizador
    let temporizadorForm = document.querySelector("#temporizador");

//Declaracion de variables globales que no son elementos del DOM
let musica = "si";
let temporizadoresCancelados = [];  /*Lista de temporizadores donde se 
                                    añadiran los temporizadores cancelados por ID*/

//seteamos las clases de javascript
bodyElement.className = "bodyNoBlur";

//Escuchadores
boton.addEventListener("click", iniciarTemporizador);
document.addEventListener("DOMContentLoaded", poner0sFormulario);

//Clases
class Temporizador{
    /*
    Creamos una clase de temporizador para poder crear nuevos temporizadores como objetos
    */
    constructor(hint, mint,sint, audioForm, recordarTexto, divID){
        this.hint = hint;   //Hora
        this.mint = mint;   //Minutos
        this.sint = sint;   //Segundos

        this.audio = audioForm;     //Nombre del audio, sin incluir el .mp3

        this.texto = recordarTexto; //Texto de la nota (Asunto)

        this.divID = divID;         /*Un DivID que será único y será generado con
                                    Date.now()*/            
    }
}

//funciones
function iniciarTemporizador(e){
    /*Se inicia al hacer click en el boton, obtiene los valores del formulario y previene 
    la accion por default. Después llama a la funcion revision, que valida el formulario,
    y le pasa los datos como parametros.*/

    e.preventDefault(); /*Prevenimos que se envie el formulario automaticamente (La accion por 
                        default del boton submit)*/
    musica = "si";

    //Obtenemos los valores del formulario, horas minutos y segundos y los convertimos a enteros
    let mint = parseInt(minutosFaltantes.value);
    let hint = parseInt(horasFaltantes.value);
    let sint = parseInt(segundosFaltantes.value);

    //Obtenemos el audio seleccionado en el formulario a través del select
    let audioForm = seleccionarAudio.value;
    //Obtenemos el valor del input texto donde añaden una nota los usuarios
    let textoloco = notaform.value;
    //Creamos un divID usando Date.now
    let divID = Date.now();

    /*Creamos un nuveo temporizador usando el contructor de la clase Temporizador
    (Ver definicion de la clase más arriba)*/
    let temporizadorObj = new Temporizador (hint, mint, sint, audioForm, textoloco, divID);

    /*Llamamos a la función revision, que se encarga de validar el formulario, y le pasamos
    el objeto que acabamos de crear*/
    revision(temporizadorObj);
}

function revision(temporizadorObj){  
    /*Es llamada para validar los datos del formulario. Esta funcion llama a la funcion
    actualizar cada segundo, que actualiza cada segundo el temporizador*/

    if (temporizadorObj.mint<60 && temporizadorObj.sint <60){ //revisa que los minutos y segundos no superen el 59

        if (Number.isInteger(temporizadorObj.mint) && Number.isInteger(temporizadorObj.hint) && Number.isInteger(temporizadorObj.sint)){    
            /*Revisa que todos los numeros sean enteros y no contengan punto decimal, en cuyo caso
            significa que todo esta correcto y procedemos al codigo para crear el temporizador*/

            /*Llamamos a la función crear div, que nos retorna un div almacenado en una variable
            dicho div contiene parrafoAsunto, parrafoConteo y parrafoCancelar, y es el div que muestra
            el conteo y lo va actualizando.
            Guardamos el div en divTemporizador.
            */
            let divTemporizador = crearDiv(temporizadorObj);

            /*Accedemos al hijo del divTemporizadory luego a su siguiente hermano, parrafoConteo, 
            para añadirle el tiempo restante por primera vez*/
            divTemporizador.firstElementChild.nextElementSibling.textContent = "Tiempo faltante: " + temporizadorObj.hint + ":" + temporizadorObj.mint + ":" + temporizadorObj.sint;
            
            /*Llamamos a la función actualizar cada segundo y le enviamos el div que muestra el 
            conteo y el objeto temporizador como parametros*/
            actualizarCadaSegundo(temporizadorObj, divTemporizador);       
        }else{
            //No son números enteros
            alert("Por favor, solo ingresa números enteros! Así es como funciona el tiempo")
        }
    }else{
        //Los minutos o segundos no son menores a 60
        alert("Por favor, ingresa un tiempo valido!!!");
    }
}

function crearDiv(temporizadorObj){

    /*
    Esta funcion crea el div que muestra el conteo regresivo, es decir, el temporizador activo.
    Creamos al objeto y a sus parrafos hijos, los añadimos al DOM con appendChild y returnamos 
    el div que contiene todo.
    Además creamos un addEventListener con función de flecha, lo añadimos al boton de parrafoCancelar,
    y es por supuesto que si se hace click en cancelar llama a la funcion eliminarTemporizador
    */

    //Creamos el div temporizador
    let div = document.createElement('div'); 

    //Creamos el parrafo que contendra la nota o texto
    let parrafoAsunto = document.createElement("p"); 
    //Añadimos el texto al parrafo
    parrafoAsunto.textContent = "Asunto: " + temporizadorObj.texto; 

    let parrafoConteo = document.createElement("p"); //Creamos el parrafo donde se realizara el conteo
    let parrafoCancelar = document.createElement("button");  //Creamos el parrafo para cancelar
    parrafoCancelar.textContent = "Cancelar";

    //Le damos una clase al DIV y al boton de cancelar
    parrafoCancelar.classList.add("cancelarBoton");
    parrafoCancelar.classList.add("basicosBoton");
    div.classList.add("card_temporizador"); 

    parrafoCancelar.addEventListener("click", () => eliminarTemporizador(temporizadorObj, parrafoCancelar));

    //Añadimos los parrados como hijos al temporizador
    div.appendChild(parrafoAsunto); 
    div.appendChild(parrafoConteo);
    div.appendChild(parrafoCancelar);

    
    contenerTemporizadores.appendChild(div); //Añadimos el div al contenedor de DIVS
    return div;
}

function actualizarCadaSegundo(temporizadorObj, divTemporizador){
    let bandera = 1;
    console.log(temporizadoresCancelados);
    console.log(temporizadorObj.divID);
    for (i = 0; i < temporizadoresCancelados.length; i++){
        console.log(i);
        console.log(temporizadoresCancelados[i]);
        if (temporizadoresCancelados[i] == temporizadorObj.divID){
            console.log(temporizadorObj.divID);
            bandera = 0;
        }
    }
    if (bandera == 1){
        setTimeout(function(){ //utilizamos la funcion setTimeout para pausar el hilo por 1 segundo
            if(temporizadorObj.sint==0){ //Los segundos estan en cero
                if(temporizadorObj.mint > 0 || temporizadorObj.hint > 0){//Tenemos minutos u horas aún, es decir, queda tiempo
        
                    if(temporizadorObj.mint > 0){ //Tenemos minutos
                        temporizadorObj.mint = temporizadorObj.mint-1;  //Restamos un minuto, como ya hemos restado porque si tenemos minutos no necesitamos ver 
                                                                        //las horas
                        temporizadorObj.sint = 59;
                    }else{  //No tenemos minutos, por lo cual lo que tenemos son horas
        
                        temporizadorObj.hint = temporizadorObj.hint -1; //Restamos una hora
                        temporizadorObj.mint = 59;
                        temporizadorObj.sint = 59;
                    }
                }else{  //No tenemos minutos ni horas, y como los segundos ya son cero, quiere decir que se ha agotado el tiempo                
                    temporizadorForm.classList.add("blureado");
                    bodyElement.className = "bodyBlur";
                    temporizadorFinalizado(temporizadorObj);
                    eliminarTemporizador(temporizadorObj, divTemporizador.lastElementChild);
                    return 0;
                }
            }else{  //Aun tenemos segundos, simplemente debemor restar un segundo
                temporizadorObj.sint = temporizadorObj.sint -1;
            }
            divTemporizador.firstElementChild.nextElementSibling.textContent = "Tiempo faltante: " + temporizadorObj.hint + ":" + temporizadorObj.mint + ":" + temporizadorObj.sint; //Reescribimos el tiempo faltante.
            actualizarCadaSegundo(temporizadorObj, divTemporizador); //Lamamos a la funcion nuevamente, de esta manera la funcion actualiza cada 
                                                    //segundo el tiempo faltante.
        },999); //Determinamos la pausa del setTimeout, en este casi mil milisegundos = 1s
    }
}

function poner0sFormulario(){ 
    /*
    Esta funcion llena los valores del formulario con 0, es llamada con un addEventListener al inicio del codigo con el 
    onbodyloaded
    */
    horasFaltantes.value = 0;
    minutosFaltantes.value = 0;
    segundosFaltantes.value = 1;
}

function eliminarTemporizador(temporizadorObj, parrafoCancelar){
    /*
    Esta funcion se llama desde cancelar, en el recuadro que 
    muestra el temporizador contando, le pasamos el parrafo con 
    el boton de cancelar y el objeto temporizador.

    Usamos el parrafo para acceder a su padre, el div, y poder eliminarlo.
    */
    console.log(temporizadorObj);
    console.log("Deletear");
    parrafoCancelar.parentNode.remove();
    temporizadoresCancelados.push(temporizadorObj.divID);
    /*Con la linea anterior añadimos a temporizadoresCancelados(un arreglo), el ID
    del temporizador
    */
}

function temporizadorFinalizado(temporizadorObj){
    let divContenedor = document.createElement("div");
    let parrafoMensaje = document.createElement("p");
    let botonDetenerMusica = document.createElement("button");
    parrafoMensaje.textContent = "Asunto: " + temporizadorObj.texto;
    botonDetenerMusica.textContent = "Detener";
    botonDetenerMusica.classList.add("cancelarBoton");
    botonDetenerMusica.classList.add("basicosBoton");
    divContenedor.classList.add("temporizadorFinalizado");
    //Creamos el nombre del audio
    let audioname = temporizadorObj.audio + ".mp3";
    //Mostrar en pantalla un alert y reproducir musiquita
    let music = new Audio(audioname);
    music.play();
    music.loop = true;
    botonDetenerMusica.addEventListener("click", () => eliminarTemporizadorFinalizado(divContenedor, music));
    divContenedor.appendChild(parrafoMensaje);
    divContenedor.appendChild(botonDetenerMusica);
    contenerTemporizadores.appendChild(divContenedor);
    return 0;
}

function eliminarTemporizadorFinalizado(divContenedor, music){ 
    /* 
        Esta funcion elimina el cuadro que muestra que el temporizador a finalizado, 
        es decir, el que aparece al finalizar el conteo y detiene la musica con 
        el boton detener
    */

    //Modificamos las clases para que el fondo deje de estar borroso
    temporizadorForm.classList.remove("blureado");
    bodyElement.className = "bodyNoBlur";

    //Usamos un console.log para hacer pruebas
    console.log("Eliminando recuadro...");

    /*Eliminamos el recuadro que contiene el temporizador finalizado, 
    es decir, el que contiene el boton detener*/
    divContenedor.remove();

    //Detenemos el loop de la musica y la pausamos
    music.loop = false;
    music.pause();
    return 0;
}
