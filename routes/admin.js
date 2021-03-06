const { Router } = require('express')
const router = Router()
const admin = require('../model/admin')
const jwt = require('jsonwebtoken')
const csrf = require('csurf')

const config = require('../config')
const base = require('../model/base')
var csrfProtection = csrf({ cookie: true })
const authMiddleware = require('../middlewarre/authmidl')
const calMiddleware = require('../middlewarre/admin-calmidl')
const adminMiddleware = require('../middlewarre/admin-modelmidl')
const multer = require('multer')
const upload = multer({ dest: "public/upload/models/" })

generateAccessToken = (id) => {
    const payload = {
        id
    }
    return jwt.sign(payload, config.secret, { expiresIn: "30d" })
}
router.get('/', csrfProtection, async (req, res) => {
    if (req.cookies.token)
        res.status(301).redirect('/adminzet/adminpanel')
    else
        res.render("adminlogin.hbs", { layout: '', csrfToken: req.csrfToken() })
})
router.post('/submit', csrfProtection, async (req, res) => {
    ad = new admin.Admin();

    const id = await ad.Auth(req.body.user_name, req.body.password)
    if (id == -1)
        res.status(301).redirect("/adminzet")
    else {
        const token = generateAccessToken(id)
        res.cookie('token', token, {
            maxAge: 24 * 60 * 60 * 1000
        })
        res.redirect('/adminzet/adminpanel')
    }
})
router.get('/adminpanel', adminMiddleware, authMiddleware, async (req, res) => {


    res.render('adminpanel.hbs', { layout: 'admin' })
})

