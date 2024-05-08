
import { nanoid } from '../../node_modules/nanoid/nanoid.js'

//* Seleccionar los elementos del DOM.
// Seleccionar form que añade nuevas tareas. 
const formNewTask = document.querySelector('.create-task')
console.log (formNewTask)

// Seleccionar el elemento HTML (section) que incluye la lista de tareas. 
const listTask = document.querySelector('.list-tasks')
console.log (listTask)

// Seleccionar el select de filtrado de tareas.
const selectFilter = document.getElementById('Frecuency')
console.log (selectFilter)

// Seleccionar el input (buscador).
const searchInput = document.getElementById('search')
console.log (searchInput)

let allTasks

//* LocalStorage
const getTasksFromLocalStorage = () => {  
    // Si en el localStore no hay nada que hay se guarde un array vacío (no null). 
    if (localStorage.getItem('allTasks') === null) {
        allTasks = []
    }else{
        allTasks = JSON.parse(localStorage.getItem('allTasks'))
    }   
}

//* Cada vez que metamos una tarea nueva o eliminemos tarea, hay que actualizar el localStorage.
const updateTaskToLocalStorage = () => {
     // Después de añadir nuevo elemento se mete en localStorage el array de tareas actualizado.
     localStorage.setItem('allTasks', JSON.stringify(allTasks))
}

//* Función para eliminar tareas.
const deleteTask = (deleteID)=>{
    //? Método 1: genera un array nuevo con todas las tareas sobre las que no se ha hecho click para eliminarlas.
    allTasks = allTasks.filter ((taskObj) => { return taskObj.id !== deleteID})
    console.log(allTasks)

    //? Método 2 (alternativo)
    // for (let i = 0; i < allTasks.length; i++){

    //     if (allTasks[i].id === deleteID ){
    //         allTasks.splice(i,1)
    //     }
    // }   
    // console.log (allTasks)

    //? Método 3 (alternativo)
    // allTasks.forEach((taskObj, i) => {

    //     if(taskObj.id === deleteID) {
    //         allTasks.splice(i, 1)
    //     }
    
    updateTaskToLocalStorage()

    printTasks(allTasks)
}

//* Crear el HTML de las tareas (articles)
const createTaskHTML = (task) => {
    // Crear en cada vuelta el article de cada tarea.
    const taskHTML = document.createElement('article')
    console.log (taskHTML)

    // Añadirle al article sus clases.
    taskHTML.className = 'article.task'
    // console.log (taskHTML.className)
    console.log (taskHTML)
    
    // Añadir el contenido HTML
    taskHTML.innerHTML = `
    <article class="task">
        <p><i class="bi bi-caret-right"></i>
        ${task.task}</p>
        <i class="bi bi-trash deleteIcon"></i>              
    </article>       
    ` 
    // Seleccionar el icono de eliminar que crea en cada vuelta del bucle.
    const deleteTaskIcon = taskHTML.querySelector('.deleteIcon')

    // Escuchar el icono de eliminar en cada vuelta del bucle, si se hace click sobre él, se lanza una función encargada de eliminar la tarea.
    deleteTaskIcon.addEventListener('click', () => {deleteTask(task.id)})
    console.log (task.id)     

    return taskHTML
}

//* Poner de color la tarea según la prioridad.     
const colorTask = (taskpriority, taskHTML)=> {    
    // Guardar en una variable el valor escogido en el select (al terminar eliminar).
    // const priorityValue = formNewTask.priority.value
    // console.log (priorityValue)

    // Colores
    const colors = {
        colorUrgentTask: 'hsla(352, 76%, 48%, 0.732)',
        colorIntermediateTask: 'hsla(42, 95%, 57%, 0.755)',
        colorNormalTask: 'hsla(127, 59%, 73%, 0.88)'
    }

    // Según la prioridad se pone la tarea de un color, usando el siguiente condicional. 
    if (taskpriority === 'urgent'){
        taskHTML.style.backgroundColor = colors.colorUrgentTask
    }else if (taskpriority === 'intermediate'){
        taskHTML.style.backgroundColor = colors.colorIntermediateTask
    }else {
        taskHTML.style.backgroundColor =  colors.colorNormalTask
    }
}

//* Función para sacar en pantalla las tareas. 
const printTasks = (array)=>{
    //* Borramos el section en el que se incluyen todas las tareas. Lo ponemos en blanco.
    listTask.innerHTML = ''    
    console.log (listTask)

    // * Se crean los articles (tareas) con el método .forEach (alternativa bucle).
    array.forEach((task) => {

        // Crear las tareas
        const taskHTML = createTaskHTML(task)

        // Añade en cada vuelta al section cada article creado
        listTask.append(taskHTML)
            
        // Pintar la tarea en función de la urgencia.
        colorTask(task.priority, taskHTML)
    })
}     

