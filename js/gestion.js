/* =========================================================
   EL PROGRESO — Gestión de Producción de Leche
   Consume la API REST (/api/produccion, /api/empleados)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const form           = document.getElementById('produccion-form');
  const formHeading     = document.getElementById('form-heading');
  const idField         = document.getElementById('produccion-id');
  const fechaField       = document.getElementById('fecha');
  const turnoField       = document.getElementById('turno');
  const empleadoField    = document.getElementById('empleado_id');
  const cantidadField    = document.getElementById('cantidad_litros');
  const estadoField      = document.getElementById('estado');
  const obsField          = document.getElementById('observaciones');
  const obsCount          = document.getElementById('obs-count');
  const feedback         = document.getElementById('form-feedback');
  const submitBtn        = document.getElementById('submit-btn');
  const cancelBtn        = document.getElementById('cancel-edit');
  const tbody            = document.getElementById('produccion-tbody');
  const refreshBtn       = document.getElementById('refresh-btn');

  const errorEls = {
    fecha: document.getElementById('err-fecha'),
    turno: document.getElementById('err-turno'),
    empleado_id: document.getElementById('err-empleado_id'),
    cantidad_litros: document.getElementById('err-cantidad_litros'),
    observaciones: document.getElementById('err-observaciones'),
  };

  let empleadosCache = [];

  /* ---------- Utilidades ---------- */
  const limpiarErroresCampos = () => {
    Object.values(errorEls).forEach(el => { el.textContent = ''; });
  };

  const limpiarErrores = () => {
    limpiarErroresCampos();
    feedback.textContent = '';
    feedback.style.color = '';
  };

  const mostrarMensaje = (texto, tipo = 'exito') => {
    feedback.textContent = texto;
    feedback.style.color = tipo === 'error' ? '#A3452B' : '';
  };

  const formatearFecha = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('es-DO', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' });
  };

  obsField.addEventListener('input', () => {
    obsCount.textContent = `${obsField.value.length}/200`;
  });
  function validarFormulario() {
    limpiarErrores();
    let valido = true;

    if (!fechaField.value) {
      errorEls.fecha.textContent = 'La fecha es obligatoria.';
      valido = false;
    }

    if (!turnoField.value) {
      errorEls.turno.textContent = 'Selecciona un turno.';
      valido = false;
    }

    if (!empleadoField.value) {
      errorEls.empleado_id.textContent = 'Selecciona un empleado.';
      valido = false;
    }

    const litros = parseFloat(cantidadField.value);
    if (!cantidadField.value) {
      errorEls.cantidad_litros.textContent = 'La cantidad de litros es obligatoria.';
      valido = false;
    } else if (isNaN(litros) || litros <= 0) {
      errorEls.cantidad_litros.textContent = 'Debe ser un número mayor a 0.';
      valido = false;
    } else if (litros > 99999.99) {
      errorEls.cantidad_litros.textContent = 'El valor es demasiado alto.';
      valido = false;
    } else if (!/^\d{1,5}(\.\d{1,2})?$/.test(cantidadField.value)) {
      errorEls.cantidad_litros.textContent = 'Máximo 2 decimales.';
      valido = false;
    }

    const obs = obsField.value.trim();
    if (!obs) {
      errorEls.observaciones.textContent = 'Las observaciones son obligatorias.';
      valido = false;
    } else if (obs.length < 5) {
      errorEls.observaciones.textContent = 'Escribe al menos 5 caracteres.';
      valido = false;
    } else if (obs.length > 200) {
      errorEls.observaciones.textContent = 'Máximo 200 caracteres.';
      valido = false;
    }

    return valido;
  }

  /* ---------- Cargar empleados en el <select> ---------- */
  async function cargarEmpleados() {
    try {
      const res = await fetch('/api/empleados');
      empleadosCache = await res.json();
      empleadoField.innerHTML = '<option value="">Selecciona un empleado</option>' +
        empleadosCache.map(e => `<option value="${e.id}">${e.nombre}${e.cargo ? ' — ' + e.cargo : ''}</option>`).join('');
    } catch (err) {
      empleadoField.innerHTML = '<option value="">No se pudieron cargar los empleados</option>';
    }
  }

  /* ---------- Cargar y pintar la tabla de registros ---------- */
  async function cargarRegistros() {
    tbody.innerHTML = '<tr><td colspan="7" class="table-empty">Cargando registros…</td></tr>';
    try {
      const res = await fetch('/api/produccion');
      const registros = await res.json();

      if (!registros.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="table-empty">Todavía no hay registros.</td></tr>';
        return;
      }

      tbody.innerHTML = registros.map(r => `
        <tr>
          <td>#${r.id}</td>
          <td>${formatearFecha(r.fecha)}</td>
          <td>${r.turno}</td>
          <td>${r.empleado_nombre}</td>
          <td>${Number(r.cantidad_litros).toFixed(2)}</td>
          <td><span class="status-pill status-${r.estado.toLowerCase()}">${r.estado}</span></td>
          <td class="obs-cell" title="${r.observaciones}">${r.observaciones}</td>
          <td class="table-actions">
            <button type="button" class="btn-icon" data-action="editar" data-id="${r.id}" aria-label="Editar registro ${r.id}">✎</button>
            <button type="button" class="btn-icon btn-icon-danger" data-action="eliminar" data-id="${r.id}" aria-label="Eliminar registro ${r.id}">🗑</button>
          </td>
        </tr>
      `).join('');
    } catch (err) {
      tbody.innerHTML = '<tr><td colspan="7" class="table-empty">No se pudo conectar con el servidor.</td></tr>';
    }
  }

  /* ---------- Modo edición ---------- */
  function entrarModoEdicion(registro) {
    idField.value = registro.id;
    fechaField.value = registro.fecha.substring(0, 10);
    turnoField.value = registro.turno;
    empleadoField.value = registro.empleado_id;
    cantidadField.value = Number(registro.cantidad_litros).toFixed(2);
    estadoField.value = registro.estado;
    obsField.value = registro.observaciones || '';
    obsCount.textContent = `${obsField.value.length}/200`;

    formHeading.textContent = `Editando registro #${registro.id}`;
    submitBtn.textContent = 'Actualizar registro';
    cancelBtn.hidden = false;
    limpiarErrores();
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function salirModoEdicion() {
    form.reset();
    idField.value = '';
    obsCount.textContent = '0/200';
    formHeading.textContent = 'Agregar registro';
    submitBtn.textContent = 'Guardar registro';
    cancelBtn.hidden = true;
    limpiarErroresCampos();
  }

  cancelBtn.addEventListener('click', () => {
    salirModoEdicion();
    feedback.textContent = '';
  });

  /* ---------- Envío del formulario (crear / actualizar) ---------- */
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validarFormulario()) {
      mostrarMensaje('Revisa los campos marcados en rojo.', 'error');
      return;
    }

    const payload = {
      fecha: fechaField.value,
      turno: turnoField.value,
      empleado_id: empleadoField.value,
      cantidad_litros: cantidadField.value,
      estado: estadoField.value,
      observaciones: obsField.value.trim(),
    };

    const editando = !!idField.value;
    const url = editando ? `/api/produccion/${idField.value}` : '/api/produccion';
    const method = editando ? 'PUT' : 'POST';

    submitBtn.disabled = true;
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        const texto = (data.errores && data.errores.join(' ')) || data.error || 'No se pudo guardar el registro.';
        mostrarMensaje(texto, 'error');
        return;
      }

      mostrarMensaje(data.mensaje || 'Guardado correctamente.');
      salirModoEdicion();
      cargarRegistros();
    } catch (err) {
      mostrarMensaje('No se pudo conectar con el servidor.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });

  /* ---------- Acciones de la tabla (editar / eliminar) ---------- */
  tbody.addEventListener('click', async (event) => {
    const btn = event.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;

    if (btn.dataset.action === 'editar') {
      try {
        const res = await fetch(`/api/produccion/${id}`);
        const registro = await res.json();
        if (res.ok) entrarModoEdicion(registro);
      } catch (err) {
        mostrarMensaje('No se pudo cargar el registro para editar.', 'error');
      }
    }

    if (btn.dataset.action === 'eliminar') {
      if (!confirm(`¿Eliminar el registro #${id}? Esta acción no se puede deshacer.`)) return;
      try {
        const res = await fetch(`/api/produccion/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok) {
          mostrarMensaje(data.mensaje || 'Registro eliminado.');
          if (idField.value === id) salirModoEdicion();
          cargarRegistros();
        } else {
          mostrarMensaje(data.error || 'No se pudo eliminar.', 'error');
        }
      } catch (err) {
        mostrarMensaje('No se pudo conectar con el servidor.', 'error');
      }
    }
  });

  refreshBtn.addEventListener('click', cargarRegistros);

  /* ---------- Inicio ---------- */
  cargarEmpleados();
  cargarRegistros();
});
