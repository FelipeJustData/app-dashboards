module.exports = {
    eUser: function(req, res, next){

        if(req.isAuthenticated()){
            return next()
        }

        req.flash("error_msg", "Faça login para acessar")
        res.redirect("/users/login/"+req.params.name)
                
    }
}