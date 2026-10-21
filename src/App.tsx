/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface Voto {
  id: number;
  nombre: string;
  cafe: boolean;
  te: boolean;
  jugo: boolean;
}

interface Estadisticas {
  totalCafe: number;
  totalTe: number;
  totalJugo: number;
  combinaciones: {
    soloUna: number;
    dosOpciones: number;
    tresOpciones: number;
  };
}

const VOTOS_INICIALES: Voto[] = [
  { id: 1, nombre: 'Carlos Gómez', cafe: true, te: false, jugo: false },
  { id: 2, nombre: 'Ana María Torres', cafe: false, te: true, jugo: false },
  { id: 3, nombre: 'Luis Martínez', cafe: true, te: false, jugo: true },
  { id: 4, nombre: 'Elena Morales', cafe: true, te: true, jugo: true },
  { id: 5, nombre: 'Pedro Ramírez', cafe: false, te: false, jugo: true },
  { id: 6, nombre: 'Sofía Herrera', cafe: false, te: true, jugo: true }
];

function calcularEstadisticas(lista: Voto[]): Estadisticas {
  let totalCafe = 0;
  let totalTe = 0;
  let totalJugo = 0;
  let soloUna = 0;
  let dosOpciones = 0;
  let tresOpciones = 0;

  lista.forEach((v) => {
    if (v.cafe) totalCafe++;
    if (v.te) totalTe++;
    if (v.jugo) totalJugo++;

    const conteo = (v.cafe ? 1 : 0) + (v.te ? 1 : 0) + (v.jugo ? 1 : 0);
    if (conteo === 1) soloUna++;
    else if (conteo === 2) dosOpciones++;
    else if (conteo === 3) tresOpciones++;
  });

  return {
    totalCafe,
    totalTe,
    totalJugo,
    combinaciones: { soloUna, dosOpciones, tresOpciones }
  };
}

