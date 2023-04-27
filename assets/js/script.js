// Logica
let saldo = 0;
let presupuesto = 0;
let gastos = 0;

const movimientos = [];

function formatearDinero (valor) {
  return valor.toLocaleString("es", {
    style: "currency",
    currency: "CLP",
    currencyDisplay: "code"
  });
}

function actualizarResumen () {
  let sumGastos = 0;

  for (let i = 0; i < movimientos.length; i++) {
    const movimiento = movimientos[i];
    sumGastos += movimiento.valor;
  }

  gastos = sumGastos;
  saldo = presupuesto - gastos;
}

// Interfaz de Usuario (UI) y DOM
function dibujarResumen () {
  document.getElementById('saldo').innerText = formatearDinero(saldo);
  document.getElementById('presupuesto').innerText = formatearDinero(presupuesto);
  document.getElementById('gastos').innerText = formatearDinero(gastos);
}

function borrarMovimiento(indice) {
  movimientos.splice(indice, 1)
  actualizarResumen()

  dibujarResumen()
  dibujarMovimientos()
}

function dibujarMovimiento (movimiento, indice) {
  const movimientosDOM = document.getElementById('movimientos')

  movimientosDOM.innerHTML += `
    <div class="card mt-2">
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <div>${movimiento.nombre}</div>
          <div>
            ${formatearDinero(movimiento.valor)}
            <button class="btn btn-outline-danger" onclick="borrarMovimiento(${indice})"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  `
}

function dibujarMovimientos () {
  const movimientosDOM = document.getElementById('movimientos')
  movimientosDOM.innerText = ''

  for (let i = 0; i < movimientos.length; i++) {
    const movimiento = movimientos[i];
    dibujarMovimiento(movimiento, i);
  }
}

dibujarResumen()
dibujarMovimientos()

window.onload = function() {
  document.getElementById('formGastos').addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nuevoMovimiento = {
      nombre: document.getElementById('nombreGasto').value,
      valor: parseInt(document.getElementById('valorGasto').value),
    }

    if (saldo >  nuevoMovimiento.valor) {
      document.getElementById('nombreGasto').value = ''
      document.getElementById('valorGasto').value = ''

      movimientos.push(nuevoMovimiento)
      actualizarResumen()

      dibujarMovimiento(nuevoMovimiento, movimientos.length -1)
      dibujarResumen()
      bootstrap.Modal.getInstance(document.getElementById('modalFormGasto')).hide()
    } else {
      new bootstrap.Modal('#modalError').show()
    }
  });

  document.getElementById('formPresupuesto').addEventListener("submit", function (evento) {
    evento.preventDefault()

    const valorPrespuesto = parseInt(document.getElementById('valorPresupuesto').value)
    document.getElementById('valorPresupuesto').value = ''

    presupuesto += valorPrespuesto

    actualizarResumen()
    dibujarResumen()
    bootstrap.Modal.getInstance(document.getElementById('modalFormPresupuesto')).hide()
  })
}