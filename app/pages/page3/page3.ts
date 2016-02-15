import {Page, NavController, Alert, ViewController} from 'ionic-framework/ionic';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';


@Page({
    templateUrl: 'build/pages/page3/page3.html',
})
export class Page3 {
    http: any;
    nav: any;
    users: any[];
    public loading: boolean;
    viewCtrl: any;

    constructor(http: Http, nav: NavController, viewCtrl: ViewController) {
        this.http = http;
        this.nav = nav;
        this.loading = true;
        this.viewCtrl = viewCtrl;

        this.http.get("https://api.github.com/search/users?q=brad+repos:%3E5+followers:%3E30")
            .map(res => res.json())
            .subscribe(data => {
                this.loading = false;
                this.users = data.items;
                console.log(data.items);
            })
    }

    search(searchTerm: string) {
        this.loading = true;
        this.http.get(`https://api.github.com/search/users?q=${searchTerm}+repos:%3E5+followers:%3E30`)
            .map(res => res.json())
            .subscribe(data => {
                if (data.items.length > 0) {
                    this.loading = false;
                    this.users = data.items;
                }
                else {
                    this.loading = false;
                    let alert = Alert.create({
                        title: 'Sorry',
                        subTitle: 'Your search returned nothing, try to search another name.',
                        buttons: ['Dismiss']
                    });
                    this.nav.present(alert);
                }
            })
    }

    follow(user: string) {
        if (localStorage.getItem("authed") !== null) {
            let confirm = Alert.create({
                title: 'Follow this user?',
                body: 'Are you sure you would like to follow this user?',
                buttons: [
                    {
                        text: 'No',
                        handler: () => {
                            console.log('Disagree clicked');
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            let value = "name=" + user;

                            let headers = new Headers();
                            headers.append('Content-Type', 'application/x-www-form-urlencoded');

                            this.http.post('http://104.197.63.74:8080/follow', value, {
                                headers: headers
                            })
                                .map(res => res.json())
                                .subscribe(
                                data => console.log(data),
                                err => console.log("didnt work"),
                                () => window.plugins.toast.showShortBottom('User Followed')
                                );
                        }
                    }
                ]
            });
            this.nav.present(confirm);
        }
        else {
            let prompt = Alert.create({
                title: 'Error',
                body: "You must login to follow a user.",
                inputs: [
                    {
                        name: 'username',
                        placeholder: 'username'
                    },
                    {
                        name: "password",
                        placeholder: "password",
                        type: "password"
                    }
                ],
                buttons: [
                    {
                        text: 'Cancel',
                        handler: data => {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'Login',
                        handler: data => {
                            console.log(data.username);
                            let creds = "username=" + data.username + "&password=" + data.password;

                            let headers = new Headers();
                            headers.append('Content-Type', 'application/x-www-form-urlencoded');

                            this.http.post('http://104.197.63.74:8080/auth', creds, {
                                headers: headers
                            })
                                .map(res => res.json())
                                .subscribe(
                                data => console.log(data),
                                err => { 
                                    console.log("didnt work");
                                    window.plugin.notification.local.add({title: "Login failed", message: 'Login failed, please try again!' });
                                },
                                () => {
                                    localStorage.setItem("authed", "true");
                                    window.plugins.toast.showShortBottom('Logged In')
                                }
                                );

                        }
                    }
                ]
            });
            this.nav.present(prompt);

        }
    }

}