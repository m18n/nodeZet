const base = require('../model/base')
module.exports =async function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        sch = await base.schema.StaticGetAll("calculators")
        let head = []

        for (let i = 0; i < sch.length; i++) {
            await sch[i].SynchrAllGetServer()
            head.push({ 'name': sch[i].GetVar("name"), 'slug': sch[i].GetVar("slug") })
        }
        res.locals.lamps = head;
        next()
    } catch (e) {
        console.log(e);
        return res.redirect('/adminzet')
    }
}