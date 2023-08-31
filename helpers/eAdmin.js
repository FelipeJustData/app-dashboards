module.exports = {
    eAdmin: function(req, res, next){

        if(req.isAuthenticated() && req.user.typ_user == "Administrador"){
            return next()
        }

        req.flash("error_msg", "Você não tem permissão para acessar aqui")
        if(req.params.name_user){
            res.redirect("/users/login/"+req.params.name_user)
        }else{
            res.redirect("/")
        }        
    }
}