export default function App() {
  const [paginaActual, setPaginaActual] = useState<'encuesta' | 'estadisticas'>('encuesta');

  const [nombre, setNombre] = useState('');
  const [tomaCafe, setTomaCafe] = useState(false);
  const [tomaTe, setTomaTe] = useState(false);
  const [tomaJugo, setTomaJugo] = useState(false);

  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const [votos, setVotos] = useState<Voto[]>(() => {
    try {
      const guardados = localStorage.getItem('encuesta_bebidas');
      if (guardados) {
        return JSON.parse(guardados);
      }
    } catch (e) {
      console.error(e);
    }
    return VOTOS_INICIALES;
  });

  const totalVotantes = votos.length;
  const estadisticas = calcularEstadisticas(votos);

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    if (!tomaCafe && !tomaTe && !tomaJugo) {
      setMensajeError('Por favor selecciona al menos una bebida: Café, Té o Jugo.');
      return;
    }

    const nuevoId = votos.length > 0 ? Math.max(...votos.map(v => v.id)) + 1 : 1;

    const nuevoVoto: Voto = {
      id: nuevoId,
      nombre: nombre.trim() || 'Participante anónimo',
      cafe: tomaCafe,
      te: tomaTe,
      jugo: tomaJugo
    };

    const nuevosVotos = [nuevoVoto, ...votos];
    setVotos(nuevosVotos);

    try {
      localStorage.setItem('encuesta_bebidas', JSON.stringify(nuevosVotos));
    } catch (err) {
      console.error(err);
    }

    setMensajeExito('¡Tu voto se ha guardado correctamente!');
    setNombre('');
    setTomaCafe(false);
    setTomaTe(false);
    setTomaJugo(false);
  };

  return (
    <div>
      <header>
        <h1>Encuesta de Preferencias: Café, Té y Jugo</h1>
      </header>

      <main>
        <nav>
          <button
            type="button"
            className={`btn-navegacion ${paginaActual === 'encuesta' ? 'activo' : ''}`}
            onClick={() => {
              setPaginaActual('encuesta');
              setMensajeError('');
            }}
          >
            Página 1: Encuesta
          </button>
          <button
            type="button"
            className={`btn-navegacion ${paginaActual === 'estadisticas' ? 'activo' : ''}`}
            onClick={() => {
              setPaginaActual('estadisticas');
              setMensajeError('');
            }}
          >
            Página 2: Estadísticas
          </button>
        </nav>

        {paginaActual === 'encuesta' && (
          <div>
            <div className="seccion">
              <h2>Formulario de Encuesta</h2>
              <p style={{ marginBottom: '15px' }}>
                Por favor responde la encuesta seleccionando las bebidas que acostumbras tomar. Puedes marcar una sola o varias opciones.
              </p>

              {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}
              {mensajeError && <div className="mensaje-error">{mensajeError}</div>}

              <form onSubmit={manejarEnvio}>
                <div className="campo-formulario">
                  <label htmlFor="nombre">Tu Nombre:</label>
                  <input
                    type="text"
                    id="nombre"
                    placeholder="Escribe tu nombre (opcional)"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>

                <div className="campo-formulario">
                  <label>Selecciona las bebidas que tomas (puedes elegir más de una):</label>
                  <div className="grupo-opciones">
                    <label className="opcion-checkbox">
                      <input
                        type="checkbox"
                        checked={tomaCafe}
                        onChange={(e) => setTomaCafe(e.target.checked)}
                      />
                      <span>Tomar café</span>
                    </label>

                    <label className="opcion-checkbox">
                      <input
                        type="checkbox"
                        checked={tomaTe}
                        onChange={(e) => setTomaTe(e.target.checked)}
                      />
                      <span>Tomar té</span>
                    </label>

                    <label className="opcion-checkbox">
                      <input
                        type="checkbox"
                        checked={tomaJugo}
                        onChange={(e) => setTomaJugo(e.target.checked)}
                      />
                      <span>Tomar jugo</span>
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn-enviar">
                  Enviar mi voto
                </button>
              </form>
            </div>

            <div className="seccion">
              <h2>Resumen de Opciones Escogidas</h2>

              <div className="contenedor-resumen">
                <div className="tarjeta-resumen">
                  <div className="etiqueta">Solo una opción</div>
                  <div className="numero">{estadisticas.combinaciones.soloUna}</div>
                  <div className="etiqueta">
                    {totalVotantes > 0
                      ? `${Math.round((estadisticas.combinaciones.soloUna / totalVotantes) * 100)}% del total`
                      : '0%'}
                  </div>
                </div>

                <div className="tarjeta-resumen">
                  <div className="etiqueta">Dos opciones</div>
                  <div className="numero">{estadisticas.combinaciones.dosOpciones}</div>
                  <div className="etiqueta">
                    {totalVotantes > 0
                      ? `${Math.round((estadisticas.combinaciones.dosOpciones / totalVotantes) * 100)}% del total`
                      : '0%'}
                  </div>
                </div>

                <div className="tarjeta-resumen">
                  <div className="etiqueta">Las tres opciones</div>
                  <div className="numero">{estadisticas.combinaciones.tresOpciones}</div>
                  <div className="etiqueta">
                    {totalVotantes > 0
                      ? `${Math.round((estadisticas.combinaciones.tresOpciones / totalVotantes) * 100)}% del total`
                      : '0%'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {paginaActual === 'estadisticas' && (
          <div>
            <div className="seccion">
              <h2>Estadísticas de la Encuesta</h2>

              <p style={{ marginBottom: '15px' }}>
                A continuación se muestran los totales de votos recibidos para cada una de las opciones:
              </p>

              <div className="contenedor-resumen">
                <div className="tarjeta-resumen">
                  <div className="etiqueta">Personas que toman Café</div>
                  <div className="numero">{estadisticas.totalCafe}</div>
                  <div className="etiqueta">votos registrados</div>
                </div>

                <div className="tarjeta-resumen">
                  <div className="etiqueta">Personas que toman Té</div>
                  <div className="numero">{estadisticas.totalTe}</div>
                  <div className="etiqueta">votos registrados</div>
                </div>

                <div className="tarjeta-resumen">
                  <div className="etiqueta">Personas que toman Jugo</div>
                  <div className="numero">{estadisticas.totalJugo}</div>
                  <div className="etiqueta">votos registrados</div>
                </div>
              </div>

              <h3 style={{ marginTop: '25px' }}>Distribución por cantidad de opciones elegidas:</h3>
              <div className="contenedor-resumen">
                <div className="tarjeta-resumen">
                  <div className="etiqueta">Eligieron 1 opción</div>
                  <div className="numero">{estadisticas.combinaciones.soloUna}</div>
                </div>
                <div className="tarjeta-resumen">
                  <div className="etiqueta">Eligieron 2 opciones</div>
                  <div className="numero">{estadisticas.combinaciones.dosOpciones}</div>
                </div>
                <div className="tarjeta-resumen">
                  <div className="etiqueta">Eligieron las 3 opciones</div>
                  <div className="numero">{estadisticas.combinaciones.tresOpciones}</div>
                </div>
              </div>
            </div>

            <div className="seccion">
              <h2>Votos por participante</h2>

              {votos.length === 0 ? (
                <p style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fce4ec', marginTop: '10px' }}>
                  Aún no hay votos registrados en la base de datos.
                </p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Opciones Elegidas</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {votos.map((voto) => {
                      const seleccionadas: string[] = [];
                      if (voto.cafe) seleccionadas.push('Café');
                      if (voto.te) seleccionadas.push('Té');
                      if (voto.jugo) seleccionadas.push('Jugo');

                      return (
                        <tr key={voto.id}>
                          <td><strong>{voto.id}</strong></td>
                          <td>{voto.nombre}</td>
                          <td>
                            <strong>{seleccionadas.join(', ')}</strong>
                          </td>
                          <td>{seleccionadas.length} {seleccionadas.length === 1 ? 'opción' : 'opciones'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
