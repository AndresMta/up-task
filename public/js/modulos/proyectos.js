import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar) {
    btnEliminar.addEventListener('click', event => {
        const urlProyecto = event.target.dataset.proyectoUrl;
        console.log(urlProyecto);

        Swal.fire({
            title: 'Desea borrar el Proyecto?',
            text: "Un proyecto eliminado no se puede recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const url = `${location.origin}/proyectos/${urlProyecto}`;
                
                axios.delete(url, { params: {urlProyecto} })
                    .then(() => {
                        Swal.fire(
                            'Eliminado!',
                            'El proyecto ha sido borrado.',
                            'success')
                        .then(() => {
                            location.href = '/';
                        });
                    })
                    .catch(() => {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un Error',
                            text: 'No se pudo eliminar el proyecto'
                        })
                    })
            }
        });
    });
}

export default btnEliminar;
