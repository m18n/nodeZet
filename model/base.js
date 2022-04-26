
class cell {


    constructor(name, value) {

        this.name = name
        this.value = value
    }
    Init(name, value) {
        this.name = name
        this.value = value
    }
}
class schema {
    constructor(nametable) {
        this.vars=[];
        this.id = -1
        this.nametable = nametable
    }
    AddVar() {
        for (let i = 0; i < arguments.length; i += 2) {
            let temp = new cell()
            temp.Init(arguments[i], arguments[i + 1])

            this.vars.push(temp);
        }
    }
    GetVar(name) {
        for (let i = 0; i < this.vars.length; i++) {
            if (name == this.vars[i].name)
                return this.vars[i].value
        }
    }
    SetVar(name, variable) {
        for (let i = 0; i < this.vars.length; i++) {
            if (name == this.vars[i].name)
                this.vars[i].value = variable
        }
    }
    SearchVar(name) {
        for (let i = 0; i < this.vars.length; i++) {
            if (name == this.vars[i].name)
                return i
        }
        return -1
    }
    set _id(id) {
        this.id = id
    }
    get _id() {
        return this.id
    }
    async SynchrAllGetServer(){
        try {
            if (this.id == -1) {
                console.log("you need to create an object\n");
                return;
            }
            
            let vare = await conn.execute("SELECT * FROM " + this.nametable + " WHERE id = '" + this.id + "';");
           
            for (var name in vare[0][0]){
                let i=this.SearchVar(name)
                if(i==-1){
                    this.AddVar(name,vare[0][0][''+name+''])
                }else{
                    this.vars[i].value=vare[0][0][''+name+'']
                }
                
            }
            
            
            
         
        } catch (e) {
            console.log(e);
        }
    }
    DeleteVar(namevar){
        for(let i=0;i<this.vars.length;i++){
            if(this.vars[i].name==namevar){
                this.vars.slice(i,1)
                return;
            }
        }
    }
   
    async SynchrAllSetServer(){
        try {
            if (this.id == -1) {
                console.log("you need to create an object\n");
                return;
            }
            let str="UPDATE "+this.nametable+" SET ";
            for(let i=0;i<this.vars.length;i++){
                if(i==this.vars.length-1)
                    str+=this.vars[i].name+" = '"+this.vars[i].value+"'"
                else
                    str+=this.vars[i].name+" = '"+this.vars[i].value+"',"
            }
            str+= " WHERE id = " + this.id + ";"
            console.log(str)
            let vare = await conn.execute(str);
            if (!vare)
                console.log("ERROR SET SERVER\n")
         
        } catch (e) {
            console.log(e);
        }
    }
    async SynchrVarGetServer(namevar) {
        try {
            if (this.id == -1) {
                console.log("you need to create an object\n");
                return;
            }
            let i = this.SearchVar(namevar)
            
            if (i == -1) {
               
                this.AddVar(namevar, null)
                i=this.vars.length-1
                
            }
            let vare = await conn.execute("SELECT * FROM " + this.nametable + " WHERE id = '" + this.id + "';");
            
            this.vars[i].value = vare[0][0][namevar]
            
            return this.vars[i].value
        } catch (e) {
            console.log(e);
        }

    }
    async CreateConn(namevar,nametable,id){
        for(let i=0;i<this.vars.length;i++){
            
            if(namevar==this.vars[i].name){
                let ob=new schema(nametable)
                ob._id=id
                await ob.SynchrAllGetServer()
            
                this.vars[i].value=ob
                console.log("Create Con")
                return;
            }
        }
        console.log("Error Creaete Con")
    }
    GetObjectAll(){
        let obj={}
        for(let i=0;i<this.vars.length;i++){
            obj[''+this.vars[i].name+'']=this.vars[i].value
        }
        return obj
    }
    static async StaticGetAll(nametable) {
        try {
            let vare = await conn.execute("SELECT id FROM " + nametable + ";");
            let sch = [];
            
            let length=vare[0].length
            
            console.log("Leng "+length)
            sch.length = length
            for (let i = 0; i < length; i++) {
                sch[i] = new schema(nametable)
               
                sch[i]._id = vare[0][i].id
                
            }
            return sch
        } catch (e) {
            console.log(e);
        }
    }
    static async StaticGetWhere(nametable,columname,columvalue){
        try {
            let vare = await conn.execute("SELECT id FROM " + nametable + " WHERE "+columname+" = '" + columvalue + "';");
            let sch = [];
            let length=vare[0].length
            console.log("Leng "+length)
            sch.length = length
            for (let i = 0; i < length; i++) {
                sch[i] = new schema(nametable)
               
                sch[i]._id = vare[0][i].id
                
            }
            return sch
        } catch (e) {
            console.log(e);
        }
    }
    async SynchrVarSetServer(namevar) {
        try {
            if (this.id == -1) {
                console.log("you need to create an object\n");
                return;
            }
            let i = this.SearchVar(namevar)
            if(i==-1)
            {
                console.log("ERROR Search variable\n")
                return 
            }
            let vare = await conn.execute("UPDATE " + this.nametable + " SET " + namevar + " = '" + this.vars[i].value + "' WHERE id = " + this.id + ";");
            if (!vare)
                console.log("ERROR SET SERVER\n")

        } catch (e) {
            console.log(e);
        }

    }
    async CreateObjectServer() {
        try {
            let str = "INSERT INTO " + this.nametable + " (";
            for (let i = 0; i < this.vars.length; i++) {
                if (i == this.vars.length - 1)
                    str += this.vars[i].name + ")"
                else
                    str += this.vars[i].name + ", "
            }
            str += " VALUES ('"
            for (let i = 0; i < this.vars.length; i++) {
                if (i == this.vars.length - 1)
                    str += this.vars[i].value + "')"
                else
                    str += this.vars[i].value + "', '"
            }
            str += ";"
            console.log(str + '\n')
            let ot = await conn.execute(str)
            if (ot) {
                this.id = ot[0].insertId
            }
            else
                console.log("ERROR CREATE OBJECT\n")
        } catch (e) {
            console.log(e);
        }
    }
    async DeleteObject(){
        try{
            let str="DELETE FROM "+this.nametable+" WHERE id="+this.id;
            let ot =await conn.execute(str);
            if (!ot) 
                console.log("ERROR DELETE")
        }catch(e){
            console.log(e);
        }
    }
}
module.exports.cell = cell
module.exports.schema = schema