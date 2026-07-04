export function esMayorDeEdad(fechaNacimiento: string): { valido: boolean; mensaje?: string } {
  const fechaNac = new Date(fechaNacimiento);
  const hoy = new Date();

  if (isNaN(fechaNac.getTime())) {
    return { valido: false, mensaje: 'Fecha de nacimiento inválida' };
  }

  if (fechaNac > hoy) {
    return { valido: false, mensaje: 'La fecha de nacimiento no puede ser futura' };
  }

  const edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mesActual = hoy.getMonth();
  const diaActual = hoy.getDate();
  const mesNac = fechaNac.getMonth();
  const diaNac = fechaNac.getDate();

  const edadAjustada = edad - (mesActual < mesNac || (mesActual === mesNac && diaActual < diaNac) ? 1 : 0);

  if (edadAjustada < 18) {
    return { valido: false, mensaje: 'Debes ser mayor de 18 años para registrarte' };
  }

  return { valido: true };
}
