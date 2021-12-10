const Proyectos = require('../models/Proyecto')
const Tareas = require('../models/Tareas')

exports.protectosHome = async (req, res) => {
    try {
        const usuarioId = res.locals.usuario.id;
        const proyectos = await Proyectos.findAll({where:{usuarioId}});
        res.render('index', {
            nombrePagina: "Proyectos",
            proyectos
        })
    } catch (error) {
        console.error(error);
    }
  
    
}

exports.formularioProyecto = async (req, res) => {
        const usuarioId = res.locals.usuario.id;
        const proyectos = await Proyectos.findAll({where:{usuarioId}});
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async (req,res) => {
    //Vamos a enviar a la consola lo que el usuario escriba...
    // console.log(req.body);
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}});
        //Validando que tengamos algo en el input
        const { nombre } = req.body;
        let errores = [];

        if(!nombre){
            errores.push({'texto': 'Agrega un nuevo proyecto'})
        }

        //Si hay errores...

        if(errores.length > 0 ){
            res.render('nuevoProyecto', {
                nombrePagina: "Nuevo Proyecto" ,
                errores,
                proyectos
            })
        }else{
            //Si no hay errores Insertar en una base de datos..
            const usuarioId = res.locals.usuario.id;
            await  Proyectos.create({nombre, usuarioId});
            res.redirect('/');
        }



}

exports.proyectoPorUrl = async (req,res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where:{usuarioId}});
    const proyectoPromise =   Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise,proyectoPromise])

    // Consultando tareas del proyecto actual...

    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        // include: [
        //     {model: Proyectos}
        // ]
    });
    
    
    if(!proyecto) return next()
    
    //Crear un render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas 
    })

}

exports.formularioEditar = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where:{usuarioId}});

    const proyectoPromise =   Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise,proyectoPromise])
    res.render('nuevoProyecto', {
        nombrePagina : 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async (req,res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    //Validando que tengamos algo en el input
    const { nombre } = req.body;
    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agrega un nuevo proyecto'})
    }

    //Si hay errores...

    if(errores.length > 0 ){
        res.render('nuevoProyecto', {
            nombrePagina: "Nuevo Proyecto" ,
            errores,
            proyectos
        })
    }else{
        //Si no hay errores Insertar en una base de datos..
        await Proyectos.update(
            {nombre: nombre},
            {where: {id: req.params.id}}
                );
            
      res.redirect('/');
    }


}

exports.eliminarProyecto = async (req,res,next) => {
    // console.log(req.query)
    const {urlProyecto} = req.query;
    const resultado = await Proyectos.destroy({where: {url : urlProyecto}});

    if(!resultado){
        return next();
    }
    res.status(200).send('Proyecto eliminado correctamente')
}