router.get('/adminpanel/model/:model', authMiddleware, adminMiddleware, async (req, res) => {

    let s = -1
    for (let i = 0; i < sch.length; i++) {
        if (sch[i].GetVar("slug") == req.params.model) {
            s = i
            break;
        }
    }
    if (s == -1)
        res.send("Error Model")

    console.log(sch[s].GetVar("calculator_id"))
    obje = sch[s].GetObjectAll()
  
    
    let photos = obje.photo.split('\n')//GET PHOTO
    photos.length = photos.length - 1;
    let cal = await base.schema.StaticGetAll("calculators")
    let headcal = [];
    let ide = -1
    for (let i = 0; i < cal.length; i++) {
        await cal[i].SynchrAllGetServer()
        headcal.push(cal[i].GetVar("name"))
        if (cal[i].GetVar("id") == sch[s].GetVar("calculator_id"))
            ide = i
    }
    let name;
    if(ide!=-1){
        headcal.splice(ide, 1)
        name=cal[ide].GetVar("name");
    }
    res.render('adminmodel.hbs', { layout: 'admin', lamp: obje, cals: headcal, cal: name,photo:photos })
})
router.get('/adminpanel/addmodel', authMiddleware, adminMiddleware, async (req, res) => {

   

    
    // await sch[s].CreateConn("calculator_id","calculators",sch[s].GetVar("calculator_id"))
    // 
    // let clobj=obje.calculator_id.GetObjectAll()
    // obje.calculator_id=clobj
    
    let cal = await base.schema.StaticGetAll("calculators")
    let headcal = [];
    for (let i = 0; i < cal.length; i++) {
        await cal[i].SynchrAllGetServer()
        headcal.push(cal[i].GetVar("name"))
    }
   
    res.render('adminaddmodel.hbs', { layout: 'admin', cals: headcal })
})
router.post('/adminpanel/addmodelsubmit', upload.array('photos'), authMiddleware, adminMiddleware, async (req, res) => {

   

    
    // await sch[s].CreateConn("calculator_id","calculators",sch[s].GetVar("calculator_id"))
    // 
    // let clobj=obje.calculator_id.GetObjectAll()
    // obje.calculator_id=clobj
    let sc= new base.schema();
    sc.nametable="lamps"
    let path = "";
    for (let i = 0; i < req.files.length; i++) {
        path += req.files[i].filename + "\n"
    }
    sc.AddVar("name", req.body.name)
    sc.AddVar("description", req.body.des)
    sc.AddVar("short_des", req.body.short_des)
    sc.AddVar("slug", req.body.slug)
    sc.AddVar("price", req.body.price)
    if(req.body.cal){
        let cal = await base.schema.StaticGetWhere("calculators", "name", req.body.cal)  
        sc.AddVar("calculator_id", cal[0]._id)
    }else{
        sc.AddVar("calculator_id", "-1")
    }
    if (req.body.global)
        sc.AddVar("global", 1)
    else
        sc.AddVar("global", 0)
    sc.AddVar("photo", path)
    
    await sc.CreateObjectServer()
    res.redirect("/adminzet/adminpanel/model/" + sc.GetVar("slug"))
})
router.get('/adminpanel/model/:model/deleteallphoto', authMiddleware, adminMiddleware, async (req, res) => {

    let s = -1
    for (let i = 0; i < sch.length; i++) {
        if (sch[i].GetVar("slug") == req.params.model) {
            s = i
            break;
        }
    }
    if (s == -1)
        res.send("Error Model")
    sch[s].SetVar("photo","")
    await sch[s].SynchrVarSetServer("photo");
    res.redirect("/adminzet/adminpanel/model/" + sch[s].GetVar("slug"))
})
router.get('/adminpanel/model/:model/photo/:index/delete', authMiddleware, adminMiddleware, async (req, res) => {

    let s = -1
    for (let i = 0; i < sch.length; i++) {
        if (sch[i].GetVar("slug") == req.params.model) {
            s = i
            break;
        }
    }
    if (s == -1)
        res.send("Error Model")
        
   
    let photo=sch[s].GetVar("photo")
    console.log("PHOTOOO: \n"+photo);
    let photos = photo.split('\n');
    photos.length = photos.length - 1;
    photos.splice(req.params.index, 1); 
    let photostr="";
    for(let i=0;i<photos.length;i++){
        photostr+=photos[i]+"\n";
    
    }
    sch[s].SetVar("photo",photostr);
    await sch[s].SynchrVarSetServer("photo");
    res.redirect("/adminzet/adminpanel/model/" + sch[s].GetVar("slug"))
})
router.get('/adminpanel/model/:model/photo/:index/up', authMiddleware, adminMiddleware, async (req, res) => {

    let s = -1
    for (let i = 0; i < sch.length; i++) {
        if (sch[i].GetVar("slug") == req.params.model) {
            s = i
            break;
        }
    }
    if (s == -1)
        res.send("Error Model")
    let index=parseInt(req.params.index);
    
    if(index!=0){
        let photo=sch[s].GetVar("photo")
        console.log("PHOTOOO: \n"+photo);
        let photos = photo.split('\n');
        photos.length = photos.length - 1;
       
        
        let temp=photos[index];
        photos[index]=photos[index-1];
        photos[index-1]=temp;

        let photostr="";
        for(let i=0;i<photos.length;i++){
            photostr+=photos[i]+"\n";
        
        }

        sch[s].SetVar("photo",photostr);
        await sch[s].SynchrVarSetServer("photo");
    }
    res.redirect("/adminzet/adminpanel/model/" + sch[s].GetVar("slug"))
})
router.get('/adminpanel/model/:model/photo/:index/down', authMiddleware, adminMiddleware, async (req, res) => {

    let s = -1
    for (let i = 0; i < sch.length; i++) {
        if (sch[i].GetVar("slug") == req.params.model) {
            s = i
            break;
        }
    }
    if (s == -1)
        res.send("Error Model")
    let index=parseInt(req.params.index);
    
        let photo=sch[s].GetVar("photo")
        console.log("PHOTOOO: \n"+photo);
        let photos = photo.split('\n');
        photos.length = photos.length - 1;
    
    if(index!=photos.length-1){
        for(let i=0;i<photos.length;i++){
            console.log("i: "+i+" Photo: "+photos[i]+"\n");
            
        }
        let tempe=photos[index];
       
        photos[index]=photos[index+1];
        photos[index+1]=tempe;
       
        let photostr="";
        for(let i=0;i<photos.length;i++){
            photostr+=photos[i]+"\n";
        
        }
        
        console.log("PHOTOSTR: "+photostr+"\n");
        sch[s].SetVar("photo",photostr);
        await sch[s].SynchrVarSetServer("photo");
    }
    res.redirect("/adminzet/adminpanel/model/" + sch[s].GetVar("slug"))
})
router.post('/adminpanel/model/:model/editsubmit', upload.array('photos'), authMiddleware, adminMiddleware, async (req, res) => {

    let s = -1
    for (let i = 0; i < sch.length; i++) {
        if (sch[i].GetVar("slug") == req.params.model) {
            s = i
            break;
        }
    }
    if (s == -1)
        res.send("Error Model")

    let path = "";
    for (let i = 0; i < req.files.length; i++) {
        path += req.files[i].filename + "\n"
    }
    sch[s].SetVar("name", req.body.name)
    sch[s].SetVar("description", req.body.des)
    sch[s].SetVar("short_des", req.body.short_des)
    sch[s].SetVar("slug", req.body.slug)
    sch[s].SetVar("price", req.body.price)
    if(req.body.cal){
        let cal = await base.schema.StaticGetWhere("calculators", "name", req.body.cal)  
        sch[s].SetVar("calculator_id", cal[0]._id)
    }else{
        sch[s].SetVar("calculator_id", "-1")
    }
    if (req.body.global)
        sch[s].SetVar("global", 1)
    else
        sch[s].SetVar("global", 0)
    if (path == "")
        sch[s].DeleteVar("photo")
    else
        sch[s].SetVar("photo", path)
    await sch[s].SynchrAllSetServer()
    res.redirect("/adminzet/adminpanel/model/" + sch[s].GetVar("slug"))
})

