const { Router } = require('express')
const base = require('../model/base')
const router = Router()
const csrf = require('csurf')
const https = require('https')
const e = require('express')
var csrfProtection = csrf({ cookie: true })


router.get("/", async (req, res) => {

    lamp = await base.schema.StaticGetWhere("lamps", "global", 1)
  
    if (!lamp[0]) {
        console.log("LAMP");
        res.render("index", { title: "Zet" })
    } else {
        
        await lamp[0].SynchrAllGetServer()
        let obj = lamp[0].GetObjectAll()
        let index = 0
        console.log("LAMP2");
        if(obj.photo!=""){
            while (true) {
                if (obj.photo[index] == '\n')
                    break;
                index++;
            }
        }
        
        photo = obj.photo.substring(0, index);
        
        res.render("index", { title: "Zet", ph: photo, lamp: obj })
    }
})
router.get("/shop",async (req, res) => {
    lamp=await base.schema.StaticGetAll("lamps");
    let objlamp=[];
    for(let i=0;i<lamp.length;i++){
        await lamp[i].SynchrAllGetServer();
        objlamp[i]=lamp[i].GetObjectAll();
        let photos = objlamp[i].photo.split('\n')
        photos.length = photos.length - 1;
        objlamp[i].photo=photos[0];
    }
    
   
    res.render("shop", { title: "Zet Shop", layout: 'model',lamp:objlamp })
})
router.get("/model/:model", async (req, res) => {
    lamp = await base.schema.StaticGetWhere("lamps", "slug", req.params.model)
    await lamp[0].SynchrAllGetServer()
    let obj = lamp[0].GetObjectAll()
    let photos = obj.photo.split('\n')
    photos.length = photos.length - 1;
    photos.forEach(element => {
        console.log(element)
    });

    res.render('model', { layout: 'model', lamp: obj, photos: photos, firs_photo: photos[0] })
})
ParseCal = (str) => {
    let obj = []
    console.log("STR "+str)
    if(str==null)
        return obj;
    let strs = str.split('\n')
    obj.length = strs.length
    for (let i = 0; i < strs.length; i++) {
        obj[i] = {}
        let temp = strs[i].split(':')
        obj[i].name = temp[0]
        obj[i].price = temp[1]

    }

    return obj
}
router.get("/model/:model/buy", csrfProtection, async (req, res) => {
    lamp = await base.schema.StaticGetWhere("lamps", "slug", req.params.model)
    await lamp[0].SynchrAllGetServer()
    let obj = lamp[0].GetObjectAll()
    let index = 0
    if(obj.photo!=""){
    while (true) {
        if (obj.photo[index] == '\n')
            break;
        index++;
    }
}
    photo = obj.photo.substring(0, index);
    cal = await base.schema.StaticGetWhere("calculators", "id", obj.calculator_id)
    if(cal.length!=0){
    await cal[0].SynchrAllGetServer()
    let calarr = {}
    calarr.bat = ParseCal(cal[0].GetVar("battery"))
    calarr.charging = ParseCal(cal[0].GetVar("charging"))
    calarr.body = ParseCal(cal[0].GetVar("body"))
    calarr.delivery = ParseCal(cal[0].GetVar("delivery"))

    res.render('buymodel', { layout: 'model', lamp: obj, title: lamp[0].GetVar("name") + " ????????????", calarr: calarr, photo: photo, csrfToken: req.csrfToken(), base_compl: cal[0].GetVar("base_compl") })
    }else
        res.render("error")
})


SendTelegram = (id, text) => {
    https.get("https://api.telegram.org/bot934678082:AAGqbOr6By7qaWljmkUNXDMqvLR79z4hA0Q/sendMessage?chat_id=" + id + "git&text=" + text, res => {
        console.log("SEND")
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', d => {
            process.stdout.write(d)
        })
    })
}
router.post("/model/:model/buy/submit", csrfProtection, async (req, res) => {
    lamp = await base.schema.StaticGetWhere("lamps", "slug", req.params.model)
    await lamp[0].SynchrAllGetServer()
    let order = {}
    let batteryt = req.body.battery.split("/");
    let bodyt = req.body.body.split("/");
    let chargingt = req.body.charging.split("/");
    let deliveryt = req.body.delivery.split("/");
    let allprice = parseInt(batteryt[1]) + parseInt(chargingt[1]) + parseInt(bodyt[1]) + parseInt(deliveryt[1]) + parseInt(req.body.price);
    const options = {
        hostname: '',
        port: 443,
        path: '',
        method: 'GET'
    }
    let df = encodeURIComponent("\n")
    SendTelegram("777759236", "??????: " + req.body.name + df + "??????: " + batteryt[0] + df + "??????????????: " +
        chargingt[0] + df + "????????????: " + bodyt[0] + df + "????????????????: " + deliveryt[0] + df + "??????????????: " +
        req.body.telephone + df + "????????????????????: " + req.body.note + df + "????????: " + allprice + df + "????????????: " + lamp[0].GetVar("name"))
    SendTelegram("412713622", "??????: " + req.body.name + df + "??????: " + batteryt[0] + df + "??????????????: " +
        chargingt[0] + df + "????????????: " + bodyt[0] + df + "????????????????: " + deliveryt[0] + df + "??????????????: " +
        req.body.telephone + df + "????????????????????: " + req.body.note + df + "????????: " + allprice + df + "????????????: " + lamp[0].GetVar("name"))

    res.redirect("/buyend")
})
router.get("/buyend", (req, res) => {
    return res.render("thanbuy.hbs", { layout: "model.hbs" })

})
module.exports = router