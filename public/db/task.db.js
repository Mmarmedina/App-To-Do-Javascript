import { nanoid } from '../../node_modules/nanoid/nanoid.js'

export const allTasks = [
    {
        id: nanoid(),
        task: 'Ir a la farmacia a recoger las medicinas', 
        priority: 'intermediate',
    },
    {
        id: nanoid(),
        task: 'Hacer la compra de la semana si quiero comer', 
        priority: 'urgent',
    },
    {
        id: nanoid(),
        task: 'Llamar a mi amigo para decirle lo guapo que es', 
        priority: 'normal',
    },

]
