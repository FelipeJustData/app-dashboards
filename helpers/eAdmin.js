module.exports = {
    eAdmin: function(req, res, next){

        if(req.isAuthenticated() && req.user.user_type == "Administrador"){
            return next()
        }

        req.flash("error_msg", "Você não tem permissão para acessar aqui")
        res.redirect("/")
    }
}