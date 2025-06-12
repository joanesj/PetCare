const toIndex = (req, res)=>{
    res.render('index.ejs', { user: req.user });
}

module.exports = toIndex;