//* Función para comprobar si introduce bien la nueva tarea en el input. 
const checkEmptyInputAndGetValue = (input) => {
    // Si deja el input de la tarea vacío, se añade la clase is-invalid, que sirve para poner de rojo el border del input, a modo de advertencia.    
    if (input.value.trim() === ''){        
        // Se pone rojo el borde y el placeholder al dejar el campo vacío.
        input.classList.add('is-invalid', 'is-invalid-placeholder-red')      
        
        // Si deja vacío, devuelve null la función.
        return null
    }else{
        formNewTask.writeTask.classList.remove('is-invalid')
        return input.value
    }       
}

//* Función para crear mensaje de alerta cuando le da a guardar sin escribir nada en el campo "nueva tarea".
const createAlertBootstrap = (mensaje = 'Rellena el campo vacío', color = 'danger') => {
    const alertHTML = document.createElement('div')
    alertHTML.className = `alert alert-${color} alert-dismissible shadow position-absolute start-50 top-50 translate-middle-x w-50`
    alertHTML.innerHTML = `
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    <div>${mensaje}</div>    `
        
    const fadeInOut = alertHTML.animate([ 
      { opacity: 0, offset: 0 }, 
      { opacity: 1, offset: 0.1 }, 
      { opacity: 1, offset: 0.9 }, 
      { opacity: 0, offset: 1 } 
    ], { duration: 2500, fill: 'forwards' })  
    
    fadeInOut.addEventListener('finish', () => alertHTML.remove())   
  
    document.body.append(alertHTML)
}

//* Función para crear una nueva tarea en la base de datos.
const createNewTaskBBDD = (pnameTask,ppriorityValue) => {
     // Crear un objeto idéntico al de la base de datos con id, title y priority.
    const newTask = {
        id: nanoid(),
        task: pnameTask, 
        priority: ppriorityValue,
    }
    
    // Hacer un push con una nueva referencia. 
    allTasks = [...allTasks, newTask]
    console.log (allTasks)

    // Método alternativo: meter la nueva tarea en el array ("en la base de datos"), mutando el array original.
    // allTasks.push(newTask)
    
    updateTaskToLocalStorage()   
   
}

//* Función para gestionar el botón de guardar nueva tarea
const handleSubmit = (event) => {
    // Prevenir el comportamiento por defecto del formulario. 
    event.preventDefault()

    // Tras darle a enviar, se ejecuta la función checkEmptyInputAndGetValue, pasando como parámetro el input dónde se escriben las tareas, y la tarea que escribe el usuario se guarda en la variable nameTask.
    const nameTask = checkEmptyInputAndGetValue(formNewTask.writeTask)
    console.log(nameTask)

    // Si deja en blanco el campo se corta la función.
    if (nameTask === null){
        createAlertBootstrap('Escribe tu tarea 😊', 'danger')
        return
    }

    // Guardar en una variable el valor escogido en el select.
    const priorityValue = formNewTask.priority.value
    console.log (priorityValue)   
       
    // Meter la nueva tarea en el array ("en la base de datos").
    createNewTaskBBDD(nameTask, priorityValue)

    // Imprime todos las tareas de nuevo, incluyendo la nueva.    
    printTasks(allTasks)              
}

//* Función para filtrar por prioridad. 
const filterTasksbyPriority = () => {
    const selectedValue = selectFilter.value
    console.log (selectedValue)

    // Generar nuevos arrays, filtrando por prioridad.    
    if (selectedValue === 'allTasks'){
        return(allTasks)        

    }else if (selectedValue === 'urgent'){
        const arrayUrgentTasks = allTasks.filter((task) => {  return task.priority === 'urgent' })
        console.log (arrayUrgentTasks)
        return(arrayUrgentTasks)        

    }else if (selectedValue === 'intermediate'){
        const arrayIntermediateTasks = allTasks.filter((task) => {return task.priority === 'intermediate'})
        console.log (arrayIntermediateTasks)
        return(arrayIntermediateTasks)        

    }else {
        const arrayNomalTasks = allTasks.filter((task) => { return task.priority === 'normal'})
        console.log (arrayNomalTasks)
        return(arrayNomalTasks)        
    }
}

const handleSearchFilter = () => {
    // Obtiene el valor del campo de búsqueda.
    const searchText = searchInput.value.toLowerCase()
    console.log(searchText)

    //Filtar por la prioridad
    const tasksFilterByPriority = filterTasksbyPriority()

    // Filtra las tareas que coincidan con el texto de búsqueda.
    const filteredTasks = tasksFilterByPriority.filter((task) => {
        return task.task.toLowerCase().includes(searchText)       
    })    
    console.log (filteredTasks)
    
    // Imprime las tareas filtradas en la lista de tareas.
    printTasks(filteredTasks)
}

formNewTask.addEventListener('submit', handleSubmit)
selectFilter.addEventListener('change', handleSearchFilter)
searchInput.addEventListener ('input', handleSearchFilter)

getTasksFromLocalStorage()
printTasks(allTasks)

// import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))

