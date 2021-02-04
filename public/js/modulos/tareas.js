import axios from 'axios';
import Swal from 'sweetalert2';
import { actualizarAvance } from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if(tareas) {
    tareas.addEventListener('click', e => {
        if(e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            
            const url = `${location.origin}/tareas/${idTarea}`;
            
            axios.patch(url, { idTarea })
                .then((respuesta) => {
                    if(respuesta.status === 200) {
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                });
        }

        if(e.target.classList.contains('fa-trash')) {
            const tareaHtml = e.target.parentElement.parentElement;
            const idTarea = tareaHtml.dataset.tarea;
            console.log(idTarea);

            Swal.fire({
                title: 'Desea borrar la tarea?',
                text: "Una tarea eliminada no se puede recuperar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    const url = `${location.origin}/tareas/${idTarea}`;
                    
                    axios.delete(url, { params: { idTarea } })
                        .then(function(respuesta) {
                            //if(respuesta.status === 200) {
                                tareaHtml.parentElement.removeChild(tareaHtml);
                                actualizarAvance();
                            //}
                        })
                        .catch(() => {
                            Swal.fire({
                                type: 'error',
                                title: 'Hubo un Error',
                                text: 'No se pudo eliminar la tarea'
                            })
                        })
                }
            });
        }
    });
}

export default tareas;