/* =========================================================
   EL PROGRESO — Reporte de Producción de Leche
   Consulta la API (/api/produccion) y arma la tabla del informe
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const tbody       = document.getElementById('report-tbody');
  const statsBox     = document.getElementById('report-stats');
  const refreshBtn   = document.getElementById('refresh-report');
  const excelBtn     = document.getElementById('export-excel');
  const pdfBtn       = document.getElementById('export-pdf');

  let ultimosRegistros = [];

  const formatearFecha = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('es-DO', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' });
  };

  async function cargarReporte() {
    tbody.innerHTML = '<tr><td colspan="7" class="table-empty">Consultando la base de datos…</td></tr>';
    statsBox.textContent = '';

    try {
      const res = await fetch('/api/produccion');
      const registros = await res.json();

      if (!res.ok) {
        tbody.innerHTML = '<tr><td colspan="7" class="table-empty">No se pudo generar el informe.</td></tr>';
        return;
      }

      if (!registros.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="table-empty">No hay datos registrados todavía.</td></tr>';
        ultimosRegistros = [];
        return;
      }

      ultimosRegistros = registros;

      tbody.innerHTML = registros.map(r => `
        <tr>
          <td>#${r.id}</td>
          <td>${r.empleado_nombre}</td>
          <td>${formatearFecha(r.fecha)}</td>
          <td>${r.turno}</td>
          <td>${Number(r.cantidad_litros).toFixed(2)}</td>
          <td><span class="status-pill status-${r.estado.toLowerCase()}">${r.estado}</span></td>
          <td class="obs-cell" title="${r.observaciones}">${r.observaciones}</td>
        </tr>
      `).join('');

      const totalLitros = registros.reduce((sum, r) => sum + Number(r.cantidad_litros), 0);
      statsBox.textContent = `${registros.length} registro(s) · ${totalLitros.toFixed(2)} litros acumulados`;
    } catch (err) {
      tbody.innerHTML = '<tr><td colspan="7" class="table-empty">No se pudo conectar con el servidor.</td></tr>';
    }
  }

  /* ---------- Exportar a Excel (SheetJS) ---------- */
  function exportarExcel() {
    if (!ultimosRegistros.length) {
      alert('No hay registros para exportar.');
      return;
    }

    const filas = ultimosRegistros.map(r => ({
      'Código': r.id,
      'Nombre': r.empleado_nombre,
      'Fecha': formatearFecha(r.fecha),
      'Turno': r.turno,
      'Cantidad (L)': Number(r.cantidad_litros),
      'Estado': r.estado,
      'Observaciones': r.observaciones,
    }));

    const hoja = XLSX.utils.json_to_sheet(filas);
    hoja['!cols'] = [{ wch: 10 }, { wch: 20 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 40 }];

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Producción de leche');

    const fechaArchivo = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(libro, `reporte_produccion_leche_${fechaArchivo}.xlsx`);
  }

  /* ---------- Descargar PDF (jsPDF + AutoTable) ---------- */
  function exportarPDF() {
    if (!ultimosRegistros.length) {
      alert('No hay registros para exportar.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(14);
    doc.text('Finca El Progreso — Informe de producción de leche', 14, 16);
    doc.setFontSize(9);
    doc.text(`Generado el ${new Date().toLocaleDateString('es-DO')} · ${statsBox.textContent}`, 14, 22);

    doc.autoTable({
      startY: 28,
      head: [['Código', 'Nombre', 'Fecha', 'Turno', 'Cantidad (L)', 'Estado', 'Observaciones']],
      body: ultimosRegistros.map(r => [
        `#${r.id}`,
        r.empleado_nombre,
        formatearFecha(r.fecha),
        r.turno,
        Number(r.cantidad_litros).toFixed(2),
        r.estado,
        r.observaciones,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [76, 107, 63] },
    });

    const fechaArchivo = new Date().toISOString().slice(0, 10);
    doc.save(`reporte_produccion_leche_${fechaArchivo}.pdf`);
  }

  refreshBtn.addEventListener('click', cargarReporte);
  excelBtn.addEventListener('click', exportarExcel);
  pdfBtn.addEventListener('click', exportarPDF);

  cargarReporte();
});