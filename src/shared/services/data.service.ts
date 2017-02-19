import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IOrganisations, IProducts } from '../interfaces';

declare var firebase: any;

@Injectable()
export class DataService {
    databaseRef: any = firebase.database();
    usersRef: any = firebase.database().ref('users');
    orgsRef: any = firebase.database().ref('organisations');
    productsRef: any = firebase.database().ref('products');
    storageRef: any = firebase.storage().ref();
    connectionRef: any = firebase.database().ref('.info/connected');

    defaultImageUrl: string;
    connected: boolean = false;

    constructor() {
        var self = this;
        try {
            self.checkFirebaseConnection();
            self.InitData();
        } catch (error) {
            console.log('Data Service error:' + error);
        }
    }

    checkFirebaseConnection() {
        try {
            var self = this;
            var connectedRef = self.getConnectionRef();
            connectedRef.on('value', function (snap) {
                console.log(snap.val());
                if (snap.val() === true) {
                    console.log('Firebase: Connected:');
                    self.connected = true;
                } else {
                    console.log('Firebase: No connection:');
                    self.connected = false;
                }
            });
        } catch (error) {
            self.connected = false;
        }
    }

    isFirebaseConnected() {
        return this.connected;
    }

    private InitData() {
        /*let self = this;
        
        self.getStatisticsRef().child('orgs').transaction(function (currentRank) {
            if (currentRank === null) {
                return 1;
            }
        }, function (error, committed, snapshot) {
            if (error) {
                console.log('Transaction failed abnormally!', error);
            } else if (!committed) {
                console.log('We aborted the transaction because there is already one org.');
            } else {
                console.log('Orgs number initialized!');

            }
            console.log('commited', snapshot.val());
        }, false);*/
    }

    getDatabaseRef() {
        return this.databaseRef;
    }

    getConnectionRef() {
        return this.connectionRef;
    }

    goOffline() {
        firebase.database().goOffline();
    }

    goOnline() {
        firebase.database().goOnline();
    }

    getDefaultImageUrl() {
        return this.defaultImageUrl;
    }

    getOrgsRef() {
        return this.orgsRef;
    }

    getProductsRef() {
        return this.productsRef;
    }

    getUsersRef() {
        return this.usersRef;
    }

    getStorageRef() {
        return this.storageRef;
    }

    loadOrgs() {
        return this.orgsRef.once('value');
    }

    submitOrg(org: IOrganisations) {

        var newOrgRef = this.orgsRef.push();
        return newOrgRef.set(org);
    }

    updateOrg(key: string, org: any) {
        this.orgsRef.child(key).update({
            orgName: org.name,
            address: org.address,
            email: org.email
        });
    }

    deleteOrg(key: string) {
        var self = this;
        
        return self.orgsRef.child(key).once('value').then(function(snapshot) {
            var image = snapshot.val().image;
            if (image) {
                var desertRef = self.storageRef.child('images/organisations/' + key + '/org.png');
                desertRef.delete().then(function() {
                    console.log('File deleted successfully');
            
                }).catch(function(error) {
                    console.log('An error occurred!'); 
            
                });
            }
            self.orgsRef.child(key).remove();
        });
    }

    setUserImage(uid: string) {
        this.usersRef.child(uid).update({
            image: true
        });
    }

    setOrgImage(key: string, flag: boolean) {
        this.orgsRef.child(key).update({
            image: flag
        });
    }
    setOrgStatus(key: string, status: string) {
        this.orgsRef.child(key).update({
            status: status
        });
    }
    loadProducts(orgKey: string) {
        return this.productsRef.orderByChild('productName').equalTo(orgKey).once('value');
    }

    getUsername(userUid: string) {
        return this.usersRef.child(userUid + '/username').once('value');
    }

    getUser(userUid: string) {
        return this.usersRef.child(userUid).once('value');
    }

    getUserOrgs(userUid: string) {
        return this.orgsRef.orderByChild('user/uid').equalTo(userUid).once('value');
    }
    getOrg(key: string) {
        return this.orgsRef.child(key).once('value');
    }
    getUserProducts(userUid: string) {
        return this.productsRef.orderByChild('user/uid').equalTo(userUid).once('value');
    }
}