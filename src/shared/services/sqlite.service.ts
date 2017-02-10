import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';

import { IOrganisations, IProducts, IUser } from '../interfaces';
import { ItemsService } from '../services/items.service';

@Injectable()
export class SqliteService {
    db: SQLite;

    constructor(private itemsService: ItemsService) {

    }

    InitDatabase() {
        var self = this;
        this.db = new SQLite();
        self.db.openDatabase({
            name: 'smallorgdb.db',
            location: 'default' // the location field is required
        }).then(() => {
            self.createOrgs();
            self.createProducts();
            self.createUsers();
        }, (err) => {
            console.error('Unable to open database: ', err);
        });
    }

    resetDatabase() {
        var self = this;
        self.resetUsers();
        self.resetOrgs();
        self.resetProducts();
    }

    resetUsers() {
        var self = this;
        let query = 'DELETE FROM Users';
        self.db.executeSql(query, {}).then((data) => {
            console.log('Users removed');
        }, (err) => {
            console.error('Unable to remove users: ', err);
        });
    }

    resetOrgs() {
        var self = this;
        let query = 'DELETE FROM Orgs';
        self.db.executeSql(query, {}).then((data) => {
            console.log('Orgs removed');
        }, (err) => {
            console.error('Unable to remove Orgs: ', err);
        });
    }

    resetProducts() {
        var self = this;
        let query = 'DELETE FROM Products';
        self.db.executeSql(query, {}).then((data) => {
            console.log('Products removed');
        }, (err) => {
            console.error('Unable to remove Products: ', err);
        });
    }

    printOrgs() {
        var self = this;
        self.db.executeSql('SELECT * FROM Orgs', {}).then((data) => {
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                    console.log(data.rows.item(i));
                    console.log(data.rows.item(i).key);
                    console.log(data.rows.item(i).title);
                    console.log(data.rows.item(i).question);
                }
            } else {
                console.log('no Orgs found..');
            }
        }, (err) => {
            console.error('Unable to print Orgs: ', err);
        });
    }

    createOrgs() {
        var self = this;
        self.db.executeSql('CREATE TABLE IF NOT EXISTS Orgs ( key VARCHAR(255) PRIMARY KEY NOT NULL, orgName VARCHAR(255) NOT NULL, address text NOT NULL, email text NOT NULL, USER VARCHAR(255));', {}).then(() => {
        }, (err) => {
            console.error('Unable to create Orgs table: ', err);
        });
    }

    createProducts() {
        var self = this;
        self.db.executeSql('CREATE TABLE IF NOT EXISTS Products ( key VARCHAR(255) PRIMARY KEY NOT NULL, productName VARCHAR(255) NOT NULL, brand VARCHAR(255) NOT NULL, description text NOT NULL, qty INT NULL, rate INT NULL, amount INT NULL, subject text NOT NULL, orgName VARCHAR(255) NOT NULL, USER VARCHAR(255) NOT NULL);', {}).then(() => {
        }, (err) => {
            console.error('Unable to create Products table: ', err);
        });
    }

    createUsers() {
        var self = this;
        self.db.executeSql('CREATE TABLE IF NOT EXISTS Users ( uid text PRIMARY KEY NOT NULL, username text NOT NULL); ', {}).then(() => {
        }, (err) => {
            console.error('Unable to create Users table: ', err);
        });
    }

    saveUsers(users: IUser[]) {
        var self = this;

        users.forEach(user => {
            self.addUser(user);
        });
    }

    addUser(user: IUser) {
        var self = this;
        let query: string = 'INSERT INTO Users (uid, username) Values (?,?)';
        self.db.executeSql(query, [user.uid, user.username]).then((data) => {
            console.log('user ' + user.username + ' added');
        }, (err) => {
            console.error('Unable to add user: ', err);
        });
    }

    saveOrgs(orgs: IOrganisations[]) {
        let self = this;
        let users: IUser[] = [];

        orgs.forEach(org => {
            if (!self.itemsService.includesItem<IUser>(users, u => u.uid === org.user.uid)) {
                console.log('in add user..' + org.user.username);
                users.push(org.user);
            } else {
                console.log('user found: ' + org.user.username);
            }
            self.addOrg(org);
        });

        self.saveUsers(users);
    }

    addOrg(org: IOrganisations) {
        var self = this;

        let query: string = 'INSERT INTO Orgs (key, orgName, address, email, user) VALUES (?,?,?,?,?)';
        self.db.executeSql(query, [
            org.key,
            org.orgName,
            org.address,
            org.email,
            org.user.uid
        ]).then((data) => {
            console.log('org ' + org.key + ' added');
        }, (err) => {
            console.error('Unable to add org: ', err);
        });
    }

    getOrgs(): any {
        var self = this;
        return self.db.executeSql('SELECT Orgs.*, username FROM Orgs INNER JOIN Users ON Orgs.user = Users.uid', {});
    }
}