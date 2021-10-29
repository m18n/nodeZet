
class Lamp {
    vars=[]
    Lamp() {
       
    }
    AddVaribale(){
        console.log("ADD")
        
        for(let i=0;i<arguments.length;i++){
            console.log("Variable")
            this.vars.push(arguments[i]);
        }
    }
    // async SynchrNameGetServer() {
    //     try {
    //         this.login = await conn.execute("SELECT login FROM Admins");
    //         this.login = this.login[0][0].login;
    //         return this.login;

    //     } catch (e) {
    //         console.log(e);
    //     }

    // }
    ShowAll(){
        for(let i=0;i<this.arguments.length;i++){
            console.log("Class argument: "+this.arguments[i]+" \n")
        }
        for(let i=0;i<this.vars.length;i++){
            try{
                console.log("Var name: "+this.vars[i].name+" value: "+this.vars[i].value+"\n")
            }catch(e){
                console.log(e);
            }
        }
        console.log('\n')
    }
    get _id() {
        return this.id;
    }
    set _id(id) {
        this.id = id;
    }
    // async SynchrAllToServer(){

    // }
    // async SynchrAllGetServer(){

    // }
}
module.exports.Lamp = Lamp