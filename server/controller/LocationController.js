const mysql = require("mysql")

const pool = mysql.createPool({
    host: process.env.HOST,
    user: "root",
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});


exports.view = (req, res) => {
    
    pool.getConnection((err,conn) => {
        if(err)
            throw err;
        console.log("connected ID " + conn.threadId);

        conn.query("SELECT * FROM location", (err,rows) => {
            conn.release()

            if(!err){
                let removedUser = req.query.removed
                res.render("home", {rows, removedUser})
            }
            else
                console.log("error found")
        })

    });
    
}

exports.find = (req,res) => {


    pool.getConnection((err,conn) => {
        if(err)
            throw err;
        console.log("connected ID " + conn.threadId);

        let searchTerm = req.body.search

        conn.query("SELECT * FROM location WHERE name LIKE ? OR design LIKE ?",['%' + searchTerm + '%','%' + searchTerm + '%'], (err,rows) => {
            conn.release()

            if(!err)
                res.render("home", {rows})
            else
                console.log("error found")
        })

    });
}


exports.form = (req,res) => {
    res.render("add-form");
}


exports.create = (req,res) => {
    pool.getConnection((err,conn) => {
        if(err)
            throw err;
        console.log("connected ID " + conn.threadId);
    
        const {name, design, jour, taux} = req.body;

        conn.query('INSERT INTO location SET name = ?, design = ?, jour = ?, taux = ?', [name, design, jour,taux], (err,rows) => {
            conn.release()

            if(!err)
                res.render("add-form",{alert: "Successfully added"})
            else
                console.log("error found")
        })

    });
}

exports.edit = (req,res) => {
    pool.getConnection((err,conn) => {
        if(err)
            throw err;
        console.log("connected ID " + conn.threadId);

        conn.query("SELECT * FROM location WHERE id = ?", [req.params.id], (err,rows) => {
            conn.release()

            if(!err)
                res.render("edit-form", {rows})
            else
                console.log("error found")
        })

    });
}



exports.update = (req,res) => {
    pool.getConnection((err,conn) => {
    if(err)
        throw err;
    console.log("connected ID " + conn.threadId);

    const {name, design, jour, taux} = req.body;

    conn.query("UPDATE location SET name = ?, design = ?, jour = ?, taux = ? WHERE id = ?",[name,design,jour,taux,req.params.id], (err,rows) => {
        conn.release()
        if(!err){

            pool.getConnection((err,conn) => {
                if(err)
                    throw err;
                console.log("connected ID " + conn.threadId);
        
                conn.query("SELECT * FROM location WHERE id = ?", [req.params.id], (err,rows) => {
                    conn.release()
        
                    if(!err)
                        res.render("edit-form", {rows, alert: `${name} a bien été modifié`})
                    else
                        console.log("error found")
                })
        
            });
        }
        else
            console.log("error found")
})

});
}


exports.delete = (req,res) => {
    pool.getConnection((err,conn) => {
        if(err)
            throw err;
        console.log("connected ID " + conn.threadId);

        conn.query("DELETE FROM location WHERE id = ?", [req.params.id], (err,rows) => {
            conn.release();

            if(!err){
                let removedUser = encodeURIComponent("location successfully removed")
                res.redirect('/?removed=' + removedUser);
            }
            else
                console.log("error found");
        })

    });
}

exports.detail = (req, res) => {
    
    pool.getConnection((err,conn) => {
        if(err)
            throw err;
        console.log("connected ID " + conn.threadId);

        conn.query("SELECT * FROM location WHERE id = ?", [req.params.id], (err,rows) => {
            conn.release()

            if(!err)
                res.render("view-detail", {rows})
            else
                console.log("error found")
        })

    });
    
}