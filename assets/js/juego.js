const miModulo = (() => {
  "use strict"

  let deck = [];
  const tipos = ["C", "D", "H", "S"],
        especiales = ["A", "J", "Q", "K"];

  let puntosJugadores = [];

  // Referencias del HTML

  const btnNew = document.querySelector("#btnNew"),
        btnPedir = document.querySelector("#btnPedir"),
        btnStop = document.querySelector("#btnStop");

  const divCartasJugadores = document.querySelectorAll('.divCartas'),
        puntos = document.querySelectorAll("small");

  // Función que inicia el juego 
  const inicializarJuego = ( numJugadores = 2) => {
    deck = crearDeck();

    puntosJugadores = [];
    for( let i = 0; i< numJugadores; i++) {
      puntosJugadores.push(0);
    }

    puntos.forEach(  elem => elem.innerText = 0);
    divCartasJugadores.forEach( elem => elem.innerHTML = '' );

    btnPedir.disabled = false;
    btnStop.disabled = false;
  }

  // Esta funcion crea un nuevo deck
  const crearDeck = () => {
    deck = [];
    for (let i = 2; i <= 10; i++) {
      for (let tipo of tipos) {
        deck.push(i + tipo);
      }
    }

    for (let tipo of tipos) {
      for (let esp of especiales) {
        deck.push(esp + tipo);
      }
    }

    return _.shuffle(deck);
  };

  // Esta función me permite tomar una carta

  const pedirCarta = () => {
    if (deck.length === 0) {
      throw "No hay cartas en el deck";
    }

    return deck.pop();
  };

  const valorCarta = (carta) => {
    const valor = carta.substring(0, carta.length - 1);

    return isNaN(valor) ? (valor === "A" ? 11 : 10) : valor * 1;
  };

// Turno: 0 = primer jugador y el último será el pc
  const acumularPuntos = ( carta, turno ) => {
    puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
    puntos[turno].innerText = puntosJugadores[turno];
    return puntosJugadores[turno];
  }

  const crearCarta = ( carta, turno) => {
    const imgCarta = document.createElement("img");
    imgCarta.src = `assets/cartas/${carta}.png`;
    imgCarta.classList.add("carta");
    divCartasJugadores[turno].append( imgCarta );
  };


  const determinarGanador = () => {

    const [ puntosMinimos, puntosPC ] = puntosJugadores;

    setTimeout(() => {
      if (puntosPC === puntosMinimos) {
        alert("Empate!");
      } else if (puntosMinimos > 21) {
        alert("PC gana, has perdido");
      } else if (puntosPC > 21) {
        alert("Genial, has ganado!");
      } else {
        alert("PC gana, has perdido");
      }
    }, 10);
  }

  // Turno de la pc

  const turnoPc = (puntosMinimos) => {

    let puntosPC = 0;

    do {
      const carta = pedirCarta();
      puntosPC = acumularPuntos(carta, puntosJugadores.length - 1);
      crearCarta(carta, puntosJugadores.length - 1);

    } while (puntosPC < puntosMinimos && puntosMinimos <= 21);

    determinarGanador();

  };

  // Eventos

  btnPedir.addEventListener("click", () => {
    const carta = pedirCarta(); 
    const puntosJugador = acumularPuntos( carta, 0 );

    crearCarta( carta, 0 );

    if (puntosJugador > 21) {
      console.warn("Lo siento, has perdido");
      btnPedir.disabled = true;
      btnStop.disabled = true;
      turnoPc(puntosJugador);
    } else if (puntosJugador === 21) {
      console.warn("Genial, has ganado!");
      btnPedir.disabled = true;
      btnStop.disabled = true;
      turnoPc(puntosJugador);
    }
  });

  btnStop.addEventListener("click", () => {
    
    btnPedir.disabled = true;
    btnStop.disabled = true;

    turnoPc(puntosJugadores[0]);
  });

  btnNew.addEventListener("click", () => {
    inicializarJuego();

  });

  return {
    nuevoJuego: inicializarJuego
  };

})();