router.post('/adminpanel/model/:model/photo/:index/editphoto', upload.single('photo'), authMiddleware, adminMiddleware, async (req, res) => {

    let s = -1
    for (let i = 0; i < sch.length; i++) {
        if (sch[i].GetVar("slug") == req.params.model) {
            s = i
            break;
        }
    }
    if (s == -1)
        res.send("Error Model")
    let photo=sch[s].GetVar("photo")
    let photos = photo.split('\n');
    photos.length = photos.length - 1;
    let index=parseInt(req.params.index);
    console.log("EDIT");

    console.log(req.file.filename);
    photos[index]=req.file.filename;
    let photostr="";
    for(let i=0;i<photos.length;i++){
        photostr+=photos[i]+"\n"; 
    }

    sch[s].SetVar("photo",photostr);
    await sch[s].SynchrVarSetServer("photo");
    res.redirect("/adminzet/adminpanel/model/" + sch[s].GetVar("slug"))
})
router.post('/adminpanel/model/:model/delete', authMiddleware, adminMiddleware, async (req, res) => {

    let s = -1
    for (let i = 0; i < sch.length; i++) {
        if (sch[i].GetVar("slug") == req.params.model) {
            s = i
            break;
        }
    }
    if (s == -1)
        res.send("Error Model")

    await sch[s].DeleteObject()
    res.redirect("/adminzet/adminpanel")
})
router.get('/adminpanel/calculators', authMiddleware, calMiddleware, async (req, res) => {

    res.render('admincal.hbs', { layout: 'admincal' })

});
router.get('/adminpanel/calculator/:model', authMiddleware, calMiddleware, async (req, res) => {

    let s = -1
    for (let i = 0; i < sch.length; i++) {
        if (sch[i].GetVar("slug") == req.params.model) {
            s = i
            break;
        }
    }
    if (s == -1)
        res.send("Error Model")
    // await sch[s].CreateConn("calculator_id","calculators",sch[s].GetVar("calculator_id"))
    // 
    // let clobj=obje.calculator_id.GetObjectAll()
    // obje.calculator_id=clobj
    let cal=sch[s].GetObjectAll()
    
    
    res.render('admincalmodel.hbs', { layout: 'admincal',cal:cal})
})
router.get('/adminpanel/addcal', authMiddleware, calMiddleware, async (req, res) => {

    // await sch[s].CreateConn("calculator_id","calculators",sch[s].GetVar("calculator_id"))
    // 
    // let clobj=obje.calculator_id.GetObjectAll()
    // obje.calculator_id=clobj
    
    
    
    res.render('adminaddcal.hbs', { layout: 'admincal'})
})
router.post('/adminpanel/addcalsubmit', authMiddleware, calMiddleware, async (req, res) => {

    // await sch[s].CreateConn("calculator_id","calculators",sch[s].GetVar("calculator_id"))
    // 
    // let clobj=obje.calculator_id.GetObjectAll()
    // obje.calculator_id=clobj
    console.log("CONSSS")
    let sc=new base.schema();
    sc.nametable="calculators"
    sc.AddVar("name",req.body.name)
    sc.AddVar("battery",req.body.battery)
    sc.AddVar("body",req.body.body)
    sc.AddVar("delivery",req.body.delivery)
    sc.AddVar("base_compl",req.body.base_compl)
    sc.AddVar("slug",req.body.slug)
    sc.AddVar("charging",req.body.charging)
    await sc.CreateObjectServer()
    res.redirect("/adminzet/adminpanel/calculator/" + sc.GetVar("slug"))
})
router.post('/adminpanel/calculator/:model/editsubmit', authMiddleware, calMiddleware, async (req, res) => {

    let s = -1
    for (let i = 0; i < sch.length; i++) {
        if (sch[i].GetVar("slug") == req.params.model) {
            s = i
            break;
        }
    }
    if (s == -1)
        res.send("Error Model")
    // await sch[s].CreateConn("calculator_id","calculators",sch[s].GetVar("calculator_id"))
    // 
    // let clobj=obje.calculator_id.GetObjectAll()
    // obje.calculator_id=clobj
    //name battery charging body delivery base_compl slug
    sch[s].SetVar("name",req.body.name)
    sch[s].SetVar("battery",req.body.battery)
    sch[s].SetVar("body",req.body.body)
    sch[s].SetVar("delivery",req.body.delivery)
    sch[s].SetVar("base_compl",req.body.base_compl)
    sch[s].SetVar("slug",req.body.slug)
    sch[s].SetVar("charging",req.body.charging)
    await sch[s].SynchrAllSetServer()
    res.redirect("/adminzet/adminpanel/calculator/" + sch[s].GetVar("slug"))
})
router.post('/adminpanel/calculator/:model/delete', authMiddleware, calMiddleware, async (req, res) => {

    let s = -1
    for (let i = 0; i < sch.length; i++) {
        if (sch[i].GetVar("slug") == req.params.model) {
            s = i
            break;
        }
    }
    if (s == -1)
        res.send("Error Model")
    await sch[s].DeleteObject();
    res.redirect("/adminzet/adminpanel/calculators")
})
module.exports = router