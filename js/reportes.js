/* =========================================================
   EL PROGRESO — Reporte de Producción de Leche
   Consulta la API (/api/produccion) y arma la tabla del informe
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const tbody       = document.getElementById('report-tbody');
  const statsBox     = document.getElementById('report-stats');
  const refreshBtn   = document.getElementById('refresh-report');
  const printBtn     = document.getElementById('print-report');

  const formatearFecha = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('es-DO', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' });
  };

  async function cargarReporte() {
    tbody.innerHTML = '<tr><td colspan="6" class="table-empty">Consultando la base de datos…</td></tr>';
    statsBox.textContent = '';

    try {
      const res = await fetch('/api/produccion');
      const registros = await res.json();

      if (!res.ok) {
        tbody.innerHTML = '<tr><td colspan="6" class="table-empty">No se pudo generar el informe.</td></tr>';
        return;
      }

      if (!registros.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="table-empty">No hay datos registrados todavía.</td></tr>';
        return;
      }

      tbody.innerHTML = registros.map(r => `
        <tr>
          <td>#${r.id}</td>
          <td>${r.empleado_nombre}</td>
          <td>${formatearFecha(r.fecha)}</td>
          <td>${r.turno}</td>
          <td>${Number(r.cantidad_litros).toFixed(2)}</td>
          <td><span class="status-pill status-${r.estado.toLowerCase()}">${r.estado}</span></td>
        </tr>
      `).join('');

      const totalLitros = registros.reduce((sum, r) => sum + Number(r.cantidad_litros), 0);
      statsBox.textContent = `${registros.length} registro(s) · ${totalLitros.toFixed(2)} litros acumulados`;
    } catch (err) {
      tbody.innerHTML = '<tr><td colspan="6" class="table-empty">No se pudo conectar con el servidor.</td></tr>';
    }
  }

  refreshBtn.addEventListener('click', cargarReporte);
  printBtn.addEventListener('click', () => window.print());

  cargarReporte();
});
