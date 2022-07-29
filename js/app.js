//Declaracion de variables globales, elementos del DOM
let segundosFaltantes = document.querySelector("#segundos");
let minutosFaltantes = document.querySelector("#minutos");
let horasFaltantes = document.querySelector("#horas");
let boton = document.querySelector("#btnIniciar");
let tiempoParrafo = document.querySelector("#tiempoParrafo");
let horasParrafo = document.querySelector("#horasParrafo");
let minutosParrafo = document.querySelector("#minutosParrafo");
let segundosParrafo = document.querySelector("#segundosParrafo");
let seleccionarAudio = document.querySelector("#seleccionarAudio");
let notaform = document.querySelector("#notaform");
let contenerTemporizadores = document.querySelector("#contenerTemporizadores");

//Escuchadores
boton.addEventListener("click", iniciarTemporizador);
document.addEventListener("DOMContentLoaded", poner0sFormulario);

//Clases

class Temporizador{
    constructor(hint, mint,sint, audioForm, recordarTexto){
        this.hint = hint;
        this.mint = mint;
        this.sint = sint;
        this.audio = audioForm;
        this.texto = recordarTexto;
    }
}

//funciones

function iniciarTemporizador(e){//Se inicia al hacer click en el boton, obtiene los valores del formulario y previene 
                                //la accion por default. Después llama a la funcion revision, que valida el formulario,
                                //y le pasa los datos como parametros.
    e.preventDefault();
    let mint = parseInt(minutosFaltantes.value);
    let hint = parseInt(horasFaltantes.value);
    let sint = parseInt(segundosFaltantes.value);
    let audioForm = seleccionarAudio.value;
    let textoloco = notaform.value;
    let temporizadorObj = new Temporizador (hint, mint, sint, audioForm, textoloco);
    revision(temporizadorObj);
}

function revision(temporizadorObj){  //Es llamada para validar los datos del formulario. Esta funcion llama a la funcion
                                    //actualizar cada segundo, que actualiza cada segundo el temporizador
    if (temporizadorObj.mint<60 && temporizadorObj.sint <60){ //revisa que los minutos y segundos no superen el 59

        if (Number.isInteger(temporizadorObj.mint) && Number.isInteger(temporizadorObj.hint) && Number.isInteger(temporizadorObj.sint)){    //Revisa que todos los numeros 
                                                                                            //sean enteros y no contengan punto decimal
            let divTemporizador = crearDiv(temporizadorObj);
            divTemporizador.textContent = "Tiempo faltante: " + temporizadorObj.hint + ":" + temporizadorObj.mint + ":" + temporizadorObj.sint;
            actualizarCadaSegundo(temporizadorObj, divTemporizador);       
        }else{
            alert("Por favor, solo ingresa números enteros! Así es como funciona el tiempo")
        }
    }else{
        alert("Por favor, ingresa un tiempo valido!!!");
    }
}

function actualizarCadaSegundo(temporizadorObj, divTemporizador){
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
                    //Creamos el nombre del audio
                    let audioname = temporizadorObj.audio + ".mp3";
                    //Mostrar en pantalla un alert y reproducir musiquita
                    const music = new Audio(audioname);
                    music.play();
                    music.loop = true;
                    return 0;
            }
        }else{  //Aun tenemos segundos, simplemente debemor restar un segundo
            temporizadorObj.sint = temporizadorObj.sint -1;
        }
        divTemporizador.textContent = "Tiempo faltante: " + temporizadorObj.hint + ":" + temporizadorObj.mint + ":" + temporizadorObj.sint; //Reescribimos el tiempo faltante.
        actualizarCadaSegundo(temporizadorObj, divTemporizador); //Lamamos a la funcion nuevamente, de esta manera la funcion actualiza cada 
                                                //segundo el tiempo faltante.
    },1000); //Determinamos la pausa del setTimeout, en este casi mil milisegundos = 1s
}

function crearDiv(temporizadorObj){
    let div = document.createElement('div'); //Creamos el div temporizador
    let parrafoAsunto = document.createElement("p"); //Creamos el parrafo que contendra la nota o texto
    parrafoAsunto.innerText = temporizadorObj.texto; //Añadimos el texto al parrafo
    let parrafoConteo = document.createElement("p"); //Creamos el parrafo donde se realizara el conteo
    div.classList.add("card_temporizador"); //Le damos una clase al DIV

    div.appendChild(parrafoAsunto); //Añadimos los parrados como hijos al temporizador
    div.appendChild(parrafoConteo);
    contenerTemporizadores.appendChild(div); //Añadimos el div al contenedor de DIVS
    return div;
}

function poner0sFormulario(){
    horasFaltantes.value = 0;
    minutosFaltantes.value = 0;
    segundosFaltantes.value = 0;
}
