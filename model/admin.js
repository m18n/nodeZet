const bcrypt = require("bcrypt")
class Admin {
    Admin() {

    }
    async SynchrLoginGetServer() {
        try {
            this.login = await conn.execute("SELECT login FROM admins");
            this.login = this.login[0][0].login;
            return this.login;

        } catch (e) {
            console.log(e);
        }

    }
    async Auth(logine, password) {
        try {
            let test = await conn.execute('SELECT * FROM admins WHERE login = \'' + logine + '\';');
            if (!test[0][0])//none login
               return -1;
            console.log(test[0][0]);
            const validpassword= bcrypt.compareSync(password,test[0][0].password);
            if(!validpassword)
                return -1;
            this.login=test[0][0].login;
            this.password=test[0][0].password;
            this.id=test[0][0].id;
            return this.id;
           

        } catch (e) {
            console.log(e);
        }
    }
    setAuthDate(login,password,id){
        this._login=login;
        this._password=password;
        this._id=id;
    }
    get _login() {
        return this.login;
    }
    set _login(log) {
        this.login = log;
    }
    get _password() {
        return this.password;
    }
    set _password(password) {
        this.password = bcrypt.hashSync(password,7);
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
module.exports.Admin = Admin