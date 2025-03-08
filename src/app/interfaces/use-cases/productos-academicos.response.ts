export interface ProductoAcademicoResponse {
  mensaje: string;
  data?: ProductoAcademicoData;
}
export interface ProductoAcademicoData {
  id: number;
  usuario: number;
  descripcion_producto_academico: string;
}
