import {Page, NavController, IonicApp} from 'ionic-framework/ionic';
import {Page1} from '../../pages/page1/page1';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';

@Page({
    templateUrl: 'build/pages/login/login.html'
})
export class Login {

    constructor(public nav: NavController, public http: Http, public app: IonicApp) {
        this.nav = nav;
        this.http = http;
        this.app.getComponent('leftMenu').enable(false);
    }

    login(username: string, password: string) {

        let creds = "username=" + username + "&password=" + password;

        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        this.http.post('http://104.154.34.219:8080/auth', creds, {
            headers: headers
        })
            .map(res => res.json())
            .subscribe(
            data => console.log(data),
            err => {
                window.plugin.notification.local.add({ title: "Login failed", message: 'Login failed, please try again!' });
            },
            () => {
                localStorage.setItem("username", username);
                localStorage.setItem("password", password);
                this.app.getComponent('leftMenu').enable(true);
                this.nav.pop();
                this.nav.push(Page1);
                this.nav.setRoot(Page1);
            }
            );

    }


}
